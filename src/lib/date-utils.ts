// ─── Client-safe date utilities ───
// These functions can be used in both client and server components.

import { SpecialDate } from './types';

export function getNextOccurrence(dateStr: string, recurring: boolean): Date {
  const date = new Date(dateStr);
  if (!recurring) return date;

  const now = new Date();
  const thisYear = new Date(now.getFullYear(), date.getMonth(), date.getDate());

  if (thisYear >= now) return thisYear;
  return new Date(now.getFullYear() + 1, date.getMonth(), date.getDate());
}

export function getUpcomingSpecialDate(dates: SpecialDate[]): SpecialDate | null {
  const now = new Date();
  let closest: SpecialDate | null = null;
  let closestDiff = Infinity;

  for (const d of dates) {
    const next = getNextOccurrence(d.date, d.recurring);
    const diff = next.getTime() - now.getTime();
    if (diff > 0 && diff < closestDiff) {
      closestDiff = diff;
      closest = d;
    }
  }

  return closest;
}
