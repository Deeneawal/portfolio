"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import { Check, EyeOff, FileUp, RotateCcw } from "lucide-react";
import { revertResume, saveContent, uploadResume, type SaveState } from "@/app/admin/content/actions";
import { cn } from "@/lib/cn";

type ProfileKey = "title" | "role" | "location" | "availability" | "headline" | "intro" | "email" | "phone" | "linkedin" | "github" | "leetcode";
type StoryFields = { eyebrow: string; title: string; summary: string; lede: string };

export interface EditorData {
  profile: Record<ProfileKey, string> & { openToWork: boolean };
  profileDefaults: Record<ProfileKey, string>;
  stats: { value: string; label: string }[];
  statsDefaults: { value: string; label: string }[];
  groups: { id: string; title: string }[];
  stories: { slug: string; group: string; current: StoryFields; defaults: StoryFields; hidden: boolean; edited: boolean }[];
  resume: { url: string | null; updatedAt: string | null; bundled: string };
}

const inputClass =
  "w-full rounded-xl bg-[#f5f5f7] px-3.5 py-2.5 text-[15px] text-ink outline-none ring-accent/40 transition placeholder:text-faint focus:bg-white focus:ring-4";

function Field({
  label,
  name,
  value,
  fallback,
  multiline,
  rows = 3,
  type = "text",
  maxLength,
}: {
  label: string;
  name: string;
  value: string;
  fallback: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  maxLength?: number;
}) {
  const [v, setV] = useState(value);
  const changed = v.trim() !== fallback;
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between gap-2 text-[13px] font-medium text-ink-2">
        {label}
        {changed && (
          <button type="button" onClick={() => setV(fallback)} className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:underline">
            <RotateCcw aria-hidden className="size-3" /> Restore original
          </button>
        )}
      </span>
      {multiline ? (
        <textarea name={name} value={v} onChange={(e) => setV(e.target.value)} rows={rows} maxLength={maxLength} placeholder={fallback} className={cn(inputClass, "resize-y leading-relaxed")} />
      ) : (
        <input name={name} type={type} value={v} onChange={(e) => setV(e.target.value)} maxLength={maxLength} placeholder={fallback} className={inputClass} />
      )}
    </label>
  );
}

function Card({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <section className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/[0.05] sm:p-7">
      <h2 className="text-[19px] font-semibold text-ink">{title}</h2>
      {intro && <p className="mt-1 text-[14px] text-muted">{intro}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Status({ state, pending }: { state: SaveState; pending: boolean }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!state.at && !state.error) return;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(t);
  }, [state]);
  if (pending) return <span className="text-[14px] text-muted">Saving…</span>;
  if (!visible) return null;
  if (state.error)
    return (
      <span role="alert" className="text-[14px] text-bad">
        {state.error}
      </span>
    );
  return (
    <span role="status" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-good">
      <Check aria-hidden className="size-4" /> Saved. The live site updates within seconds.
    </span>
  );
}

export function ContentEditor({ data }: { data: EditorData }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveContent, {});
  const [resumeState, resumeAction, resumePending] = useActionState<SaveState, FormData>(uploadResume, {});
  const [revertState, revertAction, revertPending] = useActionState<SaveState, FormData>(revertResume, {});
  const p = data.profile;
  const d = data.profileDefaults;

  return (
    <div className="mt-8 space-y-5">
      <form action={action} className="space-y-5">
        <Card title="Profile" intro="Shown on the home screen, in the contact story, in search and in link previews. Clear a field to restore its original text.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" name="profile.title" value={p.title} fallback={d.title} maxLength={80} />
            <Field label="Role" name="profile.role" value={p.role} fallback={d.role} maxLength={120} />
            <Field label="Location" name="profile.location" value={p.location} fallback={d.location} maxLength={80} />
            <Field label="Phone" name="profile.phone" value={p.phone} fallback={d.phone} maxLength={30} type="tel" />
          </div>
          <Field label="Headline" name="profile.headline" value={p.headline} fallback={d.headline} multiline rows={2} maxLength={240} />
          <Field label="Introduction" name="profile.intro" value={p.intro} fallback={d.intro} multiline rows={4} maxLength={900} />
          <Field label="Availability" name="profile.availability" value={p.availability} fallback={d.availability} multiline rows={2} maxLength={240} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" name="profile.email" value={p.email} fallback={d.email} type="email" maxLength={120} />
            <Field label="LinkedIn URL" name="profile.linkedin" value={p.linkedin} fallback={d.linkedin} type="url" maxLength={300} />
            <Field label="GitHub URL" name="profile.github" value={p.github} fallback={d.github} type="url" maxLength={300} />
            <Field label="LeetCode URL" name="profile.leetcode" value={p.leetcode} fallback={d.leetcode} type="url" maxLength={300} />
          </div>
          <label className="flex items-center gap-3 rounded-xl bg-[#f5f5f7] px-4 py-3">
            <input type="checkbox" name="profile.openToWork" defaultChecked={p.openToWork} className="size-5 accent-[#0071e3]" />
            <span>
              <span className="block text-[15px] font-medium text-ink">Show “Open to full-time roles”</span>
              <span className="block text-[13px] text-muted">Turn off when you’re no longer looking.</span>
            </span>
          </label>
        </Card>

        <Card title="Headline numbers" intro="The four figures on the home screen. Keep them in line with your résumé.">
          <div className="grid gap-3 sm:grid-cols-2">
            {data.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-[96px_1fr] gap-2">
                <Field label={`Value ${i + 1}`} name={`stats.${i}.value`} value={s.value} fallback={data.statsDefaults[i]?.value ?? ""} maxLength={12} />
                <Field label="Label" name={`stats.${i}.label`} value={s.label} fallback={data.statsDefaults[i]?.label ?? ""} maxLength={40} />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Stories" intro="Edit the card text and opening paragraph of any story, or hide it. Diagrams and detailed sections stay as written in code.">
          {data.groups.map((g) => {
            const items = data.stories.filter((s) => s.group === g.id);
            if (items.length === 0) return null;
            return (
              <div key={g.id}>
                <p className="eyebrow mb-2 mt-2 text-muted">{g.title}</p>
                <div className="space-y-2">
                  {items.map((s) => (
                    <details key={s.slug} className="group rounded-2xl bg-[#f5f5f7] open:bg-white open:ring-1 open:ring-black/[0.08]">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                        <span className="min-w-0">
                          <span className="block truncate text-[15px] font-semibold text-ink">{s.current.title}</span>
                          <span className="block text-[12px] text-muted">/story/{s.slug}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          {s.hidden && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.06] px-2 py-0.5 text-[11px] font-medium text-ink-2">
                              <EyeOff aria-hidden className="size-3" /> Hidden
                            </span>
                          )}
                          {s.edited && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">Edited</span>}
                          <span aria-hidden className="text-faint transition group-open:rotate-90">›</span>
                        </span>
                      </summary>
                      <div className="space-y-3 px-4 pb-4">
                        <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                          <Field label="Eyebrow" name={`story.${s.slug}.eyebrow`} value={s.current.eyebrow} fallback={s.defaults.eyebrow} maxLength={60} />
                          <Field label="Title" name={`story.${s.slug}.title`} value={s.current.title} fallback={s.defaults.title} maxLength={120} />
                        </div>
                        <Field label="Card summary" name={`story.${s.slug}.summary`} value={s.current.summary} fallback={s.defaults.summary} multiline rows={2} maxLength={300} />
                        <Field label="Opening paragraph" name={`story.${s.slug}.lede`} value={s.current.lede} fallback={s.defaults.lede} multiline rows={4} maxLength={1200} />
                        <label className="flex items-center gap-2 text-[14px] text-ink-2">
                          <input type="checkbox" name={`story.${s.slug}.hidden`} defaultChecked={s.hidden} className="size-4 accent-[#0071e3]" />
                          Hide this story from the site
                        </label>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            );
          })}
        </Card>

        <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-full bg-white/90 p-2 pl-5 shadow-[var(--shadow-dock)] ring-1 ring-black/[0.06] backdrop-blur-xl">
          <Status state={state} pending={pending} />
          <button
            type="submit"
            disabled={pending}
            className="ml-auto h-11 rounded-full bg-accent px-6 text-[15px] font-semibold text-white transition hover:bg-[#0077ed] disabled:opacity-60"
          >
            Save changes
          </button>
        </div>
      </form>

      <Card title="Résumé PDF" intro="Upload a new PDF to replace the one visitors download. Downloads are still counted in analytics.">
        <p className="text-[14px] text-ink-2">
          Currently serving:{" "}
          {data.resume.url ? (
            <a href={data.resume.url} target="_blank" rel="noopener" className="font-medium text-accent-ink hover:underline">
              uploaded PDF
            </a>
          ) : (
            <a href={data.resume.bundled} target="_blank" rel="noopener" className="font-medium text-accent-ink hover:underline">
              bundled CV
            </a>
          )}
          {data.resume.updatedAt && <span className="text-muted"> · updated {new Date(data.resume.updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</span>}
        </p>
        <form action={resumeAction} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            required
            className="flex-1 text-[14px] text-ink-2 file:mr-3 file:rounded-full file:border-0 file:bg-[#f5f5f7] file:px-4 file:py-2 file:text-[14px] file:font-medium file:text-ink hover:file:bg-[#ececf0]"
          />
          <button type="submit" disabled={resumePending} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-white disabled:opacity-60">
            <FileUp aria-hidden className="size-4" /> Upload PDF
          </button>
        </form>
        <Status state={resumeState} pending={resumePending} />
        {data.resume.url && (
          <form action={revertAction} className="flex items-center gap-3">
            <button type="submit" disabled={revertPending} className="text-[14px] font-medium text-accent-ink hover:underline disabled:opacity-60">
              Go back to the bundled CV
            </button>
            <Status state={revertState} pending={revertPending} />
          </form>
        )}
      </Card>
    </div>
  );
}
