import type { DailyRow, TopRow } from "@/lib/analytics/queries";

const fmtDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });

/** Single-series daily bar chart. Bars anchor to the baseline; hover or focus shows the exact values. */
export function DailyBars({ rows, metric, label }: { rows: DailyRow[]; metric: "views" | "visitors" | "resumes"; label: string }) {
  const max = Math.max(1, ...rows.map((r) => r[metric]));
  const ticks = [max, Math.round(max / 2), 0];
  return (
    <figure>
      <div className="flex gap-3">
        <div aria-hidden className="flex h-48 flex-col justify-between pb-0 text-right text-[11px] tabular-nums text-faint">
          {ticks.map((t, i) => (
            <span key={`${t}-${i}`} className="leading-none">
              {t}
            </span>
          ))}
        </div>
        <div className="relative flex-1">
          <div aria-hidden className="absolute inset-x-0 top-0 border-t border-dashed border-black/[0.06]" />
          <div aria-hidden className="absolute inset-x-0 top-1/2 border-t border-dashed border-black/[0.06]" />
          <ol className="relative flex h-48 items-end gap-[2px] border-b border-black/15" aria-label={label}>
            {rows.map((r) => {
              const v = r[metric];
              return (
                <li key={r.day} className="group relative flex h-full flex-1 items-end justify-center" tabIndex={0} aria-label={`${fmtDay(r.day)}: ${v} ${label.toLowerCase()}`}>
                  <span
                    className="w-full max-w-[18px] rounded-t-[4px] bg-accent transition-opacity group-hover:opacity-80 group-focus:opacity-80"
                    style={{ height: v === 0 ? 0 : `max(3px, ${(v / max) * 100}%)` }}
                  />
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[12px] text-white shadow-lg group-hover:block group-focus:block">
                    <span className="font-semibold">{fmtDay(r.day)}</span> · {r.views} views · {r.visitors} visitors · {r.resumes} résumés
                  </span>
                </li>
              );
            })}
          </ol>
          <div aria-hidden className="mt-2 flex justify-between text-[11px] text-faint">
            <span>{rows[0] ? fmtDay(rows[0].day) : ""}</span>
            <span>{rows.at(-1) ? fmtDay(rows.at(-1)!.day) : ""}</span>
          </div>
        </div>
      </div>
      <details className="mt-3 text-[13px] text-muted">
        <summary className="cursor-pointer select-none">Show as table</summary>
        <table className="mt-2 w-full text-left tabular-nums">
          <thead>
            <tr className="text-faint">
              <th className="py-1 font-medium">Day</th>
              <th className="py-1 font-medium">Views</th>
              <th className="py-1 font-medium">Visitors</th>
              <th className="py-1 font-medium">Story views</th>
              <th className="py-1 font-medium">Résumés</th>
            </tr>
          </thead>
          <tbody>
            {[...rows].reverse().map((r) => (
              <tr key={r.day} className="border-t border-black/5 text-ink-2">
                <td className="py-1">{fmtDay(r.day)}</td>
                <td>{r.views}</td>
                <td>{r.visitors}</td>
                <td>{r.story_views}</td>
                <td>{r.resumes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

/** Ranked list with a proportional single-hue bar behind each row. Values stay in ink, not the bar colour. */
export function TopList({ title, rows, empty = "No data yet", format }: { title: string; rows: TopRow[]; empty?: string; format?: (k: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <section className="rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-black/[0.05]">
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-3 text-[14px] text-faint">{empty}</p>
      ) : (
        <ol className="mt-3 space-y-1.5">
          {rows.map((r) => (
            <li key={r.key} className="relative overflow-hidden rounded-lg px-2.5 py-1.5" title={`${r.key}: ${r.n}`}>
              <span aria-hidden className="absolute inset-y-0 left-0 rounded-lg bg-accent/[0.12]" style={{ width: `${(r.n / max) * 100}%` }} />
              <span className="relative flex items-center justify-between gap-3 text-[14px]">
                <span className="min-w-0 truncate text-ink">{format ? format(r.key) : r.key}</span>
                <span className="shrink-0 tabular-nums font-medium text-ink-2">{r.n}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
