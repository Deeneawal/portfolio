"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, animate, useMotionValue, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { setSheetOpen } from "@/lib/sheet-state";

const PULL_TO_CLOSE = 110;

/**
 * Full-screen story sheet opened from a bento card (intercepted route).
 * The surface shares a layoutId with the card, so it grows out of the tile like the App Store "Today" tab.
 * Closing animates first and only then navigates back, so the exit is never cut short.
 */
export function StorySheet({ slug, children }: { slug: string; children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pull = useMotionValue(0);
  const pullScale = useTransform(pull, [0, 300], [1, 0.94]);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    setSheetOpen(true);
    return () => setSheetOpen(false);
  }, []);

  const close = () => setOpen(false);

  // Pull down from the top of the sheet to dismiss (touch devices).
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = (scrollRef.current?.scrollTop ?? 0) <= 0 ? (e.touches[0]?.clientY ?? null) : null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const dy = (e.touches[0]?.clientY ?? 0) - touchStart.current;
    pull.set(dy > 0 ? dy * 0.6 : 0);
  };
  const onTouchEnd = () => {
    if (touchStart.current === null) return;
    touchStart.current = null;
    if (pull.get() > PULL_TO_CLOSE) close();
    else animate(pull, 0, { type: "spring", stiffness: 500, damping: 40 });
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && close()}>
      <AnimatePresence
        onExitComplete={() => {
          document.querySelector<HTMLElement>(`[data-tile="${slug}"]`)?.focus({ preventScroll: true });
          router.back();
        }}
      >
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[6px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              forceMount
              aria-describedby={undefined}
              onOpenAutoFocus={(e) => {
                e.preventDefault();
                scrollRef.current?.focus({ preventScroll: true });
              }}
              onCloseAutoFocus={(e) => {
                // Return focus to the card this story was opened from (Radix can't see it across the route change).
                e.preventDefault();
                document.querySelector<HTMLElement>(`[data-tile="${slug}"]`)?.focus({ preventScroll: true });
              }}
            >
              <m.div
                ref={scrollRef}
                tabIndex={-1}
                layoutScroll
                data-story-sheet={slug}
                className="fixed inset-0 z-50 overflow-y-auto overscroll-contain outline-none"
                data-sheet-backdrop=""
                onClick={(e) => {
                  if ((e.target as HTMLElement).dataset.sheetBackdrop !== undefined) close();
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <Dialog.Close asChild>
                  <m.button
                    type="button"
                    aria-label="Close story"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.15 } }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    className="fixed right-4 top-5 z-[60] grid size-10 place-items-center rounded-full bg-black/55 text-white backdrop-blur-md transition-colors hover:bg-black/75 sm:right-[max(1.5rem,calc((100vw-1040px)/2+2.5rem))] sm:top-16"
                  >
                    <X aria-hidden className="size-5" />
                  </m.button>
                </Dialog.Close>
                <m.div data-sheet-backdrop="" style={{ y: pull, scale: pullScale }} className="mx-auto w-full max-w-[1040px] pt-3 sm:px-6 sm:pb-16 sm:pt-12">
                  <m.article
                    layoutId={`surface-${slug}`}
                    style={{ borderRadius: 28 }}
                    className="relative min-h-[calc(100dvh-12px)] overflow-clip bg-white shadow-[0_30px_100px_rgb(0_0_0/0.25)] sm:min-h-0"
                  >
                    {children}
                  </m.article>
                </m.div>
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
