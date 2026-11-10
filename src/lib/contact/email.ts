import "server-only";
import { profile } from "@/content/profile";
import type { ContactInput } from "./schema";

const RESEND_URL = "https://api.resend.com/emails";

/** Where messages go. Defaults to the address shown on the site. */
export function contactRecipient(): string {
  return process.env.CONTACT_TO?.trim() || profile.email;
}

/** The form can send only once a mail key is set. Without it, the form points people to direct email. */
export function contactConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
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

/** Sends the message through Resend. The visitor's address is the reply-to, so one reply reaches them. */
export async function sendContactEmail(input: Message, meta: { page?: string | null } = {}): Promise<{ ok: true } | { ok: false; detail: string }> {
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
