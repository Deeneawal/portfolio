"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { OPEN_PALETTE_EVENT } from "./PaletteButton";
import type { PaletteData } from "./CommandPalette";

const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false });

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/** Listens for ⌘K, Ctrl+K and "/" and only loads the palette code when it is first opened. */
export function PaletteHost({ data }: { data: PaletteData }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const show = () => {
      setLoaded(true);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setLoaded(true);
        setOpen((o) => !o);
      } else if (e.key === "/" && !isTyping(e.target) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, show);
    };
  }, []);

  if (!loaded) return null;
  return <CommandPalette open={open} onOpenChange={setOpen} data={data} />;
}
