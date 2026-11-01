"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics/client";

/** First-party, cookieless page-view and interaction tracking. Never runs on /admin. */
export function Tracker() {
  const pathname = usePathname();
  const visibleSince = useRef<number>(0);
  const lastPath = useRef<string | null>(null);

  // Page views, one per route change (opening a story sheet counts as a view of that story).
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    track({ type: "pageview", path: pathname });
  }, [pathname]);

  // Engaged time: flushed whenever the tab is hidden.
  useEffect(() => {
    visibleSince.current = document.visibilityState === "visible" ? performance.now() : 0;
    const onVisibility = () => {
      if (location.pathname.startsWith("/admin")) return;
      if (document.visibilityState === "hidden" && visibleSince.current) {
        const ms = performance.now() - visibleSince.current;
        visibleSince.current = 0;
        if (ms > 1000) track({ type: "engagement", ms });
      } else if (document.visibilityState === "visible") {
        visibleSince.current = performance.now();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Contact and outbound clicks, delegated so content stays plain markup.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || location.pathname.startsWith("/admin")) return;
      const explicit = a.getAttribute("data-track");
      if (explicit === "contact_click") {
        track({ type: "contact_click", target: a.getAttribute("data-target") ?? a.href });
        return;
      }
      if (a.protocol === "mailto:" || a.protocol === "tel:") {
        track({ type: "contact_click", target: a.protocol === "mailto:" ? "email" : "phone" });
        return;
      }
      if (a.host && a.host !== location.host && a.protocol.startsWith("http")) {
        track({ type: "outbound", target: `${a.host}${a.pathname}`.slice(0, 200) });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
