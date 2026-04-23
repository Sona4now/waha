/**
 * Multi-day Journeys — programs built from existing sessions.
 *
 * A journey is an ordered list of session IDs.  The app tracks which
 * days the user has completed in localStorage and surfaces the next
 * locked day on the landing.
 */

import type { Session } from "./sessions";
import { SESSIONS } from "./sessions";

export interface JourneyDay {
  day: number;
  sessionId: string;
  /** A short teaser shown on the journey card for that day */
  teaser: string;
}

export interface Journey {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  /** Accent color for the journey card */
  color: string;
  /** Hero gradient (tailwind) — e.g. "from-[#1d5770] to-[#0c4a6e]" */
  gradient: string;
  /** Cover image/video URL (short 15s loop preferred) */
  coverVideo?: string;
  coverImage: string;
  description: string;
  days: JourneyDay[];
}

/* ─────────────────────────────────────────────────────────
   Three journeys — each an ordered 5-14 day program
   ───────────────────────────────────────────────────────── */

export const JOURNEYS: Journey[] = [
  {
    id: "red-sea-7",
    name: "7 أيام مع البحر الأحمر",
    subtitle: "برنامج للمبتدئين — أسبوع كامل",
    icon: "🌊",
    color: "#3aa0c7",
    gradient: "from-[#1d5770] via-[#2d7d94] to-[#0c4a6e]",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    description:
      "كل يوم 5-12 دقيقة. هنبدأ بسيط وهنكبّر ببطء. نهاية الأسبوع هتحس بتغيير حقيقي.",
    days: [
      { day: 1, sessionId: "quick-calm", teaser: "أول لقاء مع نفسك" },
      { day: 2, sessionId: "gratitude", teaser: "الشكر بيفتح اليوم" },
      { day: 3, sessionId: "box-focus", teaser: "تركيز المربع" },
      { day: 4, sessionId: "body-scan", teaser: "جسمك بيحكي" },
      { day: 5, sessionId: "beach-visualization", teaser: "رحلة لسفاجا" },
      { day: 6, sessionId: "anxiety-release", teaser: "قول للقلق إنك آمن" },
      { day: 7, sessionId: "deep-relax", teaser: "احتفال — نص ساعة ليك" },
    ],
  },
  {
    id: "siwa-calm-5",
    name: "5 ليالي في سيوة",
    subtitle: "للقلق والتوتر المزمن",
    icon: "🏜️",
    color: "#d97706",
    gradient: "from-[#78350f] via-[#92400e] to-[#451a03]",
    coverImage:
      "https://images.unsplash.com/photo-1533158307587-828f0a4ef4a8?w=1200&q=80",
    description:
      "خمس ليالي مع صمت الصحراء. كل جلسة أعمق من اللي قبلها.",
    days: [
      { day: 1, sessionId: "quick-calm", teaser: "التحضير" },
      { day: 2, sessionId: "anxiety-release", teaser: "إطلاق التوتر" },
      { day: 3, sessionId: "body-scan", teaser: "Body scan طويل" },
      { day: 4, sessionId: "desert-silence", teaser: "صمت عميق" },
      { day: 5, sessionId: "desert-silence", teaser: "مرة كمان — أعمق" },
    ],
  },
  {
    id: "sleep-14",
    name: "14 ليلة للنوم الهادي",
    subtitle: "للأرق المزمن",
    icon: "🌙",
    color: "#6366f1",
    gradient: "from-[#312e81] via-[#1e1b4b] to-[#0a0f2b]",
    coverImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
    description:
      "أسبوعين كاملة. 10 دقايق قبل النوم كل ليلة. جسمك هيتعلّم يخلد للنوم تلقائياً.",
    days: [
      { day: 1, sessionId: "quick-calm", teaser: "تمهيد" },
      { day: 2, sessionId: "sleep-478", teaser: "تقنية 4-7-8" },
      { day: 3, sessionId: "sleep-478", teaser: "تعميق" },
      { day: 4, sessionId: "body-scan", teaser: "مسح الجسم" },
      { day: 5, sessionId: "sleep-478", teaser: "4-7-8 مرة تالتة" },
      { day: 6, sessionId: "beach-visualization", teaser: "شاطئ هادي" },
      { day: 7, sessionId: "sleep-478", teaser: "نهاية الأسبوع" },
      { day: 8, sessionId: "body-scan", teaser: "Body scan ليلي" },
      { day: 9, sessionId: "sleep-478", teaser: "4-7-8 مستمر" },
      { day: 10, sessionId: "desert-silence", teaser: "صمت عميق" },
      { day: 11, sessionId: "sleep-478", teaser: "استمرار" },
      { day: 12, sessionId: "body-scan", teaser: "مسح عميق" },
      { day: 13, sessionId: "sleep-478", teaser: "قبل الأخير" },
      { day: 14, sessionId: "deep-relax", teaser: "ختام — استرخاء كامل" },
    ],
  },
];

export function getJourney(id: string): Journey | null {
  return JOURNEYS.find((j) => j.id === id) ?? null;
}

export function getJourneySession(
  journey: Journey,
  day: number,
): Session | null {
  const d = journey.days.find((x) => x.day === day);
  if (!d) return null;
  return SESSIONS.find((s) => s.id === d.sessionId) ?? null;
}

/* ─────────────────────────────────────────────────────────
   Progress persistence in localStorage
   ───────────────────────────────────────────────────────── */

const STORAGE_KEY = "waaha_journey_progress_v1";

export interface JourneyProgress {
  /** Map of journeyId → { completedDays: number[], lastDayAt: ISO } */
  [journeyId: string]: {
    completedDays: number[];
    lastDayAt: string;
  };
}

export function readJourneyProgress(): JourneyProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as JourneyProgress) : {};
  } catch {
    return {};
  }
}

export function writeJourneyProgress(p: JourneyProgress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function markJourneyDayComplete(journeyId: string, day: number) {
  const p = readJourneyProgress();
  const entry = p[journeyId] ?? { completedDays: [], lastDayAt: "" };
  if (!entry.completedDays.includes(day)) {
    entry.completedDays.push(day);
    entry.completedDays.sort((a, b) => a - b);
  }
  entry.lastDayAt = new Date().toISOString();
  p[journeyId] = entry;
  writeJourneyProgress(p);
}

/** Which day the user is on right now (1-indexed). First unfinished day. */
export function nextDayFor(journey: Journey, progress: JourneyProgress): number {
  const entry = progress[journey.id];
  if (!entry) return 1;
  for (const d of journey.days) {
    if (!entry.completedDays.includes(d.day)) return d.day;
  }
  // All days done — reset option
  return journey.days.length;
}

/**
 * Journeys are meant to be a *daily* habit. After a user completes Day N,
 * we lock Day N+1 until ~20h have passed. The 20h (not 24h) is intentional —
 * it gives flexibility for someone who did yesterday's session at 10 PM and
 * wants to do today's at 6 PM. Goes stricter than 24h and you create false
 * friction; goes looser than 20h and users just blast through the program.
 */
const MIN_GAP_MS = 20 * 60 * 60 * 1000;

export interface DayLockInfo {
  /** Can the user start this day right now? */
  unlocked: boolean;
  /** Already completed? */
  completed: boolean;
  /** If locked, milliseconds until it unlocks (≥ 0). */
  lockedForMs: number;
  /** Human-readable label for the lock state, localized Arabic. */
  label: string;
}

export function dayLockInfo(
  journey: Journey,
  day: number,
  progress: JourneyProgress,
): DayLockInfo {
  const entry = progress[journey.id];
  const completed = entry?.completedDays.includes(day) ?? false;
  if (completed) {
    return { unlocked: true, completed, lockedForMs: 0, label: "مكتمل ✓" };
  }
  // Day 1 is always unlocked.
  if (day === 1) {
    return { unlocked: true, completed: false, lockedForMs: 0, label: "ابدأ" };
  }
  // All earlier days must be complete first.
  const prevDone = (entry?.completedDays ?? []).includes(day - 1);
  if (!prevDone) {
    return {
      unlocked: false,
      completed: false,
      lockedForMs: Infinity,
      label: `خلّص اليوم ${day - 1} الأول`,
    };
  }
  // Earlier day is done — check how long ago.
  const lastAtIso = entry?.lastDayAt;
  const lastAt = lastAtIso ? new Date(lastAtIso).getTime() : 0;
  const elapsed = Date.now() - lastAt;
  if (elapsed >= MIN_GAP_MS) {
    return { unlocked: true, completed: false, lockedForMs: 0, label: "ابدأ" };
  }
  const lockedForMs = MIN_GAP_MS - elapsed;
  const hours = Math.ceil(lockedForMs / (60 * 60 * 1000));
  return {
    unlocked: false,
    completed: false,
    lockedForMs,
    label: `متاح بعد ${hours} ساعة`,
  };
}
