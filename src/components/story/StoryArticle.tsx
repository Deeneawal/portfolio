import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { StoryBody, StoryMeta } from "@/content/types";
import type { SiteProfile } from "@/lib/content/site";
import { BlockRenderer } from "./BlockRenderer";
import { SheetBody, SheetTitle } from "@/components/sheet/SheetParts";
import { cn } from "@/lib/cn";

const titleClass = "display text-[2.4rem] sm:text-[3.6rem] lg:text-[4.2rem]";

export function StoryArticle({
  meta,
  body,
  variant,
  related,
  profile,
}: {
  meta: StoryMeta;
  body: StoryBody;
  variant: "sheet" | "page";
  related: StoryMeta[];
  profile: SiteProfile;
}) {
  const onDark = meta.tone === "dark" || meta.tone === "graphite";

  const header = (
    <header className={cn(`tone-${meta.tone}`, "px-6 pb-10 pt-16 sm:px-12 sm:pb-14 sm:pt-20")}>
      <p className={cn("eyebrow", onDark ? "text-white/55" : "text-muted")}>{meta.eyebrow}</p>
      {variant === "sheet" ? (
        <SheetTitle slug={meta.slug} className={cn(titleClass, "mt-3 max-w-4xl pr-10", onDark ? "text-white" : "text-ink")}>
          {meta.title}
        </SheetTitle>
      ) : (
        <h1 className={cn(titleClass, "mt-3 max-w-4xl", onDark ? "text-white" : "text-ink")}>{meta.title}</h1>
      )}
      <p className={cn("mt-6 max-w-3xl text-[19px] leading-relaxed sm:text-[21px]", onDark ? "text-white/75" : "text-ink-2")}>{body.lede}</p>
    </header>
  );

  const content = (
    <>
      <div className="space-y-14 px-6 py-12 sm:space-y-16 sm:px-12 sm:py-16">
        {body.blocks.map((block, i) => (
          <BlockRenderer key={`${block.type}-${i}`} block={block} profile={profile} />
        ))}
      </div>
      {related.length > 0 && (
        <nav aria-label="Keep reading" className="border-t border-black/[0.06] px-6 py-10 sm:px-12">
          <p className="eyebrow mb-4 text-muted">Keep reading</p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/story/${r.slug}`}
                  replace={variant === "sheet"}
                  scroll={variant === "page"}
                  className={cn(`tone-${r.tone}`, "group relative flex h-full flex-col rounded-[20px] p-5 pr-14 ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] motion-reduce:transform-none")}
                >
                  <span className={cn("eyebrow block", r.tone === "dark" || r.tone === "graphite" ? "text-white/60" : "text-muted")}>{r.eyebrow}</span>
                  <span className="mt-1.5 block text-[17px] font-semibold leading-snug">{r.title}</span>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute right-4 top-4 flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[12px] font-semibold transition-all duration-300",
                      r.tone === "dark" || r.tone === "graphite"
                        ? "bg-white/15 text-white ring-1 ring-white/20"
                        : r.tone === "light"
                          ? "bg-[#f5f5f7] text-ink ring-1 ring-black/[0.06]"
                          : "bg-white/80 text-ink shadow-sm",
                    )}
                  >
                    <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:mr-1 group-hover:max-w-20 group-hover:opacity-100">
                      Read
                    </span>
                    <ArrowUpRight className="size-4 shrink-0" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );

  return (
    <>
      {header}
      {variant === "sheet" ? <SheetBody>{content}</SheetBody> : content}
    </>
  );
}
