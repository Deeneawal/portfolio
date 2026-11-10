"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { track } from "@/lib/analytics/client";
import { cn } from "@/lib/cn";

type Field = "name" | "email" | "company" | "message";
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string; showEmail: boolean };

const inputClass =
  "mt-1.5 w-full rounded-2xl bg-[#f5f5f7] px-4 py-3 text-[16px] text-ink outline-none ring-1 ring-transparent transition placeholder:text-faint focus:bg-white focus:ring-2 focus:ring-accent aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#d70015]";

function validate(values: Record<Field, string>): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Please enter a valid email address";
  if (values.message.trim().length < 10) errors.message = "Please write a few more words";
  return errors;
}

export function ContactForm({ email }: { email: string }) {
  const id = useId();
  const startedAt = useRef<number>(Date.now());
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const values: Record<Field, string> = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    const found = validate(values);
    setErrors(found);
    const firstBad = (Object.keys(found) as Field[])[0];
    if (firstBad) {
      (form.elements.namedItem(firstBad) as HTMLElement | null)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: String(data.get("website") ?? ""), elapsedMs: Date.now() - startedAt.current }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Partial<Record<Field, string>> };
      if (res.ok && body.ok) {
        setStatus({ kind: "sent" });
        track({ type: "contact_click", target: "form" });
        return;
      }
      if (body.fields && Object.keys(body.fields).length > 0) {
        setErrors(body.fields);
        setStatus({ kind: "idle" });
        return;
      }
      setStatus({
        kind: "error",
        message: body.error === "rate_limited" ? "That's a lot of messages in a short time. Please try again later, or email me directly:" : "Your message could not be sent from here. Please email me directly:",
        showEmail: true,
      });
    } catch {
      setStatus({ kind: "error", message: "You seem to be offline, so the message wasn't sent. Try again, or email me directly:", showEmail: true });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-[24px] bg-[#e9f8f1] px-6 py-8 sm:px-8">
        <CheckCircle2 aria-hidden className="size-8 text-[#1d6b40]" />
        <p className="display mt-3 text-[1.5rem] text-ink">Message sent. Thank you.</p>
        <p className="mt-2 max-w-xl text-[16px] leading-relaxed text-ink-2">I have it now, and I reply to the address you gave, usually within a day or two.</p>
        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus({ kind: "idle" });
          }}
          className="mt-4 text-[15px] font-medium text-accent-ink hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const label = "block text-[14px] font-medium text-ink";
  const fieldError = (field: Field) =>
    errors[field] ? (
      <p id={`${id}-${field}-error`} className="mt-1.5 text-[13.5px] text-[#d70015]">
        {errors[field]}
      </p>
    ) : null;
  const described = (field: Field) => (errors[field] ? `${id}-${field}-error` : undefined);

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Send me a message" className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/[0.07] sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={label}>
            Your name
          </label>
          <input id={`${id}-name`} name="name" type="text" autoComplete="name" maxLength={80} required aria-invalid={Boolean(errors.name)} aria-describedby={described("name")} className={inputClass} />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>
            Your email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={200}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={described("email")}
            className={inputClass}
          />
          {fieldError("email")}
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor={`${id}-company`} className={label}>
          Company or role <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id={`${id}-company`} name="company" type="text" autoComplete="organization" maxLength={120} className={inputClass} />
      </div>
      <div className="mt-4">
        <label htmlFor={`${id}-message`} className={label}>
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          maxLength={3000}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={described("message")}
          className={cn(inputClass, "min-h-[140px] resize-y leading-relaxed")}
        />
        {fieldError("message")}
      </div>

      {/* Honeypot: hidden from people and from assistive technology. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[16px] font-semibold text-white transition hover:bg-[#0077ed] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          <Send aria-hidden className="size-[18px]" /> {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="text-[13px] text-muted">Sent to me only. I keep it privately so I can reply.</p>
      </div>

      <div aria-live="polite">
        {status.kind === "error" && (
          <p className="mt-4 rounded-2xl bg-[#fff1f0] px-4 py-3 text-[14.5px] leading-relaxed text-[#8a1c13]">
            {status.message}{" "}
            {status.showEmail && (
              <a href={`mailto:${email}`} data-track="contact_click" data-target="email" className="font-semibold underline">
                {email}
              </a>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
