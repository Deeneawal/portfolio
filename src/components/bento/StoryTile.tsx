"use client";

import Link from "next/link";
import * as m from "motion/react-m";
import { ArrowUpRight } from "lucide-react";
import type { StoryMeta, TileSize } from "@/content/types";
import { TileVisual } from "./TileVisual";
import { cn } from "@/lib/cn";

const sizeClass: Record<TileSize, string> = {
  lg: "sm:col-span-2 lg:col-span-4 min-h-[320px]",
  big: "sm:col-span-2 sm:row-span-2 min-h-[320px]",
  wide: "sm:col-span-2 min-h-[260px]",
  tall: "sm:row-span-2 min-h-[260px] sm:min-h-[540px]",
  sm: "min-h-[260px]",
};

const glowTint: Record<StoryMeta["tone"], string> = {
  light: "rgb(0 113 227 / 0.09)",
  dark: "rgb(255 255 255 / 0.12)",
  graphite: "rgb(255 255 255 / 0.12)",
  blue: "rgb(255 255 255 / 0.55)",
  mint: "rgb(255 255 255 / 0.55)",
  sunset: "rgb(255 255 255 / 0.55)",
  violet: "rgb(255 255 255 / 0.55)",
};

/** Feeds the cursor position to the glow layer through CSS variables (no React re-render). */
function trackPointer(e: React.PointerEvent<HTMLAnchorElement>) {
  if (e.pointerType !== "mouse") return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function StoryTile({ story, className }: { story: StoryMeta; className?: string }) {
  const onDark = story.tone === "dark" || story.tone === "graphite";

  return (
    <Link
      href={`/story/${story.slug}`}
      scroll={false}
      data-tile={story.slug}
      onPointerMove={trackPointer}
      className={cn(
        "group relative block rounded-[28px] transition-transform duration-300 ease-[var(--ease-apple)] hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.985] motion-reduce:transform-none",
        sizeClass[story.size],
        className,
      )}
    >
      <m.div
        layoutId={`surface-${story.slug}`}
        style={{ borderRadius: 28 }}
        className={cn(
          `tone-${story.tone}`,
          "absolute inset-0 overflow-hidden shadow-[var(--shadow-tile)] transition-shadow duration-300 group-hover:shadow-[var(--shadow-lift)]",
          story.tone === "light" && "ring-1 ring-black/[0.04]",
        )}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), ${glowTint[story.tone]}, transparent 70%)` }}
      />
      <div className="relative flex h-full flex-col gap-5 p-6 sm:p-7">
        <div>
          <p className={cn("eyebrow truncate pr-12 transition-[padding] duration-300 group-hover:pr-32 group-focus-visible:pr-32", onDark ? "text-white/60" : "text-muted")}>{story.eyebrow}</p>
          <m.h3
            layoutId={`title-${story.slug}`}
            className={cn("display mt-2 pr-8 text-[1.65rem] sm:text-3xl", onDark ? "text-white" : "text-ink", (story.size === "lg" || story.size === "big") && "sm:text-5xl")}
          >
            {story.title}
          </m.h3>
          <p className={cn("mt-2 max-w-xl text-[15px] leading-relaxed", onDark ? "text-white/70" : "text-ink-2")}>{story.summary}</p>
        </div>
        {story.visual && (
          <div className="mt-auto flex items-end justify-between gap-4">
            <TileVisual visual={story.visual} tone={story.tone} />
          </div>
        )}
        <span
          aria-hidden
          className={cn(
            "absolute right-4 top-4 flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 text-[13px] font-semibold transition-all duration-300 sm:right-5 sm:top-5",
            onDark ? "bg-white/15 text-white ring-1 ring-white/20" : story.tone === "light" ? "bg-[#f5f5f7] text-ink ring-1 ring-black/[0.06]" : "bg-white/80 text-ink shadow-sm",
          )}
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:mr-1 group-hover:max-w-24 group-hover:opacity-100 group-focus-visible:mr-1 group-focus-visible:max-w-24 group-focus-visible:opacity-100">
            Read story
          </span>
          <ArrowUpRight className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
        </span>
      </div>
    </Link>
  );
}
