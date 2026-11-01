import "server-only";
import { getStoryBody } from "@/content/stories";
import { applyBodyOverride, getSiteContent } from "./site";

/** Everything a story route needs, with owner edits applied. Hidden stories resolve to null. */
export async function loadStory(slug: string) {
  const content = await getSiteContent();
  const meta = content.stories.find((s) => s.slug === slug);
  const rawBody = getStoryBody(slug);
  if (!meta || !rawBody) return null;
  const body = applyBodyOverride(rawBody, content.overrides);
  const related = (body.related ?? [])
    .map((r) => content.stories.find((s) => s.slug === r))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  return { meta, body, related, profile: content.profile };
}
