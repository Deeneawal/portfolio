import { isbot } from "isbot";

/** A missing user agent is treated as a bot; isbot("") alone returns false. */
export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua || ua.trim().length < 8) return true;
  return isbot(ua);
}
