"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, ADMIN_TTL_SECONDS, OWNER_COOKIE, OWNER_TTL_SECONDS } from "@/lib/auth/cookies";
import { signToken } from "@/lib/auth/session";
import { passwordMatches } from "@/lib/auth/password";
import { requireAdmin } from "@/lib/auth/admin";
import { hashIp } from "@/lib/analytics/visitor";
import { getServiceClient } from "@/lib/supabase";

export interface LoginState {
  error?: string;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const secure = process.env.NODE_ENV === "production";

async function underAttemptLimit(): Promise<boolean> {
  const supabase = getServiceClient();
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!supabase || !secret) return true;
  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const { data, error } = await supabase.rpc("login_gate", { p_ip_hash: hashIp(ip, secret) });
  if (error) return true; // never lock the owner out because analytics storage is down
  return data === true;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!expected || !secret) return { error: "The dashboard isn't configured yet. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET." };

  if (!(await underAttemptLimit())) {
    await delay(600);
    return { error: "Too many attempts. Try again in 15 minutes." };
  }
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password, expected)) {
    await delay(600);
    return { error: "That password isn't right." };
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, await signToken("admin", ADMIN_TTL_SECONDS, secret), {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_TTL_SECONDS,
  });
  // Long-lived marker so the owner's own visits are never counted, even after the session expires.
  jar.set(OWNER_COOKIE, await signToken("owner", OWNER_TTL_SECONDS, secret), {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: OWNER_TTL_SECONDS,
  });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await requireAdmin();
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
