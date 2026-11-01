import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);
/** http(s) only: a javascript: or data: URL here would end up in an href. */
const httpUrl = (max: number) => z.url({ protocol: /^https?$/ }).max(max);
const url = z.union([z.literal(""), httpUrl(300)]);

export const editableProfileSchema = z
  .object({
    title: text(80),
    role: text(120),
    location: text(80),
    availability: text(240),
    headline: text(240),
    intro: text(900),
    email: z.union([z.literal(""), z.email().max(120)]),
    phone: text(30),
    linkedin: url,
    github: url,
    leetcode: url,
    openToWork: z.boolean(),
  })
  .partial()
  .strict();

export const storyOverrideSchema = z
  .object({
    eyebrow: text(60),
    title: text(120),
    summary: text(300),
    lede: text(1200),
    hidden: z.boolean(),
  })
  .partial()
  .strict();

export const overridesSchema = z
  .object({
    profile: editableProfileSchema.optional(),
    stats: z.array(z.object({ value: text(12).min(1), label: text(40).min(1) }).strict()).max(4).optional(),
    stories: z.record(z.string().regex(/^[a-z0-9-]{1,80}$/), storyOverrideSchema).optional(),
    resumeUrl: httpUrl(500).optional(),
    resumeUpdatedAt: z.string().max(40).optional(),
  })
  .strict();

export type ContentOverrides = z.infer<typeof overridesSchema>;
export type EditableProfile = z.infer<typeof editableProfileSchema>;
