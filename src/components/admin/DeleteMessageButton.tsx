"use client";

import { Trash2 } from "lucide-react";

/** Submits the surrounding form only after the owner confirms, because a deleted message can't be brought back. */
export function DeleteMessageButton({ from }: { from: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(`Delete the message from ${from}? This can't be undone.`)) e.preventDefault();
      }}
      className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13.5px] font-medium text-[#b3261e] ring-1 ring-[#b3261e]/25 transition hover:bg-[#fff1f0]"
    >
      <Trash2 aria-hidden className="size-4" /> Delete
    </button>
  );
}
