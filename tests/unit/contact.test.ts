import { describe, expect, it } from "vitest";
import { buildContactEmail } from "@/lib/contact/email";
import { contactSchema, fieldErrors, looksAutomated } from "@/lib/contact/schema";
import { MESSAGE_ID, newMessageId } from "@/lib/contact/store";

const good = { name: "Asha Rao", email: "asha@example.com", message: "Hello, I'd like to talk about a role.", elapsedMs: 5000 };

describe("contact form input", () => {
  it("accepts a normal message and fills the optional fields", () => {
    const r = contactSchema.safeParse(good);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toMatchObject({ company: "", website: "" });
  });
  it("explains what is wrong, one message per field", () => {
    const r = contactSchema.safeParse({ name: "A", email: "nope", message: "short" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errors = fieldErrors(r.error);
      expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"]);
    }
  });
  it("rejects line breaks in fields that end up in email headers", () => {
    expect(contactSchema.safeParse({ ...good, name: "Asha\nBcc: someone@example.com" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...good, email: "asha@example.com\nbcc:x@y.z" }).success).toBe(false);
  });
  it("rejects messages that are too long", () => {
    expect(contactSchema.safeParse({ ...good, message: "x".repeat(3001) }).success).toBe(false);
  });
  it("flags a filled honeypot or an instant submission as automated", () => {
    expect(looksAutomated({ website: "http://spam.example", elapsedMs: 9000 })).toBe(true);
    expect(looksAutomated({ website: "", elapsedMs: 200 })).toBe(true);
    expect(looksAutomated({ website: "", elapsedMs: 4000 })).toBe(false);
  });
});

describe("contact email", () => {
  it("puts the sender in the subject and the message in the body", () => {
    const mail = buildContactEmail({ ...good, company: "Nordavo" }, { page: "/story/contact" });
    expect(mail.subject).toBe("Portfolio message from Asha Rao (Nordavo)");
    expect(mail.text).toContain("From: Asha Rao <asha@example.com>");
    expect(mail.text).toContain("Hello, I'd like to talk about a role.");
    expect(mail.text).toContain("Sent from: /story/contact");
  });
  it("escapes HTML in everything the visitor typed", () => {
    const mail = buildContactEmail({ name: "<b>Eve</b>", email: "eve@example.com", company: "", message: '<script>alert("x")</script>' });
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).not.toContain("<b>Eve</b>");
    expect(mail.html).toContain("&lt;script&gt;");
  });
});

describe("stored message ids", () => {
  it("match the pattern the table and the admin actions accept", () => {
    expect(newMessageId()).toMatch(MESSAGE_ID);
    expect(MESSAGE_ID.test("../../etc/passwd")).toBe(false);
    expect(MESSAGE_ID.test("1762780000000-abcdef12.json")).toBe(false);
  });
  it("sort newest last as plain text, so listings can order by id", () => {
    const older = newMessageId(1_762_780_000_000);
    const newer = newMessageId(1_762_780_000_001);
    expect(older < newer).toBe(true);
  });
});
