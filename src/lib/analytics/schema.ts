import { z } from "zod";
import { storySlugs } from "@/content";

export const EVENT_TYPES = ["pageview", "resume_download", "contact_click", "outbound", "engagement"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

const slugSet = new Set(storySlugs);

/** Paths we accept: "/" and "/story/<known slug>". Anything else is noise or abuse. */
export function storySlugFromPath(path: string): string | null | undefined {
  if (path === "/") return null;
  const match = /^\/story\/([a-z0-9-]{1,80})$/.exec(path);
  if (match && slugSet.has(match[1]!)) return match[1]!;
  return undefined;
}

const short = (max: number) => z.string().trim().min(1).max(max);

export const clientEventSchema = z
  .object({
    t: z.enum(["pageview", "contact_click", "outbound", "engagement"]),
    p: z.string().max(300),
    sid: z.uuid(),
    tg: short(200).optional(),
    ms: z.number().int().min(0).max(3_600_000).optional(),
    ref: short(200).optional(),
    utm_source: short(100).optional(),
    utm_medium: short(100).optional(),
    utm_campaign: short(100).optional(),
    utm_term: short(100).optional(),
    utm_content: short(100).optional(),
  })
  .strict()
  .refine((e) => storySlugFromPath(e.p) !== undefined, { message: "unknown path", path: ["p"] })
  .refine((e) => (e.t === "contact_click" || e.t === "outbound" ? Boolean(e.tg) : true), { message: "target required", path: ["tg"] })
  .refine((e) => (e.t === "engagement" ? e.ms !== undefined : true), { message: "ms required", path: ["ms"] });

export type ClientEventPayload = z.infer<typeof clientEventSchema>;
