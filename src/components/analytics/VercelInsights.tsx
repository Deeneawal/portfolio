"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const OWNER_FLAG = "zk_owner";

/** Vercel Web Analytics + Speed Insights; the owner's own visits (flag set at /admin login) are dropped. */
export function VercelInsights() {
  const beforeSend = (event: BeforeSendEvent) => {
    try {
      if (localStorage.getItem(OWNER_FLAG) === "1") return null;
    } catch {
      /* storage blocked: keep the event */
    }
    if (new URL(event.url).pathname.startsWith("/admin")) return null;
    return event;
  };
  return (
    <>
      <Analytics beforeSend={beforeSend} />
      <SpeedInsights />
    </>
  );
}
