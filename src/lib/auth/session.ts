/**
 * Signed, expiring tokens for the owner's cookies, built on Web Crypto so the
 * same code runs in Edge middleware and in Node route handlers.
 * Format: v1.<kind>.<expiresAtSeconds>.<base64url HMAC-SHA256>
 */
export type TokenKind = "admin" | "owner";

const encoder = new TextEncoder();

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const b of new Uint8Array(bytes)) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4));
    const out = new Uint8Array(new ArrayBuffer(binary.length));
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signToken(kind: TokenKind, ttlSeconds: number, secret: string, now = Date.now()): Promise<string> {
  const exp = Math.floor(now / 1000) + ttlSeconds;
  const body = `v1.${kind}.${exp}`;
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(body));
  return `${body}.${toBase64Url(sig)}`;
}

/** Returns true only for a well-formed, unexpired token of the given kind signed with this secret. Never throws. */
export async function verifyToken(token: string | undefined | null, kind: TokenKind, secret: string | undefined, now = Date.now()): Promise<boolean> {
  try {
    if (!token || !secret || token.length > 256) return false;
    const parts = token.split(".");
    if (parts.length !== 4) return false;
    const [version, tokenKind, expRaw, sigRaw] = parts as [string, string, string, string];
    if (version !== "v1" || tokenKind !== kind || !/^\d{1,12}$/.test(expRaw)) return false;
    if (Number(expRaw) * 1000 <= now) return false;
    const sig = fromBase64Url(sigRaw);
    if (!sig) return false;
    return await crypto.subtle.verify("HMAC", await hmacKey(secret), sig, encoder.encode(`${version}.${tokenKind}.${expRaw}`));
  } catch {
    return false;
  }
}
