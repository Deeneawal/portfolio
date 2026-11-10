import Link from "next/link";
import { ArrowLeft, Check, Mail, MailWarning, Reply, Undo2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { contactConfigured } from "@/lib/contact/email";
import { listMessages, type StoredMessage } from "@/lib/contact/store";
import { DeleteMessageButton } from "@/components/admin/DeleteMessageButton";
import { OwnerFlag } from "@/components/admin/OwnerFlag";
import { markRead, removeMessage } from "./actions";

export const dynamic = "force-dynamic";

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const countryName = (code: string) => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
};

function replyHref(m: StoredMessage) {
  const subject = encodeURIComponent("Re: your message on my portfolio");
  const quoted = m.message
    .split("\n")
    .map((l) => `> ${l}`)
    .join("\n");
  const body = encodeURIComponent(`Hi ${m.name.split(" ")[0]},\n\n\n\n${quoted}`);
  return `mailto:${m.email}?subject=${subject}&body=${body}`;
}

function MessageCard({ m }: { m: StoredMessage }) {
  const where = [m.city, m.country ? countryName(m.country) : null].filter(Boolean).join(", ");
  return (
    <li className={`rounded-[22px] bg-white p-5 shadow-sm ring-1 sm:p-6 ${m.read ? "ring-black/[0.05]" : "ring-2 ring-accent/40"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2">
            <span className="text-[17px] font-semibold text-ink">{m.name}</span>
            {!m.read && <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">New</span>}
          </p>
          <p className="mt-0.5 break-all text-[14.5px] text-ink-2">
            <a href={`mailto:${m.email}`} className="text-accent-ink hover:underline">
              {m.email}
            </a>
            {m.company && <span className="text-muted"> · {m.company}</span>}
          </p>
        </div>
        <p className="text-right text-[13px] text-muted">
          <span className="block tabular-nums">{fmtTime(m.created_at)} IST</span>
          {where && <span className="block">{where}</span>}
        </p>
      </div>

      <p className="mt-4 whitespace-pre-wrap break-words rounded-2xl bg-[#f5f5f7] px-4 py-3.5 text-[15.5px] leading-relaxed text-ink">{m.message}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
          {m.email_sent ? (
            <span className="inline-flex items-center gap-1.5 text-[#1d6b40]">
              <Mail aria-hidden className="size-4" /> Also emailed to you
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[#9a5b00]">
              <MailWarning aria-hidden className="size-4" /> Not emailed, saved here only
            </span>
          )}
          {m.page && <span>Sent from {m.page}</span>}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <a href={replyHref(m)} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-3.5 text-[13.5px] font-medium text-white">
            <Reply aria-hidden className="size-4" /> Reply
          </a>
          <form action={markRead}>
            <input type="hidden" name="id" value={m.id} />
            <input type="hidden" name="read" value={m.read ? "0" : "1"} />
            <button type="submit" className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13.5px] font-medium text-ink ring-1 ring-black/10 transition hover:bg-[#f5f5f7]">
              {m.read ? (
                <>
                  <Undo2 aria-hidden className="size-4" /> Mark unread
                </>
              ) : (
                <>
                  <Check aria-hidden className="size-4" /> Mark read
                </>
              )}
            </button>
          </form>
          <form action={removeMessage}>
            <input type="hidden" name="id" value={m.id} />
            <DeleteMessageButton from={m.name} />
          </form>
        </div>
      </div>
    </li>
  );
}

export default async function MessagesPage() {
  await requireAdmin();
  const data = await listMessages();
  const unread = data.messages.filter((m) => !m.read).length;
  const emailOn = contactConfigured();

  return (
    <main id="main" className="mx-auto max-w-[900px] px-4 pb-20 pt-6 sm:px-6">
      <OwnerFlag />
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-muted">Private · visible only to you</p>
          <h1 className="display mt-1 text-4xl">Messages</h1>
          <p className="mt-1 text-[15px] text-muted">
            {data.messages.length === 0 ? "No messages yet." : `${data.messages.length} from the contact form${unread ? ` · ${unread} new` : ""}`}
          </p>
        </div>
        <Link href="/admin" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-medium shadow-sm ring-1 ring-black/[0.06]">
          <ArrowLeft aria-hidden className="size-4" /> Dashboard
        </Link>
      </header>

      {!data.configured && (
        <p className="mt-8 rounded-2xl bg-[#fff3ea] p-5 text-[15px] text-ink-2">
          Message storage isn&apos;t configured. Set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>.
        </p>
      )}
      {data.error && <p className="mt-6 rounded-2xl bg-[#ffe9e9] p-4 text-[14px] text-ink-2">Couldn&apos;t load every message: {data.error}.</p>}
      {data.configured && data.storageOnly && (
        <p className="mt-6 rounded-2xl bg-[#e8f2ff] p-4 text-[14px] text-ink-2">
          Messages are being kept in private file storage. Run <code>supabase/migrations/0003_contact_messages.sql</code> in the Supabase SQL editor to move new ones to a table; nothing is lost
          either way.
        </p>
      )}
      {data.configured && !emailOn && (
        <p className="mt-3 rounded-2xl bg-[#fff8e6] p-4 text-[14px] text-ink-2">
          Email alerts are off, so new messages appear only on this page. Add <code>RESEND_API_KEY</code> in Vercel to also receive them by email.
        </p>
      )}

      {data.messages.length > 0 && (
        <ul className="mt-8 grid gap-4">
          {data.messages.map((m) => (
            <MessageCard key={m.id} m={m} />
          ))}
        </ul>
      )}
    </main>
  );
}
