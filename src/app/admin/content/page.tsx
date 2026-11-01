import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { getSiteContent } from "@/lib/content/site";
import { getStoryBody } from "@/content/stories";
import { groups, stories as defaultStories } from "@/content";
import { headlineStats, profile as defaultProfile } from "@/content/profile";
import { ContentEditor, type EditorData } from "@/components/admin/ContentEditor";
import { OwnerFlag } from "@/components/admin/OwnerFlag";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  await requireAdmin();
  const content = await getSiteContent();
  const o = content.overrides;

  const data: EditorData = {
    profile: {
      title: content.profile.title,
      role: content.profile.role,
      location: content.profile.location,
      availability: content.profile.availability,
      headline: content.profile.headline,
      intro: content.profile.intro,
      email: content.profile.email,
      phone: content.profile.phone,
      linkedin: content.profile.linkedin,
      github: content.profile.github,
      leetcode: content.profile.leetcode,
      openToWork: content.profile.openToWork,
    },
    profileDefaults: {
      title: defaultProfile.title,
      role: defaultProfile.role,
      location: defaultProfile.location,
      availability: defaultProfile.availability,
      headline: defaultProfile.headline,
      intro: defaultProfile.intro,
      email: defaultProfile.email,
      phone: defaultProfile.phone,
      linkedin: defaultProfile.linkedin,
      github: defaultProfile.github,
      leetcode: defaultProfile.leetcode,
    },
    stats: [0, 1, 2, 3].map((i) => content.stats[i] ?? { value: "", label: "" }),
    statsDefaults: headlineStats.map((s) => ({ ...s })),
    groups: groups.map((g) => ({ id: g.id, title: g.title })),
    stories: defaultStories.map((s) => {
      const so = o.stories?.[s.slug] ?? {};
      const lede = getStoryBody(s.slug)?.lede ?? "";
      return {
        slug: s.slug,
        group: s.group,
        current: {
          eyebrow: so.eyebrow ?? s.eyebrow,
          title: so.title ?? s.title,
          summary: so.summary ?? s.summary,
          lede: so.lede ?? lede,
        },
        defaults: { eyebrow: s.eyebrow, title: s.title, summary: s.summary, lede },
        hidden: so.hidden === true,
        edited: Object.keys(so).length > 0,
      };
    }),
    resume: { url: content.resumeUrl ?? null, updatedAt: content.resumeUpdatedAt ?? null, bundled: defaultProfile.resumeFile },
  };

  return (
    <main id="main" className="mx-auto max-w-[920px] px-4 pb-24 pt-6 sm:px-6">
      <OwnerFlag />
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-muted">Private · only you can edit</p>
          <h1 className="display mt-1 text-4xl">Edit portfolio</h1>
        </div>
        <nav className="flex items-center gap-2" aria-label="Admin">
          <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-medium shadow-sm ring-1 ring-black/[0.06]">
            <ArrowLeft aria-hidden className="size-4" /> Site
          </Link>
          <Link href="/admin" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-medium shadow-sm ring-1 ring-black/[0.06]">
            <BarChart3 aria-hidden className="size-4" /> Analytics
          </Link>
        </nav>
      </header>
      {content.profile && !process.env.SUPABASE_URL && (
        <p className="mt-6 rounded-2xl bg-[#fff3ea] p-4 text-[14px] text-ink-2">Supabase isn&apos;t configured, so changes can&apos;t be saved yet.</p>
      )}
      <ContentEditor data={data} />
    </main>
  );
}
