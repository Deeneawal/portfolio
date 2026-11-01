export const ADMIN_TTL_SECONDS = 7 * 24 * 60 * 60;
export const OWNER_TTL_SECONDS = 365 * 24 * 60 * 60;

const isProd = process.env.NODE_ENV === "production";

/** __Host- prefix requires Secure + Path=/ and no Domain; unavailable on plain-http localhost. */
export const ADMIN_COOKIE = isProd ? "__Host-zk_admin" : "zk_admin";
export const OWNER_COOKIE = isProd ? "__Host-zk_owner" : "zk_owner";
