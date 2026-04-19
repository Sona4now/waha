"use client";

import { useEffect, useRef, useState } from "react";
import type { BreathTimings } from "@/lib/meditation/sessions";

export type BreathPhase = "in" | "hold1" | "out" | "hold2";

interface Opts {
  active: boolean;
  timings: BreathTimings;
  /** Fires once per *completed* cycle (not at the start). */
  onCycleComplete?: () => void;
}

/**
 * Drives the breath-phase state machine.
 * Fixes the bug in the legacy therapy-room where phase `setTimeout`s were
 * never cleaned up on unmount / pause.
 */
export function useBreathCycle({ active, timings, onCycleComplete }: Opts) {
  const [phase, setPhase] = useState<BreathPhase>("in");
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function clearAll() {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    if (!active) {
      clearAll();
      return;
    }

    const inMs = Math.max(timings.inhale, 0) * 1000;
    const hold1Ms = Math.max(timings.hold1, 0) * 1000;
    const outMs = Math.max(timings.exhale, 0) * 1000;
    const hold2Ms = Math.max(timings.hold2, 0) * 1000;
    const totalMs = inMs + hold1Ms + outMs + hold2Ms;

    if (totalMs <= 0) return;

    function runCycle() {
      setPhase("in");
      if (hold1Ms > 0) {
        timeoutsRef.current.push(setTimeout(() => setPhase("hold1"), inMs));
      }
      timeoutsRef.current.push(
        setTimeout(() => setPhase("out"), inMs + hold1Ms),
      );
      if (hold2Ms > 0) {
        timeoutsRef.current.push(
          setTimeout(() => setPhase("hold2"), inMs + hold1Ms + outMs),
        );
      }
      // Count a cycle only when it *finishes*.
      timeoutsRef.current.push(
        setTimeout(() => onCycleComplete?.(), totalMs - 50),
      );
    }

    runCycle();
    intervalRef.current = setInterval(runCycle, totalMs);

    return clearAll;
  }, [active, timings.inhale, timings.hold1, timings.exhale, timings.hold2, onCycleComplete]);

  return { phase };
}
