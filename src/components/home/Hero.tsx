import Image from "next/image";
import { Download, Mail, MapPin, Phone } from "lucide-react";
import type { SiteProfile } from "@/lib/content/site";
import { GithubIcon, LeetcodeIcon, LinkedinIcon, WhatsappIcon } from "@/components/icons";

export function PortraitCard({ profile }: { profile: SiteProfile }) {
  return (
    <figure className="relative min-h-[460px] overflow-hidden rounded-[28px] bg-[#d9c9bd] shadow-[var(--shadow-tile)] sm:col-span-2 sm:row-span-2 sm:min-h-[540px]">
      <Image
        src={profile.portrait}
        alt="Zuhaib Ahmad Khan in a white shirt, standing in front of a terracotta building with plants"
        fill
        priority
        sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
        className="object-cover object-[50%_28%]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
        <p className="eyebrow text-white/75">Portfolio</p>
        <p className="display mt-2 text-[2.6rem] sm:text-6xl">{profile.name}</p>
        <p className="mt-2 text-lg font-medium text-white/90 sm:text-xl">{profile.title}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/75">
          <MapPin aria-hidden className="size-4" /> {profile.location}
          {profile.openToWork && ` · ${profile.openTo}`}
        </p>
      </figcaption>
    </figure>
  );
}

export function IntroCard({ profile }: { profile: SiteProfile }) {
  return (
    <section
      aria-label="Introduction"
      className="flex flex-col justify-between gap-8 rounded-[28px] bg-white p-6 shadow-[var(--shadow-tile)] ring-1 ring-black/[0.04] sm:col-span-2 sm:row-span-2 sm:p-9"
    >
      <div>
        {profile.openToWork ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-[#e9f8f1] px-3 py-1.5 text-xs font-semibold text-[#1d6b40]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#30d158] opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-[#30d158]" />
            </span>
            Open to full-time roles · remote or relocate
          </p>
        ) : (
          <p className="inline-flex items-center gap-2 rounded-full bg-black/[0.05] px-3 py-1.5 text-xs font-semibold text-ink-2">{profile.role}</p>
        )}
        <p className="display mt-6 text-[1.9rem] text-ink sm:text-[2.6rem]">{profile.headline}</p>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-2">{profile.intro}</p>
        <p className="mt-3 text-[15px] text-muted">
          {profile.role} at{" "}
          <a href={profile.companyUrl} target="_blank" rel="noopener" className="font-medium text-accent-ink hover:underline">
            {profile.company}
          </a>
          .
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-3">
          <a
            href={profile.resumeHref}
            download
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-[15px] font-medium text-white transition hover:bg-[#0077ed] active:scale-[0.98]"
          >
            <Download aria-hidden className="size-4" /> Download résumé
          </a>
          <a
            href={`mailto:${profile.email}`}
            data-track="contact_click"
            data-target="email"
            className="inline-flex items-center gap-2 rounded-full bg-black/[0.05] px-5 py-3 text-[15px] font-medium text-ink transition hover:bg-black/[0.08] active:scale-[0.98]"
          >
            <Mail aria-hidden className="size-4" /> Email me
          </a>
        </div>
        <ul className="flex flex-wrap items-center gap-2" aria-label="Elsewhere">
          {[
            { href: profile.phoneHref, label: "Call", icon: <Phone className="size-[18px]" aria-hidden />, target: "phone" },
            { href: profile.whatsapp, label: "WhatsApp", icon: <WhatsappIcon />, target: "whatsapp" },
            { href: profile.linkedin, label: "LinkedIn", icon: <LinkedinIcon />, target: "linkedin" },
            { href: profile.github, label: "GitHub", icon: <GithubIcon />, target: "github" },
            { href: profile.leetcode, label: "LeetCode", icon: <LeetcodeIcon />, target: "leetcode" },
          ].map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noopener" : undefined}
                aria-label={l.label}
                title={l.label}
                data-track="contact_click"
                data-target={l.target}
                className="grid size-11 place-items-center rounded-full bg-black/[0.04] text-ink-2 transition hover:bg-black/[0.08] hover:text-ink"
              >
                {l.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function StatsCard({ stats }: { stats: readonly { value: string; label: string }[] }) {
  return (
    <section
      aria-label="SurgyCRM in numbers"
      className="flex flex-col justify-center rounded-[28px] bg-white p-6 shadow-[var(--shadow-tile)] ring-1 ring-black/[0.04] sm:col-span-2 sm:p-8 lg:col-span-4"
    >
      <p className="eyebrow text-muted">SurgyCRM in numbers</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="display block text-5xl text-ink sm:text-6xl">{s.value}</span>
              <span className="mt-1 block text-sm text-muted">{s.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
