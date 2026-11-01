"use client";

export type ClientEvent =
  | { type: "pageview"; path?: string }
  | { type: "contact_click"; target: string }
  | { type: "outbound"; target: string }
  | { type: "engagement"; ms: number; path?: string };

const SESSION_KEY = "zk_sid";
const FIRST_KEY = "zk_first_sent";

function sessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return crypto.randomUUID();
  }
}

/** Referrer and UTM tags are sent only with the first page view of a session. */
function firstTouch(): Record<string, string> | null {
  try {
    if (sessionStorage.getItem(FIRST_KEY)) return null;
    sessionStorage.setItem(FIRST_KEY, "1");
  } catch {
    // Storage blocked: send attribution every time rather than never.
  }
  const out: Record<string, string> = {};
  if (document.referrer) {
    try {
      const host = new URL(document.referrer).host;
      if (host && host !== location.host) out.ref = host;
    } catch {
      /* ignore malformed referrer */
    }
  }
  const params = new URLSearchParams(location.search);
  for (const key of ["source", "medium", "campaign", "term", "content"]) {
    const v = params.get(`utm_${key}`) ?? (key === "source" ? params.get("ref") : null);
    if (v) out[`utm_${key}`] = v.slice(0, 100);
  }
  return out;
}

export function track(event: ClientEvent): void {
  if (typeof window === "undefined") return;
  const path = ("path" in event && event.path) || location.pathname;
  const body: Record<string, unknown> = { t: event.type, p: path.slice(0, 300), sid: sessionId() };
  if ("target" in event) body.tg = event.target.slice(0, 200);
  if (event.type === "engagement") body.ms = Math.max(0, Math.min(3_600_000, Math.round(event.ms)));
  if (event.type === "pageview") {
    const first = firstTouch();
    if (first) Object.assign(body, first);
  }
  const payload = JSON.stringify(body);
  try {
    if (navigator.sendBeacon?.("/api/t", payload)) return;
  } catch {
    /* fall through to fetch */
  }
  void fetch("/api/t", { method: "POST", body: payload, keepalive: true, headers: { "content-type": "text/plain" } }).catch(() => {});
}
