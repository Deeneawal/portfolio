import Image from "next/image";
import { ArrowUpRight, Mail, Phone, Download } from "lucide-react";
import type { Block } from "@/content/types";
import type { SiteProfile } from "@/lib/content/site";
import { Diagram } from "@/components/diagrams";
import { GithubIcon, LeetcodeIcon, LinkedinIcon, WhatsappIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

function Heading({ children }: { children: string }) {
  return <h2 className="display mb-5 text-[1.6rem] text-ink sm:text-[2rem]">{children}</h2>;
}

export function BlockRenderer({ block, profile }: { block: Block; profile: SiteProfile }) {
  switch (block.type) {
    case "text": {
      const paragraphs = Array.isArray(block.body) ? block.body : [block.body];
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <div className="max-w-3xl space-y-4 text-[17px] leading-[1.65] text-ink-2">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </section>
      );
    }
    case "stats":
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {block.items.map((s) => (
              <div key={s.label} className="rounded-[20px] bg-[#f5f5f7] p-5">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="display block text-[2.1rem] text-ink sm:text-[2.6rem]">{s.value}</span>
                  <span className="mt-1 block text-[13px] leading-snug text-muted">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      );
    case "steps":
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <ol className="relative space-y-6 border-l-2 border-accent/15 pl-7">
            {block.items.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="absolute -left-[42px] top-0 grid size-7 place-items-center rounded-full bg-accent text-[13px] font-semibold text-white ring-4 ring-white">
                  {i + 1}
                </span>
                <h3 className="text-[17px] font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 max-w-3xl text-[16px] leading-relaxed text-ink-2">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      );
    case "list": {
      const cols = block.columns ?? 1;
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <ul className={cn("grid gap-3", cols === 2 && "sm:grid-cols-2", cols === 3 && "sm:grid-cols-2 lg:grid-cols-3")}>
            {block.items.map((item) =>
              typeof item === "string" ? (
                <li key={item} className="flex gap-3 rounded-2xl bg-[#f5f5f7] px-4 py-3.5 text-[16px] leading-snug text-ink-2">
                  <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ) : (
                <li key={item.title} className="rounded-2xl bg-[#f5f5f7] px-5 py-4">
                  <h3 className="text-[16px] font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{item.body}</p>
                </li>
              ),
            )}
          </ul>
        </section>
      );
    }
    case "diagram":
      return <Diagram id={block.id} caption={block.caption} />;
    case "tags":
      return (
        <section>
          {block.heading && <h2 className="mb-3 text-[15px] font-semibold text-ink">{block.heading}</h2>}
          <ul className="flex flex-wrap gap-2">
            {block.items.map((t) => (
              <li key={t} className="rounded-full bg-[#f5f5f7] px-3.5 py-1.5 text-[14px] font-medium text-ink-2">
                {t}
              </li>
            ))}
          </ul>
        </section>
      );
    case "links":
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <ul className="grid gap-2">
            {block.items.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener"
                  className="group flex items-center justify-between gap-4 rounded-2xl bg-[#f5f5f7] px-5 py-4 transition hover:bg-[#ececf0]"
                >
                  <span className="min-w-0">
                    <span className="block text-[16px] font-semibold leading-snug text-ink">{l.label}</span>
                    {l.note && <span className="mt-0.5 block text-[14px] text-muted">{l.note}</span>}
                  </span>
                  <ArrowUpRight aria-hidden className="size-5 shrink-0 text-accent transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      );
    case "principle":
      return (
        <blockquote className="rounded-[24px] bg-gradient-to-br from-[#e8f2ff] to-[#f4efff] px-6 py-8 sm:px-10 sm:py-10">
          <p className="display max-w-3xl text-[1.5rem] text-ink sm:text-[2rem]">“{block.body}”</p>
        </blockquote>
      );
    case "beforeAfter":
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <ul className="grid gap-4">
            {block.items.map((item) => (
              <li key={item.label} className="rounded-[24px] bg-[#f5f5f7] p-5 sm:p-7">
                <p className="eyebrow text-muted">{item.label}</p>
                <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="display text-2xl text-faint line-through decoration-2 sm:text-3xl">{item.before}</span>
                  <span aria-hidden className="text-xl text-faint">→</span>
                  <span className="display text-[2.4rem] text-accent sm:text-5xl">{item.after}</span>
                </p>
                <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-2">{item.how}</p>
              </li>
            ))}
          </ul>
        </section>
      );
    case "decisions":
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <ul className="grid gap-3 md:grid-cols-2">
            {block.items.map((d) => (
              <li key={d.title} className="flex flex-col rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-black/[0.07]">
                <p className="eyebrow text-accent">Decision</p>
                <h3 className="mt-1.5 text-[18px] font-semibold leading-snug text-ink">{d.title}</h3>
                <dl className="mt-3 space-y-2 text-[14.5px] leading-relaxed">
                  <div>
                    <dt className="inline font-semibold text-ink">Context. </dt>
                    <dd className="inline text-ink-2">{d.context}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold text-ink">Choice. </dt>
                    <dd className="inline text-ink-2">{d.choice}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold text-ink">Why. </dt>
                    <dd className="inline text-ink-2">{d.why}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </section>
      );
    case "timeline":
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <ol className="divide-y divide-black/[0.06] rounded-[22px] bg-[#f5f5f7] px-5">
            {block.items.map((t) => (
              <li key={`${t.when}-${t.title}`} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6">
                <span className="w-36 shrink-0 text-[14px] font-medium text-muted">{t.when}</span>
                <span>
                  <span className="block text-[16px] font-semibold leading-snug text-ink">{t.title}</span>
                  {t.body && <span className="mt-0.5 block text-[14.5px] text-ink-2">{t.body}</span>}
                </span>
              </li>
            ))}
          </ol>
        </section>
      );
    case "code":
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          <figure className="overflow-hidden rounded-[22px] bg-[#141416]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-2.5 text-[12px] text-white/45">
              <span>{block.lang}</span>
              <span>illustrative</span>
            </div>
            <pre className="overflow-x-auto px-5 py-4 font-mono text-[12.5px] leading-6 text-[#e5e5ea] sm:text-[13px]">
              <code>{block.code}</code>
            </pre>
            {block.caption && <figcaption className="border-t border-white/10 px-5 py-3 text-[13px] text-white/55">{block.caption}</figcaption>}
          </figure>
        </section>
      );
    case "image": {
      const img = (
        <Image
          src={block.src}
          alt={block.alt}
          width={block.width}
          height={block.height}
          sizes="(min-width: 1024px) 960px, 100vw"
          className="h-auto w-full"
        />
      );
      return (
        <figure>
          {block.href ? (
            <a
              href={block.href}
              target="_blank"
              rel="noopener"
              className="block overflow-hidden rounded-[24px] ring-1 ring-black/[0.06] transition hover:opacity-95 hover:shadow-[var(--shadow-lift)]"
            >
              {img}
            </a>
          ) : (
            <div className="overflow-hidden rounded-[24px] ring-1 ring-black/[0.06]">{img}</div>
          )}
          {block.caption && <figcaption className="mt-3 text-[14px] text-muted">{block.caption}</figcaption>}
        </figure>
      );
    }
    case "gallery":
      return (
        <section>
          {block.heading && <Heading>{block.heading}</Heading>}
          {block.intro && <p className="-mt-2 mb-5 max-w-3xl text-[16px] leading-relaxed text-ink-2">{block.intro}</p>}
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {block.items.map((item) => (
              <li key={item.src}>
                <a href={item.href} target="_blank" rel="noopener" className="group block">
                  <span className="block overflow-hidden rounded-xl bg-[#f5f5f7] shadow-sm ring-1 ring-black/[0.08] transition group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-lift)]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      sizes="(min-width: 1024px) 240px, 50vw"
                      className="h-auto w-full"
                    />
                  </span>
                  <span className="mt-3 flex items-start justify-between gap-2">
                    <span className="text-[15px] font-semibold leading-snug text-ink">{item.title}</span>
                    <ArrowUpRight aria-hidden className="mt-0.5 size-4 shrink-0 text-accent transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{item.caption}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      );
    case "cta":
      return (
        <section className="rounded-[24px] bg-[#141416] px-6 py-8 text-white sm:px-10 sm:py-10">
          {block.eyebrow && <p className="eyebrow text-white/55">{block.eyebrow}</p>}
          <h2 className="display mt-2 max-w-2xl text-[1.7rem] sm:text-[2.2rem]">{block.title}</h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-white/75">{block.body}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={block.primary.href}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff4f1f] px-6 py-3.5 text-[16px] font-semibold text-white transition hover:bg-[#ff6a40]"
            >
              <Download aria-hidden className="size-5" /> {block.primary.label}
            </a>
            {block.secondary && (
              <a
                href={block.secondary.href}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3.5 text-[16px] font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/15"
              >
                {block.secondary.label} <ArrowUpRight aria-hidden className="size-5" />
              </a>
            )}
          </div>
          {block.note && <p className="mt-4 text-[13px] text-white/50">{block.note}</p>}
        </section>
      );
    case "contact":
      return <ContactBlock profile={profile} />;
  }
}

function ContactBlock({ profile }: { profile: SiteProfile }) {
  const rows = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: <Mail className="size-5" aria-hidden />, target: "email" },
    { label: "Phone", value: profile.phone, href: profile.phoneHref, icon: <Phone className="size-5" aria-hidden />, target: "phone" },
    { label: "WhatsApp", value: profile.phone, href: profile.whatsapp, icon: <WhatsappIcon size={20} />, target: "whatsapp" },
    { label: "LinkedIn", value: profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//, ""), href: profile.linkedin, icon: <LinkedinIcon size={20} />, target: "linkedin" },
    { label: "GitHub", value: profile.github.replace(/^https?:\/\/(www\.)?github\.com\//, ""), href: profile.github, icon: <GithubIcon size={20} />, target: "github" },
    { label: "LeetCode", value: profile.leetcode.replace(/^https?:\/\/(www\.)?leetcode\.com\//, ""), href: profile.leetcode, icon: <LeetcodeIcon size={20} />, target: "leetcode" },
  ];
  return (
    <section className="space-y-5">
      <ul className="grid gap-2 sm:grid-cols-2">
        {rows.map((r) => (
          <li key={r.label}>
            <a
              href={r.href}
              target={r.href.startsWith("http") ? "_blank" : undefined}
              rel={r.href.startsWith("http") ? "noopener" : undefined}
              data-track="contact_click"
              data-target={r.target}
              className="flex items-center gap-4 rounded-2xl bg-[#f5f5f7] px-5 py-4 transition hover:bg-[#ececf0]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink shadow-sm">{r.icon}</span>
              <span className="min-w-0">
                <span className="block text-[13px] text-muted">{r.label}</span>
                <span className="block truncate text-[16px] font-semibold text-ink">{r.value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <a
        href={profile.resumeHref}
        download
        className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-4 text-[16px] font-semibold text-white transition hover:bg-[#0077ed]"
      >
        <Download aria-hidden className="size-5" /> Download résumé (PDF)
      </a>
    </section>
  );
}
