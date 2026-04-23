"use client";

import { useEffect, useRef, useState } from "react";

interface Opts {
  active: boolean;
  /** Target duration in seconds — used to report progress. */
  durationSec: number;
  /** Fires once when elapsed reaches duration. */
  onComplete?: () => void;
  /**
   * Where to start the elapsed counter from. Used when resuming an
   * interrupted session. Default 0.
   */
  initialElapsed?: number;
  /**
   * Called every second with the current elapsed value. Throttled to
   * full-second ticks so it's cheap. Useful for persisting resume state.
   */
  onTick?: (elapsed: number) => void;
}

/**
 * Elapsed-seconds timer that also:
 *  - pauses when the tab is hidden (saves CPU + battery)
 *  - signals completion at `durationSec`
 *  - resets cleanly on `active=false`
 */
export function useSessionTimer({
  active,
  durationSec,
  onComplete,
  initialElapsed = 0,
  onTick,
}: Opts) {
  const [elapsed, setElapsed] = useState(initialElapsed);
  const firedRef = useRef(false);
  const hiddenRef = useRef(false);
  const completeRef = useRef(onComplete);
  const tickRef = useRef(onTick);
  completeRef.current = onComplete;
  tickRef.current = onTick;

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
      setElapsed(initialElapsed);
      firedRef.current = false;
      return;
    }

    const interval = setInterval(() => {
      if (hiddenRef.current) return;
      setElapsed((e) => {
        const next = e + 1;
        // Tick callback — throttle to every 5 seconds so we're not hammering
        // localStorage on every single tick, but still often enough to
        // preserve progress if the tab closes.
        if (tickRef.current && next % 5 === 0) {
          tickRef.current(next);
        }
        if (!firedRef.current && next >= durationSec) {
          firedRef.current = true;
          completeRef.current?.();
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, durationSec]);

  const progress = durationSec > 0 ? Math.min(elapsed / durationSec, 1) : 0;

  return { elapsed, progress };
}
