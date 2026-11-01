/** Shared flag so navigation code knows whether a story sheet is currently open. */
export function isSheetOpen(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.sheet === "open";
}

export function setSheetOpen(open: boolean): void {
  if (typeof document === "undefined") return;
  if (open) document.documentElement.dataset.sheet = "open";
  else delete document.documentElement.dataset.sheet;
}
