import { notFound } from "next/navigation";
import { storySlugs } from "@/content";
import { loadStory } from "@/lib/content/story";
import { StorySheet } from "@/components/sheet/StorySheet";
import { StoryArticle } from "@/components/story/StoryArticle";

export const dynamicParams = false;

export function generateStaticParams() {
  return storySlugs.map((slug) => ({ slug }));
}

export default async function StorySheetRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await loadStory(slug);
  if (!story) notFound();
  return (
    <StorySheet key={slug} slug={slug}>
      <StoryArticle {...story} variant="sheet" />
    </StorySheet>
  );
}
