import { describe, expect, it } from "vitest";
import { signToken, verifyToken } from "@/lib/auth/session";

const SECRET = "a".repeat(64);
const NOW = Date.UTC(2026, 9, 30, 12, 0, 0);

describe("signed session tokens", () => {
  it("verifies a fresh token of the right kind", async () => {
    const t = await signToken("admin", 3600, SECRET, NOW);
    expect(await verifyToken(t, "admin", SECRET, NOW)).toBe(true);
  });
  it("rejects the wrong kind, wrong secret and expiry", async () => {
    const t = await signToken("admin", 3600, SECRET, NOW);
    expect(await verifyToken(t, "owner", SECRET, NOW)).toBe(false);
    expect(await verifyToken(t, "admin", "b".repeat(64), NOW)).toBe(false);
    expect(await verifyToken(t, "admin", SECRET, NOW + 3601_000)).toBe(false);
    expect(await verifyToken(t, "admin", undefined, NOW)).toBe(false);
  });
  it("rejects tampering without throwing", async () => {
    const t = await signToken("admin", 3600, SECRET, NOW);
    const [v, k, exp, sig] = t.split(".");
    const later = `${v}.${k}.${Number(exp) + 999999}.${sig}`;
    const flipped = `${v}.${k}.${exp}.${sig!.slice(0, -2)}${sig!.endsWith("AA") ? "BB" : "AA"}`;
    for (const bad of [later, flipped, "", "v1.admin", "v1.admin.x.y", "v2.admin.1.abc", "not a token", `${t}.extra`, "v1.admin.99999999999.!!!"]) {
      expect(await verifyToken(bad, "admin", SECRET, NOW)).toBe(false);
    }
  });
});
