"use client";

import { LazyMotion, MotionConfig, domMax } from "motion/react";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 380, damping: 38, mass: 0.9 }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
