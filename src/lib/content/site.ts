import "server-only";
import { unstable_cache } from "next/cache";
import { stories as defaultStories } from "@/content";
import { headlineStats, profile as defaultProfile } from "@/content/profile";
import type { StoryBody, StoryMeta } from "@/content/types";
import { getServiceClient } from "../supabase";
import { overridesSchema, type ContentOverrides } from "./schema";
import { isMissingTableError, readContentFromStorage } from "../analytics/storageStore";

export const CONTENT_TAG = "site-content";

/** Owner edits made in /admin/content, cached until the next save invalidates the tag. */
export const getOverrides = unstable_cache(
  async (): Promise<ContentOverrides> => {
    const supabase = getServiceClient();
    if (!supabase) return {};
    const { data, error } = await supabase.from("site_content").select("value").eq("key", "overrides").maybeSingle();
    const value = isMissingTableError(error) ? await readContentFromStorage(supabase) : error ? null : data?.value;
    if (!value) return {};
    const parsed = overridesSchema.safeParse(value);
    return parsed.success ? parsed.data : {};
  },
  ["site-content-overrides-v1"],
  { tags: [CONTENT_TAG] },
);

export type SiteProfile = typeof defaultProfile & { openToWork: boolean };

function digits(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export async function getSiteContent() {
  const o = await getOverrides();
  const p = o.profile ?? {};
  const pick = <K extends keyof typeof p>(key: K, fallback: string) => {
    const v = p[key];
    return typeof v === "string" && v.length > 0 ? v : fallback;
  };

  const phone = pick("phone", defaultProfile.phone);
  const phoneDigits = digits(phone);
  const profile: SiteProfile = {
    ...defaultProfile,
    title: pick("title", defaultProfile.title),
    role: pick("role", defaultProfile.role),
    location: pick("location", defaultProfile.location),
    availability: pick("availability", defaultProfile.availability),
    headline: pick("headline", defaultProfile.headline),
    intro: pick("intro", defaultProfile.intro),
    email: pick("email", defaultProfile.email),
    phone,
    phoneHref: `tel:${phoneDigits}`,
    whatsapp: `https://wa.me/${phoneDigits.replace(/^\+/, "")}`,
    linkedin: pick("linkedin", defaultProfile.linkedin),
    github: pick("github", defaultProfile.github),
    leetcode: pick("leetcode", defaultProfile.leetcode),
    openToWork: p.openToWork ?? true,
  } as SiteProfile;

  const stats = o.stats && o.stats.length > 0 ? o.stats : [...headlineStats];

  const allStories: (StoryMeta & { hidden: boolean })[] = defaultStories.map((s) => {
    const so = o.stories?.[s.slug] ?? {};
    return {
      ...s,
      eyebrow: so.eyebrow || s.eyebrow,
      title: so.title || s.title,
      summary: so.summary || s.summary,
      hidden: so.hidden === true,
    };
  });

  return {
    profile,
    stats,
    stories: allStories.filter((s) => !s.hidden),
    allStories,
    resumeUrl: o.resumeUrl,
    resumeUpdatedAt: o.resumeUpdatedAt,
    overrides: o,
  };
}

export type SiteContent = Awaited<ReturnType<typeof getSiteContent>>;

export function applyBodyOverride(body: StoryBody, o: ContentOverrides): StoryBody {
  const lede = o.stories?.[body.slug]?.lede;
  return lede ? { ...body, lede } : body;
}
