import { z } from "zod";

const line = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    // Header fields must stay on one line.
    .refine((v) => !/[\r\n]/.test(v), { message: "Remove line breaks" });

/** What the contact form posts to /api/contact. */
export const contactSchema = z.object({
  name: line(80).min(2, "Please enter your name"),
  email: z.email("Please enter a valid email address").max(200),
  company: line(120).optional().default(""),
  message: z.string().trim().min(10, "Please write a few more words").max(3000, "Please keep it under 3,000 characters"),
  /** Honeypot: people never see this field, so anything in it means a bot. */
  website: z.string().max(200).optional().default(""),
  /** Milliseconds between the form appearing and being sent. */
  elapsedMs: z.number().int().min(0).max(86_400_000).optional().default(0),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Bots fill hidden fields and submit instantly. */
export function looksAutomated(input: Pick<ContactInput, "website" | "elapsedMs">): boolean {
  return input.website.trim().length > 0 || input.elapsedMs < 1500;
}

export type ContactField = "name" | "email" | "company" | "message";

/** First problem per field, in words a visitor can act on. */
export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if ((key === "name" || key === "email" || key === "company" || key === "message") && !out[key]) out[key] = issue.message;
  }
  return out;
}
