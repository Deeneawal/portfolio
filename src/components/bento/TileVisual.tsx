import Image from "next/image";
import type { TileTone, TileVisual as TileVisualData } from "@/content/types";
import { iconMap } from "@/components/icons";
import { cn } from "@/lib/cn";

const iconTint: Record<TileTone, string> = {
  light: "text-accent",
  dark: "text-[#64d2ff]",
  graphite: "text-[#30d158]",
  blue: "text-accent",
  mint: "text-[#1d8a4e]",
  sunset: "text-[#e8590c]",
  violet: "text-[#7c3aed]",
};

export function TileVisual({ visual, tone }: { visual: TileVisualData; tone: TileTone }) {
  const onDark = tone === "dark" || tone === "graphite";

  switch (visual.kind) {
    case "stat":
      return (
        <div>
          <p className={cn("display text-6xl sm:text-7xl", onDark ? "text-white" : "text-ink")}>{visual.value}</p>
          <p className={cn("mt-1 text-sm", onDark ? "text-white/60" : "text-muted")}>{visual.label}</p>
        </div>
      );
    case "beforeAfter":
      return (
        <div className="flex items-end gap-3">
          <span className="display text-3xl text-faint line-through decoration-2">{visual.before}</span>
          <span aria-hidden className="pb-1 text-2xl text-faint">→</span>
          <span className="display text-6xl text-accent sm:text-7xl">{visual.after}</span>
        </div>
      );
    case "icon": {
      const Icon = iconMap[visual.icon];
      return <Icon aria-hidden className={cn("size-14 sm:size-16", iconTint[tone])} strokeWidth={1.5} />;
    }
    case "terminal":
      return (
        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] font-mono text-[12.5px] leading-6 sm:text-[13.5px] sm:leading-7">
          <div className="flex gap-1.5 border-b border-white/10 px-3 py-2" aria-hidden>
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="px-4 py-3">
            {visual.lines.map((line, i) => (
              <p
                key={line}
                className={cn(
                  "truncate",
                  line.startsWith("✕") ? "text-[#ff6961]" : line.startsWith("→") || line.startsWith("✓") ? "text-[#30d158]" : "text-white/80",
                )}
              >
                {line}
                {i === visual.lines.length - 1 && <span className="caret ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-white/70" />}
              </p>
            ))}
          </div>
        </div>
      );
    case "journey":
      // Below sm, labels alternate above/below the line so each one has two columns of room.
      return (
        <ol className="relative grid w-full grid-cols-5" aria-label="Patient journey stages">
          <span aria-hidden className="absolute inset-x-[10%] top-[38px] h-0.5 rounded bg-accent/25 sm:top-5" />
          {visual.steps.map((step, i) => {
            const above = i % 2 === 1;
            const label = "whitespace-nowrap text-[11px] font-medium leading-4 text-ink-2 sm:text-xs";
            return (
              <li key={step} className="relative flex min-w-0 flex-col items-center gap-1.5 text-center">
                <span aria-hidden className={cn(label, "h-4 sm:hidden", !above && "invisible")}>
                  {above ? step : "\u00a0"}
                </span>
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-full text-xs font-semibold shadow-sm sm:size-10",
                    i === visual.steps.length - 1 ? "bg-accent text-white" : "bg-white text-accent",
                  )}
                >
                  {i + 1}
                </span>
                {above && <span className="sr-only sm:hidden">{step}</span>}
                <span className={cn(label, "h-4", above && "invisible sm:visible")}>
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      );
    case "cover":
      return (
        <div className="flex w-full items-end gap-5 sm:gap-7">
          <Image
            src={visual.src}
            alt={visual.alt}
            width={visual.width}
            height={visual.height}
            sizes="(min-width: 640px) 160px, 120px"
            className="h-44 w-auto shrink-0 -rotate-2 rounded-md shadow-[0_18px_40px_rgb(0_0_0/0.45)] ring-1 ring-black/10 sm:h-56"
          />
          <ul className="flex flex-wrap gap-2 pb-1">
            {visual.facts.map((fact) => (
              <li
                key={fact}
                className={cn("rounded-full px-3 py-1.5 text-xs font-medium", onDark ? "bg-white/10 text-white/85" : "bg-black/[0.05] text-ink-2")}
              >
                {fact}
              </li>
            ))}
          </ul>
        </div>
      );
    case "chips":
      return (
        <ul className="flex flex-wrap gap-2">
          {visual.items.map((item) => (
            <li
              key={item}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium",
                onDark ? "bg-white/10 text-white/85" : "bg-black/[0.05] text-ink-2",
              )}
            >
              {item}
            </li>
          ))}
        </ul>
      );
  }
}
