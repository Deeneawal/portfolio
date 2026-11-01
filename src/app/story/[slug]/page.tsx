import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { storySlugs } from "@/content";
import { profile } from "@/content/profile";
import { loadStory } from "@/lib/content/story";
import { StoryArticle } from "@/components/story/StoryArticle";

export const dynamicParams = false;

export function generateStaticParams() {
  return storySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = await loadStory(slug);
  if (!story) return {};
  const { meta } = story;
  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical: `/story/${slug}` },
    openGraph: { title: `${meta.title} · ${profile.name}`, description: meta.summary, url: `/story/${slug}`, type: "article" },
  };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await loadStory(slug);
  if (!story) notFound();
  return (
    <main id="main" className="mx-auto max-w-[1040px] px-0 pb-36 pt-3 sm:px-6 sm:pt-8">
      <div className="mb-3 flex items-center justify-between px-4 sm:mb-5 sm:px-0">
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[15px] font-medium text-ink shadow-sm ring-1 ring-black/[0.06] transition hover:bg-[#fafafa]"
        >
          <ArrowLeft aria-hidden className="size-4" /> All stories
        </Link>
        <span className="text-[14px] font-medium text-muted">{profile.name}</span>
      </div>
      <article className="overflow-clip rounded-[28px] bg-white shadow-[var(--shadow-tile)]">
        <StoryArticle {...story} variant="page" />
      </article>
    </main>
  );
}
