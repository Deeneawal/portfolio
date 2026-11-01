import { describe, expect, it } from "vitest";
import { visitorHash } from "@/lib/analytics/visitor";
import { isBotUserAgent } from "@/lib/analytics/bot";
import { clientEventSchema, storySlugFromPath } from "@/lib/analytics/schema";
import { istDate } from "@/lib/time";

const SAFARI = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const sid = "6f1c2e1a-3b4d-4c5e-8f60-718293a4b5c6";

describe("istDate", () => {
  it("rolls over at IST midnight (18:30 UTC)", () => {
    expect(istDate(new Date("2026-10-30T18:29:59Z"))).toBe("2026-10-30");
    expect(istDate(new Date("2026-10-30T18:30:00Z"))).toBe("2026-10-31");
  });
});

describe("visitorHash", () => {
  it("is stable within an IST day and 32 hex chars", () => {
    const a = visitorHash("1.2.3.4", SAFARI, "secret", new Date("2026-10-30T05:00:00Z"));
    const b = visitorHash("1.2.3.4", SAFARI, "secret", new Date("2026-10-30T18:29:59Z"));
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{32}$/);
  });
  it("rotates across the IST midnight boundary", () => {
    const a = visitorHash("1.2.3.4", SAFARI, "secret", new Date("2026-10-30T18:29:59Z"));
    const b = visitorHash("1.2.3.4", SAFARI, "secret", new Date("2026-10-30T18:30:00Z"));
    expect(a).not.toBe(b);
  });
  it("depends on the secret, ip and user agent", () => {
    const at = new Date("2026-10-30T05:00:00Z");
    const base = visitorHash("1.2.3.4", SAFARI, "secret", at);
    expect(visitorHash("1.2.3.4", SAFARI, "other", at)).not.toBe(base);
    expect(visitorHash("1.2.3.5", SAFARI, "secret", at)).not.toBe(base);
    expect(visitorHash("1.2.3.4", SAFARI + "x", "secret", at)).not.toBe(base);
  });
});

describe("isBotUserAgent", () => {
  it.each([
    "WhatsApp/2.23.20.0",
    "LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)",
    "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0.0.0 Safari/537.36",
    "",
  ])("treats %s as a bot", (ua) => {
    expect(isBotUserAgent(ua)).toBe(true);
  });
  it("treats null as a bot and iOS Safari as human", () => {
    expect(isBotUserAgent(null)).toBe(true);
    expect(isBotUserAgent(SAFARI)).toBe(false);
  });
});

describe("clientEventSchema", () => {
  it("accepts a pageview of a known story", () => {
    expect(clientEventSchema.safeParse({ t: "pageview", p: "/story/surgycrm", sid }).success).toBe(true);
    expect(clientEventSchema.safeParse({ t: "pageview", p: "/", sid, ref: "linkedin.com", utm_source: "cv" }).success).toBe(true);
  });
  it("rejects unknown event types, paths and fields", () => {
    expect(clientEventSchema.safeParse({ t: "purchase", p: "/", sid }).success).toBe(false);
    expect(clientEventSchema.safeParse({ t: "pageview", p: "/story/not-a-story", sid }).success).toBe(false);
    expect(clientEventSchema.safeParse({ t: "pageview", p: "/admin", sid }).success).toBe(false);
    expect(clientEventSchema.safeParse({ t: "pageview", p: "/", sid, visitor_hash: "x" }).success).toBe(false);
    expect(clientEventSchema.safeParse({ t: "pageview", p: "/", sid: "not-a-uuid" }).success).toBe(false);
  });
  it("rejects oversize input and missing required fields", () => {
    expect(clientEventSchema.safeParse({ t: "pageview", p: "/", sid, ref: "x".repeat(201) }).success).toBe(false);
    expect(clientEventSchema.safeParse({ t: "contact_click", p: "/", sid }).success).toBe(false);
    expect(clientEventSchema.safeParse({ t: "engagement", p: "/", sid }).success).toBe(false);
    expect(clientEventSchema.safeParse({ t: "engagement", p: "/", sid, ms: 4_000_000 }).success).toBe(false);
  });
  it("maps paths to story slugs", () => {
    expect(storySlugFromPath("/")).toBeNull();
    expect(storySlugFromPath("/story/safeguards")).toBe("safeguards");
    expect(storySlugFromPath("/story/../admin")).toBeUndefined();
  });
});
