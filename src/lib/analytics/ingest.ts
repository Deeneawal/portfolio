import "server-only";
import { userAgent, type NextRequest } from "next/server";
import { getServiceClient } from "../supabase";
import { OWNER_COOKIE, ADMIN_COOKIE } from "../auth/cookies";
import { verifyToken } from "../auth/session";
import { isBotUserAgent } from "./bot";
import type { EventType } from "./schema";
import { visitorHash } from "./visitor";
import { isMissingTableError, storeEvent } from "./storageStore";

export interface EventRow {
  type: EventType;
  path: string;
  story_slug: string | null;
  target: string | null;
  referrer_host: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  likely_human: boolean | null;
  visitor_hash: string;
  session_id: string | null;
  engaged_ms: number | null;
}

/** Tracking only runs in production (or when explicitly forced for local verification) and when configured. */
export function trackingEnabled(): boolean {
  const env = process.env.VERCEL_ENV ?? (process.env.ANALYTICS_FORCE === "1" ? "production" : "development");
  return env === "production" && Boolean(process.env.VISITOR_SALT_SECRET) && getServiceClient() !== null;
}

export function clientIp(req: NextRequest): string {
  return req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
}

function decodeHeader(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value).slice(0, 80);
  } catch {
    return value.slice(0, 80);
  }
}

/** True when the request comes from the site owner (signed cookie), whose own visits are never counted. */
export async function isOwnerRequest(req: NextRequest): Promise<boolean> {
  const owner = await verifyToken(req.cookies.get(OWNER_COOKIE)?.value, "owner", process.env.ADMIN_SESSION_SECRET);
  if (owner) return true;
  return verifyToken(req.cookies.get(ADMIN_COOKIE)?.value, "admin", process.env.ADMIN_SESSION_SECRET);
}

/** Returns null for bots. Geo and device details come from Vercel's edge headers and the user agent. */
export function baseRow(req: NextRequest): Omit<EventRow, "type" | "path" | "story_slug" | "target" | "session_id" | "engaged_ms" | "likely_human"> | null {
  const ua = req.headers.get("user-agent");
  if (isBotUserAgent(ua)) return null;
  const agent = userAgent(req);
  const deviceType = agent.device.type;
  const country = req.headers.get("x-vercel-ip-country");
  return {
    referrer_host: null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    country: country && /^[A-Z]{2}$/.test(country) ? country : null,
    region: decodeHeader(req.headers.get("x-vercel-ip-country-region")),
    city: decodeHeader(req.headers.get("x-vercel-ip-city")),
    device: deviceType === "mobile" || deviceType === "tablet" ? deviceType : "desktop",
    browser: agent.browser.name?.slice(0, 40) ?? null,
    os: agent.os.name?.slice(0, 40) ?? null,
    visitor_hash: visitorHash(clientIp(req), ua ?? "", process.env.VISITOR_SALT_SECRET ?? ""),
  };
}

export async function insertEvent(row: EventRow): Promise<void> {
  const supabase = getServiceClient();
  if (!supabase) return;
  const { error } = await supabase.from("events").insert(row);
  if (isMissingTableError(error)) return storeEvent(supabase, row);
  if (error) console.error("[analytics] insert failed:", error.message);
}

// Best-effort per-instance rate limit; serverless instances are short-lived, so this only blunts bursts.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 90;
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimited(key: string, now = Date.now()): boolean {
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    if (hits.size > 5000) hits.clear();
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}
