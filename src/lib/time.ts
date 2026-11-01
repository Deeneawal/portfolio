const IST_OFFSET_MS = 330 * 60 * 1000;

/** Calendar date (YYYY-MM-DD) in India Standard Time, the owner's timezone for daily buckets. */
export function istDate(at: Date = new Date()): string {
  return new Date(at.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}
