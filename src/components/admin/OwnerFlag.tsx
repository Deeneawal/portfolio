"use client";

import { useEffect } from "react";
import { OWNER_FLAG } from "@/components/analytics/VercelInsights";

/** Marks this browser as the owner's so Vercel Analytics skips it too. */
export function OwnerFlag() {
  useEffect(() => {
    try {
      localStorage.setItem(OWNER_FLAG, "1");
    } catch {
      /* storage blocked */
    }
  }, []);
  return null;
}
