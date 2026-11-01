import "server-only";
import { getServiceClient } from "../supabase";
import { dashboardFromStorage, isMissingTableError } from "./storageStore";

export interface Summary {
  views_all: number;
  views_today: number;
  views_7d: number;
  views_30d: number;
  visitors_today: number;
  visitor_days_7d: number;
  visitor_days_30d: number;
  visitor_days_all: number;
  resume_all: number;
  resume_30d: number;
  resume_human_all: number;
  story_views_30d: number;
  contacts_30d: number;
  sessions_30d: number;
  engaged_s_30d: number;
}
export interface DailyRow {
  day: string;
  views: number;
  visitors: number;
  story_views: number;
  resumes: number;
}
export interface TopRow {
  key: string;
  n: number;
}
export interface RecentRow {
  ts: string;
  type: string;
  path: string;
  story_slug: string | null;
  target: string | null;
  referrer_host: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
}

export type Dimension = "story" | "referrer" | "country" | "city" | "device" | "browser" | "os" | "utm" | "contact" | "outbound";

export interface Dashboard {
  configured: boolean;
  storageFallback?: boolean;
  error?: string;
  summary?: Summary;
  daily: DailyRow[];
  top: Record<Dimension, TopRow[]>;
  recent: RecentRow[];
}

const DIMENSIONS: Dimension[] = ["story", "referrer", "country", "city", "device", "browser", "os", "utm", "contact", "outbound"];

export async function loadDashboard(days: number): Promise<Dashboard> {
  const empty = Object.fromEntries(DIMENSIONS.map((d) => [d, []])) as unknown as Record<Dimension, TopRow[]>;
  const supabase = getServiceClient();
  if (!supabase) return { configured: false, daily: [], top: empty, recent: [] };

  const [summary, daily, recent, ...tops] = await Promise.all([
    supabase.rpc("analytics_summary"),
    supabase.rpc("analytics_daily", { p_days: days }),
    supabase.rpc("analytics_recent", { p_limit: 40 }),
    ...DIMENSIONS.map((d) => supabase.rpc("analytics_top", { p_dim: d, p_days: days, p_limit: 8 })),
  ]);

  const firstError = [summary, daily, recent, ...tops].find((r) => r.error)?.error;
  if (isMissingTableError(firstError)) {
    try {
      return { configured: true, storageFallback: true, ...(await dashboardFromStorage(supabase, days, DIMENSIONS)) };
    } catch (e) {
      return { configured: true, error: (e as Error).message, daily: [], top: empty, recent: [] };
    }
  }
  if (firstError) return { configured: true, error: firstError.message, daily: [], top: empty, recent: [] };

  const top = Object.fromEntries(
    DIMENSIONS.map((d, i) => [d, ((tops[i]?.data as TopRow[] | null) ?? []).map((r) => ({ key: r.key, n: Number(r.n) }))]),
  ) as Record<Dimension, TopRow[]>;

  return {
    configured: true,
    summary: summary.data as Summary,
    daily: ((daily.data as DailyRow[] | null) ?? []).map((r) => ({
      day: r.day,
      views: Number(r.views),
      visitors: Number(r.visitors),
      story_views: Number(r.story_views),
      resumes: Number(r.resumes),
    })),
    top,
    recent: (recent.data as RecentRow[] | null) ?? [],
  };
}
