import Link from "next/link";
import { ArrowLeft, LogOut, PenLine } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { loadDashboard, type Summary } from "@/lib/analytics/queries";
import { getStoryMeta } from "@/content";
import { DailyBars, TopList } from "@/components/admin/Charts";
import { OwnerFlag } from "@/components/admin/OwnerFlag";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90, 365] as const;

const countryName = (code: string) => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
};

const storyName = (slug: string) => getStoryMeta(slug)?.title ?? slug;

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function Kpi({ label, value, note }: { label: string; value: number | string; note?: string }) {
  return (
    <div className="rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-black/[0.05]">
      <p className="text-[13px] font-medium text-muted">{label}</p>
      <p className="display mt-1 text-4xl tabular-nums text-ink">{typeof value === "number" ? value.toLocaleString("en-IN") : value}</p>
      {note && <p className="mt-1 text-[12px] text-faint">{note}</p>}
    </div>
  );
}

function minutes(seconds: number) {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  await requireAdmin();
  const { days: rawDays } = await searchParams;
  const days = RANGES.find((d) => String(d) === rawDays) ?? 30;
  const data = await loadDashboard(days);
  const s = data.summary as Summary | undefined;

  return (
    <main id="main" className="mx-auto max-w-[1180px] px-4 pb-20 pt-6 sm:px-6">
      <OwnerFlag />
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-muted">Private · visible only to you</p>
          <h1 className="display mt-1 text-4xl">Portfolio analytics</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-medium shadow-sm ring-1 ring-black/[0.06]">
            <ArrowLeft aria-hidden className="size-4" /> Site
          </Link>
          <Link href="/admin/content" className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-[14px] font-medium text-white">
            <PenLine aria-hidden className="size-4" /> Edit content
          </Link>
          <form action={logout}>
            <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[14px] font-medium text-white">
              <LogOut aria-hidden className="size-4" /> Sign out
            </button>
          </form>
        </div>
      </header>

      {!data.configured && (
        <p className="mt-8 rounded-2xl bg-[#fff3ea] p-5 text-[15px] text-ink-2">
          Analytics storage isn&apos;t configured. Set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>, then apply{" "}
          <code>supabase/migrations/0001_analytics.sql</code>.
        </p>
      )}
      {data.storageFallback && (
        <p className="mt-6 rounded-2xl bg-[#e8f2ff] p-4 text-[14px] text-ink-2">
          Running on the private storage fallback. Apply <code>supabase/migrations</code> to switch to the faster Postgres tables; new events will go there automatically.
        </p>
      )}
      {data.error && (
        <p className="mt-8 rounded-2xl bg-[#ffe9e9] p-5 text-[15px] text-ink-2">
          Couldn&apos;t load analytics: {data.error}. Has the migration been applied?
        </p>
      )}

      {s && (
        <>
          <section aria-label="Headline numbers" className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi label="Total page views" value={Number(s.views_all)} note={`${Number(s.views_today)} today · ${Number(s.views_7d)} in 7 days`} />
            <Kpi label="Visitors today" value={Number(s.visitors_today)} note={`${Number(s.visitor_days_30d)} visitor-days in 30 days`} />
            <Kpi label="Résumé downloads" value={Number(s.resume_all)} note={`${Number(s.resume_30d)} in 30 days · ${Number(s.resume_human_all)} confirmed clicks`} />
            <Kpi label="Story views · 30 days" value={Number(s.story_views_30d)} note={`${Number(s.contacts_30d)} contact clicks`} />
            <Kpi label="Visitor-days (all time)" value={Number(s.visitor_days_all)} note="Visitor ids rotate daily for privacy" />
            <Kpi label="Sessions · 30 days" value={Number(s.sessions_30d)} />
            <Kpi label="Engaged time · 30 days" value={minutes(Number(s.engaged_s_30d))} />
            <Kpi
              label="Avg. per session"
              value={Number(s.sessions_30d) ? minutes(Number(s.engaged_s_30d) / Number(s.sessions_30d)) : "–"}
              note="Time with the tab visible"
            />
          </section>

          <section aria-label="Daily views" className="mt-6 rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-black/[0.05] sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[17px] font-semibold">Page views per day</h2>
              <nav aria-label="Date range" className="flex rounded-full bg-[#f5f5f7] p-1 text-[13px] font-medium">
                {RANGES.map((r) => (
                  <Link
                    key={r}
                    href={`/admin?days=${r}`}
                    aria-current={r === days ? "page" : undefined}
                    className={`rounded-full px-3 py-1.5 ${r === days ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"}`}
                  >
                    {r === 365 ? "1y" : `${r}d`}
                  </Link>
                ))}
              </nav>
            </div>
            <DailyBars rows={data.daily} metric="views" label="Page views" />
          </section>

          <section aria-label="Breakdowns" className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <TopList title="Top stories" rows={data.top.story} format={storyName} />
            <TopList title="Referrers" rows={data.top.referrer} empty="No referrers yet (direct visits)" />
            <TopList title="Countries" rows={data.top.country} format={countryName} />
            <TopList title="Cities" rows={data.top.city} />
            <TopList title="Devices" rows={data.top.device} />
            <TopList title="Browsers" rows={data.top.browser} />
            <TopList title="Operating systems" rows={data.top.os} />
            <TopList title="Campaigns (utm_source / ?ref=)" rows={data.top.utm} empty="Add ?ref=linkedin to shared links" />
            <TopList title="Contact clicks" rows={data.top.contact} />
            <TopList title="Outbound links" rows={data.top.outbound} />
          </section>

          <section aria-label="Recent activity" className="mt-6 rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-black/[0.05] sm:p-6">
            <h2 className="text-[17px] font-semibold">Recent activity</h2>
            {data.recent.length === 0 ? (
              <p className="mt-3 text-[14px] text-faint">No events yet.</p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-[13.5px]">
                  <thead className="text-faint">
                    <tr>
                      <th className="py-2 font-medium">When (IST)</th>
                      <th className="py-2 font-medium">Event</th>
                      <th className="py-2 font-medium">What</th>
                      <th className="py-2 font-medium">From</th>
                      <th className="py-2 font-medium">Where</th>
                      <th className="py-2 font-medium">Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map((r, i) => (
                      <tr key={`${r.ts}-${i}`} className="border-t border-black/5 text-ink-2">
                        <td className="whitespace-nowrap py-2 tabular-nums">{fmtTime(r.ts)}</td>
                        <td className="py-2">{r.type.replace("_", " ")}</td>
                        <td className="max-w-[220px] truncate py-2">{r.story_slug ? storyName(r.story_slug) : r.target ?? r.path}</td>
                        <td className="max-w-[160px] truncate py-2">{r.referrer_host ?? "–"}</td>
                        <td className="py-2">{[r.city, r.country].filter(Boolean).join(", ") || "–"}</td>
                        <td className="py-2">{[r.device, r.browser].filter(Boolean).join(" · ") || "–"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <p className="mt-6 text-[12px] text-faint">
            Your own visits are excluded on this browser. Bots are filtered out. Visitor ids are anonymous hashes that rotate daily, so “visitor-days” counts one person once per day.
            Vercel Web Analytics and Speed Insights are available in the Vercel dashboard too.
          </p>
        </>
      )}
    </main>
  );
}
