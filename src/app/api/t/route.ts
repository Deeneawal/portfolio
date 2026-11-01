import { after, type NextRequest, NextResponse } from "next/server";
import { clientEventSchema, storySlugFromPath } from "@/lib/analytics/schema";
import { baseRow, insertEvent, isOwnerRequest, rateLimited, trackingEnabled } from "@/lib/analytics/ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 2048;

function noContent() {
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  // Always answer 204 quickly; analytics must never affect the visitor.
  if (!trackingEnabled()) return noContent();

  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return noContent();

  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return noContent();
  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return noContent();

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return noContent();
  }
  const parsed = clientEventSchema.safeParse(json);
  if (!parsed.success) return noContent();

  const base = baseRow(req);
  if (!base || rateLimited(base.visitor_hash)) return noContent();
  if (await isOwnerRequest(req)) return noContent();

  const e = parsed.data;
  after(() =>
    insertEvent({
      ...base,
      type: e.t,
      path: e.p,
      story_slug: storySlugFromPath(e.p) ?? null,
      target: e.tg ?? null,
      referrer_host: e.ref ?? null,
      utm_source: e.utm_source ?? null,
      utm_medium: e.utm_medium ?? null,
      utm_campaign: e.utm_campaign ?? null,
      utm_term: e.utm_term ?? null,
      utm_content: e.utm_content ?? null,
      likely_human: true,
      session_id: e.sid,
      engaged_ms: e.ms ?? null,
    }),
  );
  return noContent();
}
