"use client";

import { useEffect, useRef, useState } from "react";

interface Opts {
  active: boolean;
  /** Target duration in seconds — used to report progress. */
  durationSec: number;
  /** Fires once when elapsed reaches duration. */
  onComplete?: () => void;
}

/**
 * Elapsed-seconds timer that also:
 *  - pauses when the tab is hidden (saves CPU + battery)
 *  - signals completion at `durationSec`
 *  - resets cleanly on `active=false`
 */
export function useSessionTimer({ active, durationSec, onComplete }: Opts) {
  const [elapsed, setElapsed] = useState(0);
  const firedRef = useRef(false);
  const hiddenRef = useRef(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  // Track tab visibility so we can pause the tick without losing state.
  useEffect(() => {
    function onVis() {
      hiddenRef.current = document.hidden;
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!active) {
      setElapsed(0);
      firedRef.current = false;
      return;
    }

    const interval = setInterval(() => {
      if (hiddenRef.current) return;
      setElapsed((e) => {
        const next = e + 1;
        if (!firedRef.current && next >= durationSec) {
          firedRef.current = true;
          completeRef.current?.();
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active, durationSec]);

  const progress = durationSec > 0 ? Math.min(elapsed / durationSec, 1) : 0;

  return { elapsed, progress };
}
