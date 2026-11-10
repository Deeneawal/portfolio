import { describe, expect, it } from "vitest";
import { stories, storySlugs, groups } from "@/content";
import { allStoryBodies, getStoryBody } from "@/content/stories";
import { diagramIds } from "@/components/diagrams";
import { overridesSchema } from "@/lib/content/schema";

describe("content integrity", () => {
  it("has unique slugs, each with a body", () => {
    expect(new Set(storySlugs).size).toBe(storySlugs.length);
    for (const slug of storySlugs) expect(getStoryBody(slug), slug).toBeDefined();
    expect(allStoryBodies.length).toBe(stories.length);
  });
  it("only references registered diagrams and existing related stories", () => {
    for (const body of allStoryBodies) {
      for (const block of body.blocks) {
        if (block.type === "diagram") expect(diagramIds, `${body.slug} → ${block.id}`).toContain(block.id);
      }
      for (const r of body.related ?? []) expect(storySlugs, `${body.slug} related ${r}`).toContain(r);
    }
  });
  it("puts every story in a known group", () => {
    const ids = groups.map((g) => g.id);
    for (const s of stories) expect(ids).toContain(s.group);
  });
  it("never names client hospitals", () => {
    const text = JSON.stringify({ stories, allStoryBodies }).toLowerCase();
    for (const banned of [/motherland/, /mediversal/, /\bobs\b/, /apollo/, /al salam/, /dcdc/, /bhagat/]) {
      expect(text, String(banned)).not.toMatch(banned);
    }
  });
});

describe("overrides schema", () => {
  it("accepts a partial edit", () => {
    const r = overridesSchema.safeParse({ profile: { headline: "Hi", openToWork: false }, stories: { surgycrm: { hidden: true } } });
    expect(r.success).toBe(true);
  });
  it("rejects unknown keys and bad urls", () => {
    expect(overridesSchema.safeParse({ profile: { evil: "x" } }).success).toBe(false);
    expect(overridesSchema.safeParse({ profile: { linkedin: "javascript:alert(1)" } }).success).toBe(false);
    expect(overridesSchema.safeParse({ profile: { github: "data:text/html,hi" } }).success).toBe(false);
    expect(overridesSchema.safeParse({ resumeUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(overridesSchema.safeParse({ stats: Array(5).fill({ value: "1", label: "x" }) }).success).toBe(false);
  });
});

describe("company products stay abstract", () => {
  // Company and client product stories may describe capabilities, role and outcomes only.
  // Lab projects, the toolkit and this site are Zuhaib's own and are exempt.
  const companySlugs = ["surgycrm", "surgy-assist", "automation", "performance", "surgyfield", "platform-kit", "surgy-suite", "samatvalife", "ai-gateway", "privacy-controls"];
  const banned = [
    /supabase/i, /\bdeno\b/i, /pg_cron/i, /terraform/i, /\bec2\b/i, /\buae\b/i, /\bgcc\b/i, /\bindia\b/i,
    /meta lead/i, /conversions api/i, /whatsapp/i, /gemini/i, /\bhmac\b/i, /advisory/i,
    /bullmq/i, /razorpay/i, /typeorm/i, /firebase/i, /prometheus/i, /\bloki\b/i, /\bfhir\b/i, /\bkms\b/i, /\boidc\b/i,
    /0\.72/, /0\.55/, /\b35k\b/i, /\b50k\b/i, /block-risky/i, /claude\.md/i, /agents\.md/i,
    /current_tenant_id/i, /security definer/i, /\brls\b/i, /row-level security/i, /src\/pages/i, /\b351\b/,
  ];

  it("company and process stories, tiles and diagrams contain no implementation internals", async () => {
    const { readFileSync } = await import("node:fs");
    const { workStories } = await import("@/content/stories/work");
    const { processStories } = await import("@/content/stories/process");
    const diagrams = readFileSync("src/components/diagrams/index.tsx", "utf8").replace(/function IotPipeline[\s\S]*?\n}\n/, "");
    const texts: [string, string][] = [
      ...workStories.filter((s) => companySlugs.includes(s.slug)).map((s) => [s.slug, JSON.stringify(s)] as [string, string]),
      ...processStories.map((s) => [s.slug, JSON.stringify(s)] as [string, string]),
      ...stories.filter((s) => companySlugs.includes(s.slug) || s.group === "process").map((s) => [`tile:${s.slug}`, JSON.stringify(s)] as [string, string]),
      ["diagrams", diagrams],
    ];
    for (const [where, text] of texts) {
      for (const re of banned) expect(text, `${where} mentions ${re}`).not.toMatch(re);
    }
  });
});
