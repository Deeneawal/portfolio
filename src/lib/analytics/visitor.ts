import { createHash, createHmac } from "node:crypto";
import { istDate } from "../time";

/**
 * Anonymous visitor id: sha256(daily salt ‖ ip ‖ user agent), truncated.
 * The salt is derived from a secret and the IST date, so the same person gets
 * a new id every day and visits cannot be linked across days without the secret.
 */
export function visitorHash(ip: string, userAgent: string, secret: string, at: Date = new Date()): string {
  const salt = createHmac("sha256", secret).update(istDate(at)).digest("hex");
  return createHash("sha256").update(`${salt}|${ip}|${userAgent}`).digest("hex").slice(0, 32);
}

export function hashIp(ip: string, secret: string): string {
  return createHmac("sha256", secret).update(`ip|${ip}`).digest("hex").slice(0, 32);
}
