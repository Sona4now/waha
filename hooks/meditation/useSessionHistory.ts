"use client";

import { useCallback, useMemo, useState } from "react";

const STORAGE_KEY = "waaha_meditation_history";
const SETTINGS_KEY = "waaha_meditation_settings";

/**
 * A recorded meditation session.
 *
 * `moodBefore` / `moodAfter` are the 1-5 values from the mood check-in flow
 * (1 = awful, 5 = great). Both optional — legacy records + skipped
 * check-ins stay null, so UI must handle missing values.
 */
export interface SessionRecord {
  sessionId: string;
  completedAt: number; // epoch ms
  durationSec: number; // actual elapsed time
  fullyCompleted: boolean;
  breathCycles?: number; // completed inhale→exhale cycles
  moodBefore?: number; // 1..5
  moodAfter?: number; // 1..5
  journeyId?: string; // if this session was a journey day
  journeyDay?: number; // 1-indexed day inside the journey
}

export interface UserSettings {
  voiceEnabled: boolean;
  volumeAmbient: number;
  volumeChimes: number;
  volumeVoice: number;
  lastSessionId?: string;
  favorites: string[];
  /** When a session is marked as "sleep mode", suppress the end chime and
   *  fade the ambient out over 20s. Default: off. */
  sleepTimer: boolean;
  /** User opted out of the 3-2-1 intro countdown (for returning meditators). */
  skipIntro: boolean;
  /** Show the mood check-in prompts before/after sessions. Default: on. */
  moodCheckInEnabled: boolean;
}

export interface Stats {
  totalMinutes: number;
  totalSessions: number;
  streak: number; // consecutive days including today
  last7Days: boolean[]; // oldest → newest, true = meditated that day
}

const DEFAULT_SETTINGS: UserSettings = {
  voiceEnabled: true,
  volumeAmbient: 70,
  volumeChimes: 60,
  volumeVoice: 100,
  favorites: [],
  sleepTimer: false,
  skipIntro: false,
  moodCheckInEnabled: true,
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function sameDay(a: number, b: number): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function dayStart(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function computeStats(records: SessionRecord[]): Stats {
  const totalSec = records.reduce((acc, r) => acc + r.durationSec, 0);
  const totalMinutes = Math.round(totalSec / 60);

  // Streak: count consecutive days from today going back.
  const today = dayStart(Date.now());
  const days = new Set(records.map((r) => dayStart(r.completedAt)));
  let streak = 0;
  let cursor = today;
  // Allow today to be missing — streak still counts if yesterday is present.
  if (!days.has(cursor)) cursor -= 86400000;
  while (days.has(cursor)) {
    streak += 1;
    cursor -= 86400000;
  }

  const last7Days: boolean[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = today - i * 86400000;
    last7Days.push(days.has(d));
  }

  return { totalMinutes, totalSessions: records.length, streak, last7Days };
}

export function useSessionHistory() {
  const [records, setRecords] = useState<SessionRecord[]>(() => {
    if (typeof window === "undefined") return [];
    return safeParse<SessionRecord[]>(localStorage.getItem(STORAGE_KEY), []);
  });
  const [settings, setSettings] = useState<UserSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    const s = safeParse<Partial<UserSettings>>(localStorage.getItem(SETTINGS_KEY), {});
    return { ...DEFAULT_SETTINGS, ...s };
  });
  const loaded = true;

  const recordSession = useCallback((rec: SessionRecord) => {
    setRecords((prev) => {
      const next = [...prev, rec].slice(-365); // keep last year
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<UserSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [],
  );

  const toggleFavorite = useCallback(
    (sessionId: string) => {
      setSettings((prev) => {
        const has = prev.favorites.includes(sessionId);
        const favorites = has
          ? prev.favorites.filter((id) => id !== sessionId)
          : [...prev.favorites, sessionId];
        const next = { ...prev, favorites };
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [],
  );

  const [now] = useState(() => Date.now());
  const stats = computeStats(records);
  const meditatedToday = useMemo(
    () => records.some((r) => sameDay(r.completedAt, now)),
    [records, now],
  );

  return {
    loaded,
    records,
    settings,
    stats,
    meditatedToday,
    recordSession,
    updateSettings,
    toggleFavorite,
  };
}
