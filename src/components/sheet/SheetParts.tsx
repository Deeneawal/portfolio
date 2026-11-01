"use client";

import { Title } from "@radix-ui/react-dialog";
import * as m from "motion/react-m";
import type { ReactNode } from "react";

/** Title inside the sheet: shares a layoutId with the card title and labels the dialog. */
export function SheetTitle({ slug, className, children }: { slug: string; className?: string; children: ReactNode }) {
  return (
    <Title asChild>
      <m.h1 layoutId={`title-${slug}`} className={className}>
        {children}
      </m.h1>
    </Title>
  );
}

/** Fades the body in after the surface has started expanding. */
export function SheetBody({ children }: { children: ReactNode }) {
  return (
    <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.12, duration: 0.35 } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
      {children}
    </m.div>
  );
}
