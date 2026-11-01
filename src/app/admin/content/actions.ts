"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { getServiceClient } from "@/lib/supabase";
import { CONTENT_TAG, getOverrides } from "@/lib/content/site";
import { overridesSchema, type ContentOverrides } from "@/lib/content/schema";
import { isMissingTableError, writeContentToStorage } from "@/lib/analytics/storageStore";
import { stories as defaultStories } from "@/content";
import { headlineStats, profile as defaultProfile } from "@/content/profile";
import { getStoryBody } from "@/content/stories";

export interface SaveState {
  ok?: boolean;
  error?: string;
  at?: string;
}

const PROFILE_FIELDS = [
  "title",
  "role",
  "location",
  "availability",
  "headline",
  "intro",
  "email",
  "phone",
  "linkedin",
  "github",
  "leetcode",
] as const;
const STORY_FIELDS = ["eyebrow", "title", "summary", "lede"] as const;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

async function persist(next: ContentOverrides): Promise<string | null> {
  const parsed = overridesSchema.safeParse(next);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return `Check “${issue?.path.join(" › ") || "a field"}”: ${issue?.message ?? "invalid value"}`;
  }
  const supabase = getServiceClient();
  if (!supabase) return "Supabase isn't configured.";
  const { error } = await supabase
    .from("site_content")
    .upsert({ key: "overrides", value: parsed.data, updated_at: new Date().toISOString() });
  if (isMissingTableError(error)) {
    const storageError = await writeContentToStorage(supabase, parsed.data);
    if (storageError) return `Couldn't save: ${storageError}`;
  } else if (error) {
    return `Couldn't save: ${error.message}`;
  }
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  return null;
}

/** Stores only fields that differ from the defaults in code; an empty field restores the default. */
export async function saveContent(_prev: SaveState, fd: FormData): Promise<SaveState> {
  await requireAdmin();
  const current = await getOverrides();

  const profile: NonNullable<ContentOverrides["profile"]> = {};
  for (const field of PROFILE_FIELDS) {
    const value = str(fd, `profile.${field}`);
    if (value && value !== defaultProfile[field]) profile[field] = value;
  }
  if (fd.get("profile.openToWork") !== "on") profile.openToWork = false;

  const stats: { value: string; label: string }[] = [];
  for (let i = 0; i < 4; i++) {
    const value = str(fd, `stats.${i}.value`);
    const label = str(fd, `stats.${i}.label`);
    if (value && label) stats.push({ value, label });
  }
  const statsChanged =
    stats.length !== headlineStats.length || stats.some((s, i) => s.value !== headlineStats[i]?.value || s.label !== headlineStats[i]?.label);

  const storyOverrides: NonNullable<ContentOverrides["stories"]> = {};
  for (const s of defaultStories) {
    const defaults = { eyebrow: s.eyebrow, title: s.title, summary: s.summary, lede: getStoryBody(s.slug)?.lede ?? "" };
    const o: NonNullable<ContentOverrides["stories"]>[string] = {};
    for (const field of STORY_FIELDS) {
      const value = str(fd, `story.${s.slug}.${field}`);
      if (value && value !== defaults[field]) o[field] = value;
    }
    if (fd.get(`story.${s.slug}.hidden`) === "on") o.hidden = true;
    if (Object.keys(o).length > 0) storyOverrides[s.slug] = o;
  }

  const next: ContentOverrides = {
    ...(Object.keys(profile).length > 0 && { profile }),
    ...(statsChanged && stats.length > 0 && { stats }),
    ...(Object.keys(storyOverrides).length > 0 && { stories: storyOverrides }),
    ...(current.resumeUrl && { resumeUrl: current.resumeUrl, resumeUpdatedAt: current.resumeUpdatedAt }),
  };

  const error = await persist(next);
  return error ? { error } : { ok: true, at: new Date().toISOString() };
}

const MAX_PDF_BYTES = 4 * 1024 * 1024;

export async function uploadResume(_prev: SaveState, fd: FormData): Promise<SaveState> {
  await requireAdmin();
  const file = fd.get("resume");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a PDF first." };
  if (file.size > MAX_PDF_BYTES) return { error: "That PDF is over 4 MB." };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const magic = new TextDecoder().decode(bytes.slice(0, 5));
  if (magic !== "%PDF-") return { error: "That file isn't a PDF." };

  const supabase = getServiceClient();
  if (!supabase) return { error: "Supabase isn't configured." };
  const path = `resume/Zuhaib_Ahmad_Khan_CV-${Date.now()}.pdf`;
  const { error: upErr } = await supabase.storage
    .from("portfolio")
    .upload(path, bytes, { contentType: "application/pdf", upsert: false, cacheControl: "31536000" });
  if (upErr) return { error: `Upload failed: ${upErr.message}. Has 0002_site_content.sql been applied?` };

  const { data } = supabase.storage.from("portfolio").getPublicUrl(path, { download: "Zuhaib_Ahmad_Khan_CV.pdf" });
  const current = await getOverrides();
  const error = await persist({ ...current, resumeUrl: data.publicUrl, resumeUpdatedAt: new Date().toISOString() });
  return error ? { error } : { ok: true, at: new Date().toISOString() };
}

export async function revertResume(_prev: SaveState, _fd: FormData): Promise<SaveState> {
  await requireAdmin();
  const current = await getOverrides();
  const rest: ContentOverrides = { ...current };
  delete rest.resumeUrl;
  delete rest.resumeUpdatedAt;
  const error = await persist(rest);
  return error ? { error } : { ok: true, at: new Date().toISOString() };
}
