import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

/** Constant-time comparison; hashing first makes both buffers the same length. */
export function passwordMatches(input: string, expected: string | undefined): boolean {
  if (!expected) return false;
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}
