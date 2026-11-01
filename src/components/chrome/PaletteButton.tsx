"use client";

import type { ReactNode } from "react";

export const OPEN_PALETTE_EVENT = "zk:open-palette";

export function openPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}

export function PaletteButton({ className, children, label = "Search" }: { className?: string; children: ReactNode; label?: string }) {
  return (
    <button type="button" onClick={openPalette} className={className} aria-label={label} aria-keyshortcuts="Meta+K Control+K">
      {children}
    </button>
  );
}
