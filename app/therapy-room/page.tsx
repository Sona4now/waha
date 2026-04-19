"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SESSIONS, type Session, getSession } from "@/lib/meditation/sessions";
import {
  JOURNEYS,
  type Journey,
  readJourneyProgress,
  markJourneyDayComplete,
  nextDayFor,
  type JourneyProgress,
} from "@/lib/meditation/journeys";
import { useSessionHistory } from "@/hooks/meditation/useSessionHistory";
import ImmersiveEntry from "@/components/meditation/ImmersiveEntry";
import SessionLibrary from "@/components/meditation/SessionLibrary";
import SessionPlayer from "@/components/meditation/SessionPlayer";
import SessionSummary from "@/components/meditation/SessionSummary";
import JourneyDetail from "@/components/meditation/JourneyDetail";

type Stage = "entry" | "library" | "journey" | "playing" | "summary";

/**
 * Meditation room — state machine orchestrator.
 *
 *   entry → (library | journey | playing)
 *   library → playing → summary → library
 *   journey → playing → summary → journey (next day unlocked)
 */
export default function TherapyRoomPage() {
  const [stage, setStage] = useState<Stage>("entry");
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [activeJourneyDay, setActiveJourneyDay] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<{
    elapsed: number;
    fullyCompleted: boolean;
    breathCycles: number;
  } | null>(null);
  const [journeyProgress, setJourneyProgress] = useState<JourneyProgress>({});

  const {
    loaded,
    settings,
    stats,
    meditatedToday,
    recordSession,
    updateSettings,
    toggleFavorite,
  } = useSessionHistory();

  // Hydrate journey progress from localStorage on mount
  useEffect(() => {
    setJourneyProgress(readJourneyProgress());
  }, []);

  const pickSession = useCallback(
    (session: Session) => {
      console.log("[therapy-room] pickSession called:", session.id);
      setActiveSession(session);
      setActiveJourney(null);
      setActiveJourneyDay(null);
      setStage("playing");
      updateSettings({ lastSessionId: session.id });
    },
    [updateSettings],
  );

  const pickJourney = useCallback((journey: Journey) => {
    setActiveJourney(journey);
    setStage("journey");
  }, []);

  const startJourneyDay = useCallback(
    (journey: Journey, day: number) => {
      const dayInfo = journey.days.find((d) => d.day === day);
      if (!dayInfo) return;
      const session = getSession(dayInfo.sessionId);
      setActiveSession(session);
      setActiveJourney(journey);
      setActiveJourneyDay(day);
      setStage("playing");
      updateSettings({ lastSessionId: session.id });
    },
    [updateSettings],
  );

  const handleComplete = useCallback(
    (elapsed: number, fullyCompleted: boolean, breathCycles: number) => {
      if (!activeSession) return;
      if (elapsed >= 10) {
        recordSession({
          sessionId: activeSession.id,
          completedAt: Date.now(),
          durationSec: elapsed,
          fullyCompleted,
        });
        if (fullyCompleted && activeJourney && activeJourneyDay !== null) {
          markJourneyDayComplete(activeJourney.id, activeJourneyDay);
          setJourneyProgress(readJourneyProgress());
        }
      }
      setLastResult({ elapsed, fullyCompleted, breathCycles });
      setStage("summary");
    },
    [activeSession, activeJourney, activeJourneyDay, recordSession],
  );

  const afterSummary = useCallback(() => {
    if (activeJourney) {
      // Return to the journey detail view so user sees progress updated
      setActiveSession(null);
      setLastResult(null);
      setStage("journey");
    } else {
      setActiveSession(null);
      setLastResult(null);
      setStage("library");
    }
  }, [activeJourney]);

  const restartLast = useCallback(() => {
    if (!activeSession) return afterSummary();
    setLastResult(null);
    setStage("playing");
  }, [activeSession, afterSummary]);

  const openLibrary = useCallback(() => {
    setActiveJourney(null);
    setActiveJourneyDay(null);
    setStage("library");
  }, []);

  const backToEntry = useCallback(() => {
    setActiveSession(null);
    setActiveJourney(null);
    setActiveJourneyDay(null);
    setLastResult(null);
    setStage("entry");
  }, []);

  if (!loaded) {
    return <div className="fixed inset-0 bg-[#070d15]" />;
  }

  // Suggested "next session" — either journey next day, or last picked, or default first
  const suggestedSession: Session = (() => {
    // 1. Any in-progress journey with an uncompleted day → offer that
    for (const j of JOURNEYS) {
      const entry = journeyProgress[j.id];
      if (entry && entry.completedDays.length > 0 && entry.completedDays.length < j.days.length) {
        const day = nextDayFor(j, journeyProgress);
        const dayInfo = j.days.find((d) => d.day === day);
        if (dayInfo) return getSession(dayInfo.sessionId);
      }
    }
    // 2. Last played
    if (settings.lastSessionId) {
      const last = SESSIONS.find((s) => s.id === settings.lastSessionId);
      if (last) return last;
    }
    // 3. Default: quick-calm
    return SESSIONS[0];
  })();

  return (
    <AnimatePresence mode="wait">
      {stage === "entry" && (
        <ImmersiveEntry
          key="entry"
          suggestedSession={suggestedSession}
          journeys={JOURNEYS}
          journeyProgress={journeyProgress}
          stats={stats}
          meditatedToday={meditatedToday}
          onStart={() => pickSession(suggestedSession)}
          onOpenJourney={pickJourney}
          onOpenLibrary={openLibrary}
        />
      )}

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

      {stage === "journey" && activeJourney && (
        <JourneyDetail
          key={`journey-${activeJourney.id}`}
          journey={activeJourney}
          progress={journeyProgress}
          onBack={backToEntry}
          onStartDay={(day) => startJourneyDay(activeJourney, day)}
        />
      )}

      {stage === "playing" && activeSession && (
        <SessionPlayer
          key={`player-${activeSession.id}-${activeJourneyDay ?? "free"}`}
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
          onLibrary={afterSummary}
        />
      )}
    </AnimatePresence>
  );
}
