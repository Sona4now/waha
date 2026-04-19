"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Session } from "@/lib/meditation/sessions";
import { useSessionHistory } from "@/hooks/meditation/useSessionHistory";
import SessionLibrary from "@/components/meditation/SessionLibrary";
import SessionPlayer from "@/components/meditation/SessionPlayer";
import SessionSummary from "@/components/meditation/SessionSummary";

type Stage = "library" | "playing" | "summary";

/**
 * Meditation room — orchestrator.
 * Pure state-machine: library → playing → summary → library.
 * All audio/animation/side-effects live inside SessionPlayer.
 */
export default function TherapyRoomPage() {
  const [stage, setStage] = useState<Stage>("library");
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [lastResult, setLastResult] = useState<{
    elapsed: number;
    fullyCompleted: boolean;
    breathCycles: number;
  } | null>(null);

  const {
    loaded,
    settings,
    stats,
    meditatedToday,
    recordSession,
    updateSettings,
    toggleFavorite,
  } = useSessionHistory();

  const pickSession = useCallback(
    (session: Session) => {
      setActiveSession(session);
      setStage("playing");
      updateSettings({ lastSessionId: session.id });
    },
    [updateSettings],
  );

  const handleComplete = useCallback(
    (elapsed: number, fullyCompleted: boolean, breathCycles: number) => {
      if (!activeSession) return;
      // Only record meaningful sessions (>10s).
      if (elapsed >= 10) {
        recordSession({
          sessionId: activeSession.id,
          completedAt: Date.now(),
          durationSec: elapsed,
          fullyCompleted,
        });
      }
      setLastResult({ elapsed, fullyCompleted, breathCycles });
      setStage("summary");
    },
    [activeSession, recordSession],
  );

  const backToLibrary = useCallback(() => {
    setActiveSession(null);
    setLastResult(null);
    setStage("library");
  }, []);

  const restartLast = useCallback(() => {
    if (!activeSession) return backToLibrary();
    setLastResult(null);
    setStage("playing");
  }, [activeSession, backToLibrary]);

  if (!loaded) {
    return <div className="fixed inset-0 bg-[#070d15]" />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {stage === "library" && (
          <SessionLibrary
            key="library"
            stats={stats}
            meditatedToday={meditatedToday}
            favorites={settings.favorites}
            lastSessionId={settings.lastSessionId}
            onPick={pickSession}
            onToggleFavorite={toggleFavorite}
          />
        )}
        {stage === "playing" && activeSession && (
          <SessionPlayer
            key={`player-${activeSession.id}`}
            sessionId={activeSession.id}
            initialSettings={{
              voiceEnabled: settings.voiceEnabled,
              volumeAmbient: settings.volumeAmbient,
              volumeChimes: settings.volumeChimes,
              volumeVoice: settings.volumeVoice,
            }}
            onSettingsChange={updateSettings}
            onComplete={handleComplete}
          />
        )}
        {stage === "summary" && activeSession && lastResult && (
          <SessionSummary
            key="summary"
            session={activeSession}
            elapsed={lastResult.elapsed}
            fullyCompleted={lastResult.fullyCompleted}
            breathCycles={lastResult.breathCycles}
            stats={stats}
            onRestart={restartLast}
            onLibrary={backToLibrary}
          />
        )}
      </AnimatePresence>
    </>
  );
}

