import { Download, Search } from "lucide-react";
import { groups } from "@/content";
import { getSiteContent } from "@/lib/content/site";
import { StoryTile } from "@/components/bento/StoryTile";
import { IntroCard, PortraitCard, StatsCard } from "@/components/home/Hero";
import { PaletteButton } from "@/components/chrome/PaletteButton";

export default async function HomePage() {
  const { profile, stats, stories } = await getSiteContent();
  return (
    <>
      <header className="mx-auto flex max-w-[1180px] items-center justify-between px-4 pt-5 sm:px-6 sm:pt-7">
        <a href="#group-today" className="flex items-center gap-2.5">
          <span aria-hidden className="grid size-9 place-items-center rounded-full bg-ink text-[13px] font-semibold tracking-tight text-white">
            {profile.initials}
          </span>
          <span className="sr-only text-[15px] font-semibold tracking-tight sm:not-sr-only">{profile.name}</span>
        </a>
        <div className="flex items-center gap-2">
          <PaletteButton className="hidden h-9 items-center gap-2 rounded-full bg-black/[0.05] pl-3 pr-2 text-sm text-muted transition hover:bg-black/[0.08] sm:inline-flex">
            <Search aria-hidden className="size-4" /> Search
            <kbd className="rounded-md bg-white px-1.5 py-0.5 font-sans text-[11px] text-faint shadow-sm">⌘K</kbd>
          </PaletteButton>
          <a
            href={profile.resumeHref}
            download
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-white transition hover:bg-black"
          >
            <Download aria-hidden className="size-4" /> Résumé
          </a>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-[1180px] px-4 pb-40 sm:px-6">
        <h1 className="sr-only">
          {profile.name}, {profile.title}
        </h1>
        {groups.map((group) => {
          const items = stories.filter((s) => s.group === group.id);
          return (
            <section key={group.id} id={`group-${group.id}`} aria-labelledby={`heading-${group.id}`} className="scroll-mt-6 pt-12 sm:pt-16">
              <div className="mb-6 flex flex-col gap-1 sm:mb-8">
                <h2 id={`heading-${group.id}`} className="display text-[2.1rem] sm:text-5xl">
                  {group.title}
                </h2>
                <p className="text-[17px] text-muted">{group.intro}</p>
              </div>
              <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:auto-rows-[minmax(260px,auto)] sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                {group.id === "today" && (
                  <>
                    <PortraitCard profile={profile} />
                    <IntroCard profile={profile} />
                    <StatsCard stats={stats} />
                  </>
                )}
                {items.map((story) => (
                  <StoryTile key={story.slug} story={story} />
                ))}
              </div>
            </section>
          );
        })}

        <footer className="mt-20 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {profile.name}. Based in {profile.location}, {profile.openTo}.
          </p>
          <p>
            <a href="https://github.com/Deeneawal/portfolio" target="_blank" rel="noopener" className="hover:text-ink">
              Source on GitHub
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
