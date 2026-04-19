"use client";

import { useEffect, useState } from "react";

/**
 * The recommendation persisted by the cinematic intro (app/page.tsx).
 * If the user never completed the intro, this is `null` and pages
 * should show a friendly fallback instead of asking again.
 */
export interface Recommendation {
  destinationId: string;
  /** body | mind | relax */
  need?: string;
  /** sea | desert | mountains | oasis */
  environment?: string;
  /** calm | exploratory | deep */
  journeyStyle?: string;
  timestamp?: number;
}

const STORAGE_KEY = "waaha_recommendation";

/**
 * Human-readable labels for each "need" stored by the cinematic intro.
 * These are the values the story map needs to speak back to the user.
 */
export const NEED_LABELS: Record<string, string> = {
  body: "راحة جسدية",
  mind: "صفاء نفسي",
  relax: "استرخاء",
};

/**
 * Maps intro `need` values to the treatment tags used across destinations.
 * A user who picked `body` cares about physical (مفاصل / جلد / تنفس).
 * `mind` leans on mental (توتر) and `relax` on (استرخاء).
 */
export const NEED_TO_TREATMENTS: Record<string, string[]> = {
  body: ["مفاصل", "جلد", "تنفس"],
  mind: ["توتر", "استرخاء"],
  relax: ["استرخاء", "توتر"],
};

export const ENVIRONMENT_LABELS: Record<string, string> = {
  sea: "البحر",
  desert: "الصحراء",
  mountains: "الجبال",
  oasis: "الواحات",
};

export function useRecommendation() {
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Recommendation;
        if (parsed?.destinationId) setRec(parsed);
      }
    } catch {
      /* storage disabled — keep rec null */
    }
    setLoaded(true);
  }, []);

  return { recommendation: rec, loaded };
}
