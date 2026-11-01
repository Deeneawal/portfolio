"use client";

import { Command } from "cmdk";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Copy, Download, Hash, Mail, Phone } from "lucide-react";
import { groups } from "@/content";
import { profile as defaults } from "@/content/profile";
import type { StoryMeta } from "@/content/types";
import { iconMap, GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/icons";
import { isSheetOpen } from "@/lib/sheet-state";
import { track } from "@/lib/analytics/client";
import type { ReactNode } from "react";

const itemClass =
  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-ink aria-selected:bg-accent aria-selected:text-white data-[disabled=true]:opacity-40";

export interface PaletteData {
  stories: Pick<StoryMeta, "slug" | "title" | "eyebrow" | "summary" | "keywords" | "visual">[];
  contact: { email: string; phone: string; phoneHref: string; whatsapp: string; linkedin: string; github: string };
}

export default function CommandPalette({ open, onOpenChange, data }: { open: boolean; onOpenChange: (open: boolean) => void; data: PaletteData }) {
  const { stories } = data;
  const profile = { ...data.contact, resumeHref: defaults.resumeHref };
  const router = useRouter();
  const pathname = usePathname();

  const close = () => onOpenChange(false);

  const goToStory = (slug: string) => {
    close();
    const href = `/story/${slug}`;
    if (isSheetOpen()) router.replace(href, { scroll: false });
    else router.push(href, { scroll: false });
  };

  const goToGroup = (id: string) => {
    close();
    const scroll = () => document.getElementById(`group-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (isSheetOpen()) {
      router.back();
      window.setTimeout(scroll, 450);
    } else if (pathname === "/") {
      scroll();
    } else {
      router.push(`/#group-${id}`);
    }
  };

  const external = (href: string, target: string) => {
    close();
    track({ type: "contact_click", target });
    if (href.startsWith("http")) window.open(href, "_blank", "noopener");
    else window.location.href = href;
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Search the portfolio"
      loop
      overlayClassName="fixed inset-0 z-[70] bg-black/25 backdrop-blur-[2px]"
      contentClassName="fixed left-1/2 top-[12vh] z-[80] w-[calc(100vw-32px)] max-w-[620px] -translate-x-1/2 overflow-hidden rounded-[22px] bg-white/95 shadow-[0_30px_80px_rgb(0_0_0/0.25)] ring-1 ring-black/10 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 border-b border-line px-5">
        <Command.Input
          autoFocus
          placeholder="Search stories, skills, actions…"
          className="h-14 w-full bg-transparent text-[17px] text-ink outline-none placeholder:text-faint"
        />
        <kbd className="rounded-md bg-black/[0.05] px-1.5 py-0.5 text-[11px] text-faint">esc</kbd>
      </div>
      <Command.List className="max-h-[min(60vh,460px)] overflow-y-auto overscroll-contain p-2">
        <Command.Empty className="px-4 py-10 text-center text-sm text-muted">No matches. Try “RLS”, “Flutter” or “résumé”.</Command.Empty>

        <Group heading="Actions">
          <Command.Item value="download resume cv pdf" onSelect={() => { close(); window.location.href = profile.resumeHref; }} className={itemClass}>
            <Download className="size-4 shrink-0" aria-hidden /> Download résumé (PDF)
          </Command.Item>
          <Command.Item
            value="copy email address"
            onSelect={() => {
              close();
              void navigator.clipboard?.writeText(profile.email);
              track({ type: "contact_click", target: "copy-email" });
            }}
            className={itemClass}
          >
            <Copy className="size-4 shrink-0" aria-hidden /> Copy email address
          </Command.Item>
          <Command.Item value="email me mail" onSelect={() => external(`mailto:${profile.email}`, "email")} className={itemClass}>
            <Mail className="size-4 shrink-0" aria-hidden /> Email {profile.email}
          </Command.Item>
          <Command.Item value="call phone" onSelect={() => external(profile.phoneHref, "phone")} className={itemClass}>
            <Phone className="size-4 shrink-0" aria-hidden /> Call {profile.phone}
          </Command.Item>
          <Command.Item value="whatsapp message chat" onSelect={() => external(profile.whatsapp, "whatsapp")} className={itemClass}>
            <WhatsappIcon size={16} className="shrink-0" /> Message on WhatsApp
          </Command.Item>
          <Command.Item value="linkedin profile" onSelect={() => external(profile.linkedin, "linkedin")} className={itemClass}>
            <LinkedinIcon size={16} className="shrink-0" /> LinkedIn
          </Command.Item>
          <Command.Item value="github code source" onSelect={() => external(profile.github, "github")} className={itemClass}>
            <GithubIcon size={16} className="shrink-0" /> GitHub
          </Command.Item>
        </Group>

        <Group heading="Stories">
          {stories.map((s) => {
            const Icon = s.visual?.kind === "icon" ? iconMap[s.visual.icon] : ArrowRight;
            return (
              <Command.Item
                key={s.slug}
                value={`${s.title} ${s.eyebrow} ${s.summary} ${(s.keywords ?? []).join(" ")}`}
                onSelect={() => goToStory(s.slug)}
                className={itemClass}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{s.title}</span>
                <span className="hidden shrink-0 text-xs opacity-60 sm:block">{s.eyebrow}</span>
              </Command.Item>
            );
          })}
        </Group>

        <Group heading="Sections">
          {groups.map((g) => (
            <Command.Item key={g.id} value={`section ${g.title} ${g.dock}`} onSelect={() => goToGroup(g.id)} className={itemClass}>
              <Hash className="size-4 shrink-0" aria-hidden /> {g.title}
            </Command.Item>
          ))}
        </Group>
      </Command.List>
      <div className="hidden items-center justify-end gap-4 border-t border-line px-4 py-2.5 text-xs text-faint sm:flex">
        <span>↑↓ to move</span>
        <span>↵ to open</span>
      </div>
    </Command.Dialog>
  );
}

function Group({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="mb-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-faint"
    >
      {children}
    </Command.Group>
  );
}
