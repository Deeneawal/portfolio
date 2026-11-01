import { NextResponse, type NextRequest } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Daily Vercel Cron ping so the free Supabase project is never paused for inactivity. */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const supabase = getServiceClient();
  if (!supabase) return NextResponse.json({ ok: true, configured: false });
  const { error } = await supabase.rpc("analytics_ping");
  return NextResponse.json({ ok: !error }, { status: error ? 502 : 200 });
}
