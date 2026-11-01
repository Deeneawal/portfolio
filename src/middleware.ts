import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth/cookies";
import { verifyToken } from "@/lib/auth/session";

/** First gate for the owner dashboard. Pages and actions re-check with requireAdmin(). */
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();
  const ok = await verifyToken(req.cookies.get(ADMIN_COOKIE)?.value, "admin", process.env.ADMIN_SESSION_SECRET);
  if (ok) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*"] };
