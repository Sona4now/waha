/**
 * Season utilities for destination cards / lists.
 *
 * Every destination in `siteData.ts` has `bestMonths` (1-12) — the months
 * we recommend visiting. This helper checks whether the current month is
 * one of them so the UI can flag "مثالي دلوقتي" / "في موسمها".
 *
 * Server-safe (no window/Date locale assumptions beyond getMonth()).
 */

export function getCurrentMonth(): number {
  return new Date().getMonth() + 1;
}

export function isInSeasonNow(bestMonths?: number[]): boolean {
  if (!bestMonths || bestMonths.length === 0) return false;
  return bestMonths.includes(getCurrentMonth());
}

/**
 * Soft "ok" check — returns true for `bestMonths` OR `okMonths`. Used when
 * we want to surface destinations that are "decent" right now even if not
 * peak.
 */
export function isOkSeasonNow(
  bestMonths?: number[],
  okMonths?: number[],
): boolean {
  const m = getCurrentMonth();
  return (
    (bestMonths?.includes(m) ?? false) || (okMonths?.includes(m) ?? false)
  );
}

/**
 * Human-readable label for the destination's status this month.
 * Used in tooltips / accessible labels.
 */
export function getSeasonLabel(
  bestMonths?: number[],
  okMonths?: number[],
): "best" | "ok" | "off" {
  const m = getCurrentMonth();
  if (bestMonths?.includes(m)) return "best";
  if (okMonths?.includes(m)) return "ok";
  return "off";
}
