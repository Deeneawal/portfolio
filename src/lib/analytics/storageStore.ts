import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { istDate } from "../time";
import type { EventRow } from "./ingest";
import type { DailyRow, Dimension, RecentRow, Summary, TopRow } from "./queries";

/**
 * Fallback store used while the Postgres tables don't exist yet: each event is one small JSON object
 * in the private "analytics" bucket, under events/<IST date>/. Nothing here is publicly readable.
 * Once supabase/migrations are applied, the table-backed path takes over automatically.
 */
export const ANALYTICS_BUCKET = "analytics";
const MAX_EVENTS_READ = 3000;

type StoredEvent = EventRow & { ts: string };

export function isMissingTableError(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false;
  return error.code === "PGRST205" || error.code === "PGRST202" || /schema cache/i.test(error.message ?? "");
}

export async function storeEvent(supabase: SupabaseClient, row: EventRow): Promise<void> {
  const now = new Date();
  const event: StoredEvent = { ...row, ts: now.toISOString() };
  const path = `events/${istDate(now)}/${now.getTime()}-${crypto.randomUUID().slice(0, 8)}.json`;
  const { error } = await supabase.storage
    .from(ANALYTICS_BUCKET)
    .upload(path, JSON.stringify(event), { contentType: "application/json", upsert: false });
  if (error) console.error("[analytics] storage fallback failed:", error.message);
}

function dayList(days: number, today = new Date()): string[] {
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i--) out.push(istDate(new Date(today.getTime() - i * 86_400_000)));
  return out;
}

async function readEvents(supabase: SupabaseClient, days: string[]): Promise<StoredEvent[]> {
  const bucket = supabase.storage.from(ANALYTICS_BUCKET);
  const listings = await Promise.all(
    days.map(async (d) => {
      const { data } = await bucket.list(`events/${d}`, { limit: 1000, sortBy: { column: "name", order: "desc" } });
      return (data ?? []).filter((f) => f.name.endsWith(".json")).map((f) => `events/${d}/${f.name}`);
    }),
  );
  const paths = listings.flat().sort().reverse().slice(0, MAX_EVENTS_READ);
  const events: StoredEvent[] = [];
  for (let i = 0; i < paths.length; i += 50) {
    const chunk = await Promise.all(
      paths.slice(i, i + 50).map(async (p) => {
        const { data } = await bucket.download(p);
        if (!data) return null;
        try {
          return JSON.parse(await data.text()) as StoredEvent;
        } catch {
          return null;
        }
      }),
    );
    for (const e of chunk) if (e) events.push(e);
  }
  return events;
}

const dimValue: Record<Dimension, (e: StoredEvent) => string | null> = {
  story: (e) => (e.type === "pageview" ? e.story_slug : null),
  referrer: (e) => (e.type === "pageview" ? e.referrer_host : null),
  country: (e) => (e.type === "pageview" ? e.country : null),
  city: (e) => (e.type === "pageview" && e.city ? `${e.city}${e.country ? `, ${e.country}` : ""}` : null),
  device: (e) => (e.type === "pageview" ? e.device : null),
  browser: (e) => (e.type === "pageview" ? e.browser : null),
  os: (e) => (e.type === "pageview" ? e.os : null),
  utm: (e) => (e.type === "pageview" ? e.utm_source : null),
  contact: (e) => (e.type === "contact_click" ? e.target : null),
  outbound: (e) => (e.type === "outbound" ? e.target : null),
};

/** Same shapes as the SQL functions, computed in memory. Summary covers up to 365 days. */
export async function dashboardFromStorage(supabase: SupabaseClient, days: number, dims: Dimension[]) {
  const allDays = dayList(365);
  const all = await readEvents(supabase, allDays);
  const today = istDate();
  const dayOf = (e: StoredEvent) => istDate(new Date(e.ts));
  const within = (e: StoredEvent, n: number) => dayList(n).includes(dayOf(e));
  const views = all.filter((e) => e.type === "pageview");
  const distinct = (list: StoredEvent[]) => new Set(list.map((e) => e.visitor_hash)).size;

  const v7 = views.filter((e) => within(e, 7));
  const v30 = views.filter((e) => within(e, 30));
  const resumes = all.filter((e) => e.type === "resume_download");
  const engaged30 = all.filter((e) => e.type === "engagement" && within(e, 30)).reduce((s, e) => s + (e.engaged_ms ?? 0), 0);

  const summary: Summary = {
    views_all: views.length,
    views_today: views.filter((e) => dayOf(e) === today).length,
    views_7d: v7.length,
    views_30d: v30.length,
    visitors_today: distinct(views.filter((e) => dayOf(e) === today)),
    visitor_days_7d: distinct(v7),
    visitor_days_30d: distinct(v30),
    visitor_days_all: distinct(views),
    resume_all: resumes.length,
    resume_30d: resumes.filter((e) => within(e, 30)).length,
    resume_human_all: resumes.filter((e) => e.likely_human).length,
    story_views_30d: v30.filter((e) => e.story_slug).length,
    contacts_30d: all.filter((e) => e.type === "contact_click" && within(e, 30)).length,
    sessions_30d: new Set(v30.map((e) => e.session_id).filter(Boolean)).size,
    engaged_s_30d: Math.floor(engaged30 / 1000),
  };

  const range = dayList(days);
  const inRange = all.filter((e) => range.includes(dayOf(e)));
  const daily: DailyRow[] = range.map((day) => {
    const d = inRange.filter((e) => dayOf(e) === day);
    const dv = d.filter((e) => e.type === "pageview");
    return {
      day,
      views: dv.length,
      visitors: distinct(dv),
      story_views: dv.filter((e) => e.story_slug).length,
      resumes: d.filter((e) => e.type === "resume_download").length,
    };
  });

  const top = Object.fromEntries(
    dims.map((dim) => {
      const counts = new Map<string, number>();
      for (const e of inRange) {
        const k = dimValue[dim](e);
        if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
      }
      const rows: TopRow[] = [...counts].map(([key, n]) => ({ key, n })).sort((a, b) => b.n - a.n || a.key.localeCompare(b.key)).slice(0, 8);
      return [dim, rows];
    }),
  ) as Record<Dimension, TopRow[]>;

  const recent: RecentRow[] = all
    .filter((e) => e.type !== "engagement")
    .sort((a, b) => b.ts.localeCompare(a.ts))
    .slice(0, 40)
    .map((e) => ({
      ts: e.ts,
      type: e.type,
      path: e.path,
      story_slug: e.story_slug,
      target: e.target,
      referrer_host: e.referrer_host,
      country: e.country,
      city: e.city,
      device: e.device,
      browser: e.browser,
      os: e.os,
    }));

  return { summary, daily, top, recent };
}

/** Content overrides fallback: one private JSON document. */
const CONTENT_PATH = "content/overrides.json";

export async function readContentFromStorage(supabase: SupabaseClient): Promise<unknown | null> {
  const { data } = await supabase.storage.from(ANALYTICS_BUCKET).download(CONTENT_PATH);
  if (!data) return null;
  try {
    return JSON.parse(await data.text());
  } catch {
    return null;
  }
}

export async function writeContentToStorage(supabase: SupabaseClient, value: unknown): Promise<string | null> {
  const { error } = await supabase.storage
    .from(ANALYTICS_BUCKET)
    .upload(CONTENT_PATH, JSON.stringify(value), { contentType: "application/json", upsert: true, cacheControl: "0" });
  return error ? error.message : null;
}
