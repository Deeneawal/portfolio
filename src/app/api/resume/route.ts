import { after, type NextRequest, NextResponse } from "next/server";
import { profile } from "@/content/profile";
import { baseRow, insertEvent, isOwnerRequest, trackingEnabled } from "@/lib/analytics/ingest";
import { getOverrides } from "@/lib/content/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Uses the PDF uploaded from /admin/content when there is one, otherwise the bundled CV. */
async function redirectToPdf(req: NextRequest) {
  const { resumeUrl } = await getOverrides();
  const res = NextResponse.redirect(resumeUrl ?? new URL(profile.resumeFile, req.url), 302);
  res.headers.set("Cache-Control", "no-store");
  return res;
}

function isPrefetch(req: NextRequest): boolean {
  const h = req.headers;
  return h.has("next-router-prefetch") || h.has("rsc") || h.get("sec-purpose")?.includes("prefetch") === true || h.get("purpose") === "prefetch";
}

/** Counts résumé downloads (including from shared links), then hands over the static PDF. */
export async function GET(req: NextRequest) {
  if (trackingEnabled() && !isPrefetch(req)) {
    const base = baseRow(req);
    if (base && !(await isOwnerRequest(req))) {
      const h = req.headers;
      const likelyHuman = h.get("sec-fetch-user") === "?1" || h.get("sec-fetch-dest") === "document";
      let referrer: string | null = null;
      try {
        const ref = h.get("referer");
        if (ref) {
          const host = new URL(ref).host;
          referrer = host === req.nextUrl.host ? null : host.slice(0, 200);
        }
      } catch {
        referrer = null;
      }
      after(() =>
        insertEvent({
          ...base,
          referrer_host: referrer,
          type: "resume_download",
          path: "/api/resume",
          story_slug: null,
          target: null,
          likely_human: likelyHuman,
          session_id: null,
          engaged_ms: null,
        }),
      );
    }
  }
  return redirectToPdf(req);
}

export async function HEAD(req: NextRequest) {
  return redirectToPdf(req);
}
