import "server-only";
import { profile, SITE_URL } from "@/content/profile";
import type { ContactInput } from "./schema";

const RESEND_URL = "https://api.resend.com/emails";

/** Where messages go. Defaults to the address shown on the site. */
export function contactRecipient(): string {
  return process.env.CONTACT_TO?.trim() || profile.email;
}

export type MailRoute = "resend" | "forward" | "none";

/**
 * How a message is emailed.
 * - "resend": a RESEND_API_KEY is set, so mail goes through Resend.
 * - "forward": no key, so the live site hands the message to FormSubmit, which forwards it to the
 *   recipient. It needs no account, only one "Activate Form" click in the recipient's inbox.
 *   It runs in production only (or when CONTACT_FORWARD=formsubmit), so tests and local runs send nothing.
 * - "none": nothing is emailed; messages are only kept for the dashboard.
 */
export function mailRoute(env: Record<string, string | undefined> = process.env): MailRoute {
  if (env.RESEND_API_KEY?.trim()) return "resend";
  const forward = env.CONTACT_FORWARD?.trim().toLowerCase();
  if (forward === "off") return "none";
  if (forward === "formsubmit" || env.VERCEL_ENV === "production") return "forward";
  return "none";
}

export function contactConfigured(): boolean {
  return mailRoute() !== "none";
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

type Message = Pick<ContactInput, "name" | "email" | "company" | "message">;

export function buildContactEmail(input: Message, meta: { page?: string | null } = {}) {
  const from = input.company ? `${input.name} (${input.company})` : input.name;
  const subject = `Portfolio message from ${from}`.slice(0, 160);
  const text = [
    `From: ${input.name} <${input.email}>`,
    input.company ? `Company: ${input.company}` : null,
    meta.page ? `Sent from: ${meta.page}` : null,
    "",
    input.message,
    "",
    "Reply to this email to answer them directly.",
  ]
    .filter((l) => l !== null)
    .join("\n");
  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1d1d1f">
<p style="margin:0 0 4px"><strong>${escapeHtml(input.name)}</strong> &lt;<a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a>&gt;</p>
${input.company ? `<p style="margin:0 0 4px;color:#6e6e73">${escapeHtml(input.company)}</p>` : ""}
${meta.page ? `<p style="margin:0 0 4px;color:#6e6e73">Sent from ${escapeHtml(meta.page)}</p>` : ""}
<hr style="border:none;border-top:1px solid #e5e5ea;margin:14px 0" />
<p style="margin:0;white-space:pre-wrap">${escapeHtml(input.message)}</p>
<hr style="border:none;border-top:1px solid #e5e5ea;margin:14px 0" />
<p style="margin:0;color:#6e6e73;font-size:13px">Reply to this email to answer them directly.</p>
</div>`;
  return { subject, text, html };
}

type SendResult = { ok: true } | { ok: false; detail: string };

/** Emails the message by whichever route is set up. The visitor's address is the reply-to, so one reply reaches them. */
export async function sendContactEmail(input: Message, meta: { page?: string | null } = {}): Promise<SendResult> {
  const route = mailRoute();
  if (route === "resend") return sendViaResend(input, meta);
  if (route === "forward") return sendViaForwarder(input, meta);
  return { ok: false, detail: "not_configured" };
}

/** FormSubmit forwards the fields to the recipient. Until the recipient clicks its activation link, it answers "needs Activation". */
async function sendViaForwarder(input: Message, meta: { page?: string | null }): Promise<SendResult> {
  const { subject } = buildContactEmail(input, meta);
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(contactRecipient())}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Origin: SITE_URL, Referer: `${SITE_URL}/story/contact` },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        ...(input.company ? { company: input.company } : {}),
        message: input.message,
        ...(meta.page ? { "sent from": meta.page } : {}),
        _subject: subject,
        _replyto: input.email,
        _template: "table",
        _captcha: "false",
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const body = (await res.json().catch(() => null)) as { success?: string | boolean; message?: string } | null;
    if (res.ok && (body?.success === true || body?.success === "true")) return { ok: true };
    if (/activation/i.test(body?.message ?? "")) return { ok: false, detail: "needs_activation" };
    return { ok: false, detail: `forwarder answered ${res.status}` };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.name : "error" };
  }
}

async function sendViaResend(input: Message, meta: { page?: string | null }): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { ok: false, detail: "not_configured" };
  const { subject, text, html } = buildContactEmail(input, meta);
  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM?.trim() || "Portfolio contact <onboarding@resend.dev>",
        to: [contactRecipient()],
        reply_to: input.email,
        subject,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) return { ok: true };
    return { ok: false, detail: `mail service answered ${res.status}` };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.name : "error" };
  }
}
