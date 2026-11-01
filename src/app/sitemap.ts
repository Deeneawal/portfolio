import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/profile";
import { getSiteContent } from "@/lib/content/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const { stories } = await getSiteContent();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...stories.map(({ slug }) => ({
      url: `${SITE_URL}/story/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
