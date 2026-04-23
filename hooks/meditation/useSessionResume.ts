"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Tracks a session that was interrupted (user closed the tab mid-flight or
 * navigated away). On next visit we offer a "resume from X seconds?" dialog.
 *
 * Only useful when the session was >= 20s in (shorter than that isn't worth
 * resuming). Auto-expires after 2 hours — if the user comes back tomorrow,
 * we don't pester them about yesterday's half-session.
 */
const KEY = "waaha_meditation_resume";
const MAX_AGE_MS = 2 * 60 * 60 * 1000;
const MIN_RESUMABLE_SEC = 20;

export interface ResumeState {
  sessionId: string;
  elapsed: number; // seconds into the session when saved
  pausedAt: number; // epoch ms
  moodBefore?: number;
  journeyId?: string;
  journeyDay?: number;
}

function readRaw(): ResumeState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ResumeState;
    if (!parsed.sessionId || parsed.elapsed < MIN_RESUMABLE_SEC) return null;
    if (Date.now() - parsed.pausedAt > MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function useSessionResume() {
  const [resumable, setResumable] = useState<ResumeState | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setResumable(readRaw());
    setLoaded(true);
  }, []);

  const save = useCallback((state: ResumeState) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      setResumable(state);
    } catch {
      /* ignore */
    }
  }, []);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
      setResumable(null);
    } catch {
      /* ignore */
    }
  }, []);

  return { loaded, resumable, save, clear };
}
