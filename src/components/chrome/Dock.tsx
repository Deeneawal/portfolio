"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as m from "motion/react-m";
import { Briefcase, Download, FlaskConical, LayoutGrid, Search, User, Workflow, type LucideIcon } from "lucide-react";
import { groups } from "@/content";
import type { GroupId } from "@/content/types";
import { profile } from "@/content/profile";
import { openPalette } from "./PaletteButton";
import { cn } from "@/lib/cn";

const dockIcons: Record<GroupId, LucideIcon> = {
  today: LayoutGrid,
  process: Workflow,
  work: Briefcase,
  lab: FlaskConical,
  about: User,
};

export function Dock() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<GroupId>("today");

  useEffect(() => {
    if (!onHome) return;
    const sections = groups
      .map((g) => document.getElementById(`group-${g.id}`))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first) setActive(first.target.id.replace("group-", "") as GroupId);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [onHome]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-2 pb-[max(12px,env(safe-area-inset-bottom))] pointer-events-none"
    >
      <div className="glass pointer-events-auto flex items-center gap-0.5 rounded-full p-1 shadow-[var(--shadow-dock)] ring-1 ring-black/[0.06]">
        {groups.map((g) => {
          const Icon = dockIcons[g.id];
          const isActive = onHome && active === g.id;
          return (
            <Link
              key={g.id}
              href={`/#group-${g.id}`}
              scroll={!onHome}
              onClick={(e) => {
                if (!onHome) return;
                e.preventDefault();
                setActive(g.id);
                document.getElementById(`group-${g.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "relative flex h-11 min-w-10 flex-col items-center justify-center rounded-full px-2 text-[10px] font-medium transition-colors max-[400px]:h-10 sm:h-10 sm:flex-row sm:gap-1.5 sm:px-3.5 sm:text-[13px]",
                isActive ? "text-white" : "text-ink-2 hover:text-ink",
              )}
            >
              {isActive && <m.span layoutId="dock-active" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
              <Icon aria-hidden className="relative size-[18px] sm:size-4" strokeWidth={1.9} />
              <span className="relative max-[400px]:sr-only">{g.dock}</span>
            </Link>
          );
        })}
        <span aria-hidden className="mx-1 h-6 w-px bg-black/10" />
        <button
          type="button"
          onClick={openPalette}
          aria-label="Search (⌘K)"
          className="grid size-10 place-items-center rounded-full text-ink-2 transition hover:bg-black/[0.05] hover:text-ink sm:size-10"
        >
          <Search aria-hidden className="size-[18px]" />
        </button>
        <a
          href={profile.resumeHref}
          download
          aria-label="Download résumé"
          className="grid size-10 place-items-center rounded-full bg-accent text-white transition hover:bg-[#0077ed] sm:size-10"
        >
          <Download aria-hidden className="size-[18px]" />
        </a>
      </div>
    </nav>
  );
}
