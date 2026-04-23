/**
 * Smart session picker.
 *
 * Logic (first match wins):
 *   1. Any journey the user is partway through → offer its next day
 *      (only if the day is actually unlocked per the 20h gap).
 *   2. Time-of-day heuristic:
 *        late night (21h-6h) → sleep-478
 *        early morning (6h-10h) → gratitude
 *        daytime (10h-17h) → box-focus (gets you back to work)
 *        evening (17h-21h) → beach-visualization (unwind)
 *   3. If cinematic intro captured a `need`, bias:
 *        physical_pain → beach-visualization
 *        mental_stress → anxiety-release
 *        fatigue       → body-scan
 *   4. Fallback: last session they took, else quick-calm.
 */

import { SESSIONS, getSession, type Session } from "./sessions";
import {
  JOURNEYS,
  dayLockInfo,
  type JourneyProgress,
} from "./journeys";

interface SuggestInput {
  journeyProgress: JourneyProgress;
  lastSessionId?: string;
  /** From /waaha_recommendation — what the intro captured about the user. */
  need?: string;
  /** Unix ms. Defaults to now. Injectable for tests. */
  now?: number;
}

export interface SuggestionResult {
  session: Session;
  /** Why we picked this session — shown under the session name in the hero. */
  reason: string;
  /** If this is a journey continuation, include journey metadata. */
  journeyId?: string;
  journeyDay?: number;
}

const TIME_OF_DAY_MAP: { from: number; to: number; id: string; reason: string }[] = [
  // [from, to) in 24h clock
  { from: 21, to: 24, id: "sleep-478", reason: "قبل النوم" },
  { from: 0, to: 6, id: "sleep-478", reason: "عشان ترجع تنام" },
  { from: 6, to: 10, id: "gratitude", reason: "صباح هادي" },
  { from: 10, to: 17, id: "box-focus", reason: "صفاء وسط اليوم" },
  { from: 17, to: 21, id: "beach-visualization", reason: "تفريغ بعد اليوم" },
];

const NEED_MAP: Record<string, { id: string; reason: string }> = {
  physical_pain: { id: "beach-visualization", reason: "للآلام الجسدية" },
  mental_stress: { id: "anxiety-release", reason: "للتوتر الذهني" },
  fatigue: { id: "body-scan", reason: "لإعادة شحن الجسم" },
  body: { id: "beach-visualization", reason: "للجسم" },
  mind: { id: "anxiety-release", reason: "للعقل" },
  relax: { id: "beach-visualization", reason: "للاسترخاء" },
};

export function suggestSession({
  journeyProgress,
  lastSessionId,
  need,
  now = Date.now(),
}: SuggestInput): SuggestionResult {
  // 1. In-progress journey? → resume if the day is unlocked.
  for (const j of JOURNEYS) {
    const entry = journeyProgress[j.id];
    if (!entry || entry.completedDays.length === 0) continue;
    if (entry.completedDays.length >= j.days.length) continue;
    // Find next uncompleted day
    const nextDay = j.days.find((d) => !entry.completedDays.includes(d.day));
    if (!nextDay) continue;
    const lock = dayLockInfo(j, nextDay.day, journeyProgress);
    if (!lock.unlocked) continue;
    return {
      session: getSession(nextDay.sessionId),
      reason: `اليوم ${nextDay.day} من ${j.name}`,
      journeyId: j.id,
      journeyDay: nextDay.day,
    };
  }

  // 2. Time-of-day match.
  const hour = new Date(now).getHours();
  const todMatch = TIME_OF_DAY_MAP.find(
    (t) => hour >= t.from && hour < t.to,
  );
  if (todMatch && SESSIONS.some((s) => s.id === todMatch.id)) {
    return {
      session: getSession(todMatch.id),
      reason: todMatch.reason,
    };
  }

  // 3. Need from cinematic intro.
  if (need && NEED_MAP[need]) {
    const pick = NEED_MAP[need];
    return {
      session: getSession(pick.id),
      reason: pick.reason,
    };
  }

  // 4. Last session or default.
  if (lastSessionId) {
    const last = SESSIONS.find((s) => s.id === lastSessionId);
    if (last) {
      return {
        session: last,
        reason: "اللي عملته آخر مرة",
      };
    }
  }

  return {
    session: SESSIONS[0],
    reason: "للمبتدئين",
  };
}
