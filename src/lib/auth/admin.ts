import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "./cookies";
import { verifyToken } from "./session";

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(ADMIN_COOKIE)?.value, "admin", process.env.ADMIN_SESSION_SECRET);
}

/** Defence in depth: middleware is not the security boundary, so every admin page and action calls this. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
