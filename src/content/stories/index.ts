import "server-only";
import type { StoryBody } from "../types";
import { aboutStories, labStories } from "./more";
import { processStories } from "./process";
import { workStories } from "./work";

const all: StoryBody[] = [...processStories, ...workStories, ...labStories, ...aboutStories];

const bySlug = new Map(all.map((s) => [s.slug, s]));

export function getStoryBody(slug: string): StoryBody | undefined {
  return bySlug.get(slug);
}

export const allStoryBodies = all;
