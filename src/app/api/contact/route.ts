import { type NextRequest, NextResponse } from "next/server";
import { contactConfigured, sendContactEmail } from "@/lib/contact/email";
import { messageStoreConfigured, saveMessage } from "@/lib/contact/store";
import { contactSchema, fieldErrors, looksAutomated } from "@/lib/contact/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8192;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/** Best-effort limit per address. It resets when the server instance is recycled, which is fine for a small site. */
const recent = new Map<string, number[]>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    recent.set(ip, hits);
    return true;
  }
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return false;
}

function decodeCity(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value).slice(0, 80);
  } catch {
    return value.slice(0, 80);
  }
}

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return json({ ok: false, error: "forbidden" }, 403);

  if (Number(req.headers.get("content-length") ?? "0") > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: "invalid", fields: fieldErrors(parsed.error) }, 400);
  const input = parsed.data;

  // Answer bots as if it worked, so they learn nothing, and send nothing.
  if (looksAutomated(input)) return json({ ok: true }, 200);

  // A message can be emailed, kept for the owner's dashboard, or both. With neither set up, say so.
  if (!contactConfigured() && !messageStoreConfigured()) return json({ ok: false, error: "not_configured" }, 503);

  const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) return json({ ok: false, error: "rate_limited" }, 429);

  let page: string | null = null;
  try {
    const ref = req.headers.get("referer");
    page = ref ? new URL(ref).pathname.slice(0, 120) : null;
  } catch {
    page = null;
  }

  const sent = await sendContactEmail(input, { page });
  if (!sent.ok && sent.detail !== "not_configured") console.error("contact form: email not sent:", sent.detail);

  const country = req.headers.get("x-vercel-ip-country");
  const stored = await saveMessage(input, {
    page,
    country: country && /^[A-Z]{2}$/.test(country) ? country : null,
    city: decodeCity(req.headers.get("x-vercel-ip-city")),
    emailSent: sent.ok,
  });

  // The visitor is told it worked when the message reached the inbox or the dashboard.
  if (!sent.ok && !stored) return json({ ok: false, error: "send_failed" }, 502);
  return json({ ok: true }, 200);
}
