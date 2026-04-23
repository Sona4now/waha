"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { type Session, getSession } from "@/lib/meditation/sessions";
import {
  JOURNEYS,
  type Journey,
  readJourneyProgress,
  markJourneyDayComplete,
  type JourneyProgress,
} from "@/lib/meditation/journeys";
import { suggestSession } from "@/lib/meditation/suggest";
import { useSessionHistory } from "@/hooks/meditation/useSessionHistory";
import { useSessionResume } from "@/hooks/meditation/useSessionResume";
import ImmersiveEntry from "@/components/meditation/ImmersiveEntry";
import SessionLibrary from "@/components/meditation/SessionLibrary";
import SessionPlayer from "@/components/meditation/SessionPlayer";
import SessionSummary from "@/components/meditation/SessionSummary";
import JourneyDetail from "@/components/meditation/JourneyDetail";
import MoodCheckIn, { type Mood } from "@/components/meditation/MoodCheckIn";

type Stage =
  | "entry"
  | "library"
  | "journey"
  | "mood-before"
  | "playing"
  | "mood-after"
  | "summary";

/**
 * Meditation room — state machine orchestrator.
 *
 *   entry / library / journey → mood-before → playing → mood-after → summary
 *   Any step can be skipped when `settings.moodCheckInEnabled` is off.
 *
 * Additional tracked state:
 *   · moodBefore/moodAfter — captured in the check-in screens
 *   · resumeFromSec — if the user had an interrupted session to resume
 */
export default function TherapyRoomPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("entry");
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [activeJourneyDay, setActiveJourneyDay] = useState<number | null>(null);
  const [moodBefore, setMoodBefore] = useState<Mood | undefined>(undefined);
  const [moodAfter, setMoodAfter] = useState<Mood | undefined>(undefined);
  const [lastResult, setLastResult] = useState<{
    elapsed: number;
    fullyCompleted: boolean;
    breathCycles: number;
  } | null>(null);
  const [resumeFromSec, setResumeFromSec] = useState(0);
  const [journeyProgress, setJourneyProgress] = useState<JourneyProgress>({});

  const {
    loaded,
    settings,
    stats,
    meditatedToday,
    records,
    recordSession,
    updateSettings,
    toggleFavorite,
  } = useSessionHistory();
  const {
    loaded: resumeLoaded,
    resumable,
    save: saveResume,
    clear: clearResume,
  } = useSessionResume();

  // Hydrate journey progress from localStorage on mount
  useEffect(() => {
    setJourneyProgress(readJourneyProgress());
  }, []);

  const startSession = useCallback(
    (session: Session, opts?: { journey?: Journey; day?: number; resumeAt?: number }) => {
      setActiveSession(session);
      setActiveJourney(opts?.journey ?? null);
      setActiveJourneyDay(opts?.day ?? null);
      setResumeFromSec(opts?.resumeAt ?? 0);
      setMoodBefore(undefined);
      setMoodAfter(undefined);
      updateSettings({ lastSessionId: session.id });
      // If the user opted out of mood check-ins, skip straight to play.
      setStage(settings.moodCheckInEnabled ? "mood-before" : "playing");
    },
    [settings.moodCheckInEnabled, updateSettings],
  );

  const pickSession = useCallback(
    (session: Session) => startSession(session),
    [startSession],
  );

  const pickJourney = useCallback((journey: Journey) => {
    setActiveJourney(journey);
    setStage("journey");
  }, []);

  const startJourneyDay = useCallback(
    (journey: Journey, day: number) => {
      const dayInfo = journey.days.find((d) => d.day === day);
      if (!dayInfo) return;
      startSession(getSession(dayInfo.sessionId), { journey, day });
    },
    [startSession],
  );

  // Tick-level save so a refresh/close doesn't lose the session.
  // Called from SessionPlayer via onTick.
  const handleTick = useCallback(
    (elapsed: number) => {
      if (!activeSession) return;
      if (elapsed < 20) return; // don't clutter storage for barely-started sessions
      saveResume({
        sessionId: activeSession.id,
        elapsed,
        pausedAt: Date.now(),
        moodBefore,
        journeyId: activeJourney?.id,
        journeyDay: activeJourneyDay ?? undefined,
      });
    },
    [activeSession, moodBefore, activeJourney, activeJourneyDay, saveResume],
  );

  const handleComplete = useCallback(
    (elapsed: number, fullyCompleted: boolean, breathCycles: number) => {
      if (!activeSession) return;
      clearResume();
      setLastResult({ elapsed, fullyCompleted, breathCycles });
      // If check-ins enabled → go through mood-after, which records when done.
      // If disabled → record now and skip to summary.
      if (settings.moodCheckInEnabled) {
        setStage("mood-after");
      } else {
        if (elapsed >= 10) {
          recordSession({
            sessionId: activeSession.id,
            completedAt: Date.now(),
            durationSec: elapsed,
            fullyCompleted,
            breathCycles,
            moodBefore,
            journeyId: activeJourney?.id,
            journeyDay: activeJourneyDay ?? undefined,
          });
          if (fullyCompleted && activeJourney && activeJourneyDay !== null) {
            markJourneyDayComplete(activeJourney.id, activeJourneyDay);
            setJourneyProgress(readJourneyProgress());
          }
        }
        setStage("summary");
      }
    },
    [activeSession, activeJourney, activeJourneyDay, recordSession, moodBefore, settings.moodCheckInEnabled, clearResume],
  );

  const finalizeAfterMood = useCallback(
    (afterMood?: Mood) => {
      if (!activeSession || !lastResult) return;
      if (lastResult.elapsed >= 10) {
        recordSession({
          sessionId: activeSession.id,
          completedAt: Date.now(),
          durationSec: lastResult.elapsed,
          fullyCompleted: lastResult.fullyCompleted,
          breathCycles: lastResult.breathCycles,
          moodBefore,
          moodAfter: afterMood,
          journeyId: activeJourney?.id,
          journeyDay: activeJourneyDay ?? undefined,
        });
        if (lastResult.fullyCompleted && activeJourney && activeJourneyDay !== null) {
          markJourneyDayComplete(activeJourney.id, activeJourneyDay);
          setJourneyProgress(readJourneyProgress());
        }
      }
      setMoodAfter(afterMood);
      setStage("summary");
    },
    [activeSession, lastResult, moodBefore, activeJourney, activeJourneyDay, recordSession],
  );

  const afterSummary = useCallback(() => {
    if (activeJourney) {
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
    setMoodBefore(undefined);
    setMoodAfter(undefined);
    setStage(settings.moodCheckInEnabled ? "mood-before" : "playing");
  }, [activeSession, afterSummary, settings.moodCheckInEnabled]);

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

  const resumeInterrupted = useCallback(() => {
    if (!resumable) return;
    const s = getSession(resumable.sessionId);
    const journey = resumable.journeyId
      ? JOURNEYS.find((j) => j.id === resumable.journeyId) ?? undefined
      : undefined;
    setMoodBefore(resumable.moodBefore as Mood | undefined);
    setActiveSession(s);
    setActiveJourney(journey ?? null);
    setActiveJourneyDay(resumable.journeyDay ?? null);
    setResumeFromSec(resumable.elapsed);
    setStage("playing");
    // keep the record for now; it'll be cleared on onComplete
  }, [resumable]);

  if (!loaded || !resumeLoaded) {
    return <div className="fixed inset-0 bg-[#070d15]" />;
  }

  // Smart suggestion — time-aware, journey-aware, intro-aware.
  // `rec` was reading localStorage on every render before memoization; now it
  // re-reads only when the user enters the room, not on every React re-render.
  const rec = useMemo<{ need?: string } | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem("waaha_recommendation") || "null");
    } catch (err) {
      console.warn("[waaha] failed to parse waaha_recommendation", err);
      return null;
    }
  }, []);
  const suggestion = suggestSession({
    journeyProgress,
    lastSessionId: settings.lastSessionId,
    need: rec?.need,
  });

  return (
    <AnimatePresence mode="wait">
      {stage === "entry" && (
        <ImmersiveEntry
          key="entry"
          suggestedSession={suggestion.session}
          suggestionReason={suggestion.reason}
          journeys={JOURNEYS}
          journeyProgress={journeyProgress}
          stats={stats}
          meditatedToday={meditatedToday}
          resumable={resumable}
          onResume={resumeInterrupted}
          onStart={() => {
            if (suggestion.journeyId && suggestion.journeyDay !== undefined) {
              const j = JOURNEYS.find((x) => x.id === suggestion.journeyId);
              if (j) return startJourneyDay(j, suggestion.journeyDay);
            }
            pickSession(suggestion.session);
          }}
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

      {stage === "mood-before" && activeSession && (
        <MoodCheckIn
          key="mood-before"
          phase="before"
          sessionName={activeSession.name}
          onSelect={(m) => {
            setMoodBefore(m);
            setStage("playing");
          }}
          onSkip={() => setStage("playing")}
        />
      )}

      {stage === "playing" && activeSession && (
        <SessionPlayer
          key={`player-${activeSession.id}-${activeJourneyDay ?? "free"}`}
          sessionId={activeSession.id}
          resumeFromSec={resumeFromSec}
          initialSettings={{
            voiceEnabled: settings.voiceEnabled,
            volumeAmbient: settings.volumeAmbient,
            volumeChimes: settings.volumeChimes,
            volumeVoice: settings.volumeVoice,
            sleepTimer: settings.sleepTimer,
            skipIntro: settings.skipIntro,
          }}
          onSettingsChange={updateSettings}
          onTick={handleTick}
          onComplete={handleComplete}
        />
      )}

      {stage === "mood-after" && activeSession && (
        <MoodCheckIn
          key="mood-after"
          phase="after"
          sessionName={activeSession.name}
          previousMood={moodBefore}
          onSelect={(m) => finalizeAfterMood(m)}
          onSkip={() => finalizeAfterMood(undefined)}
        />
      )}

      {stage === "summary" && activeSession && lastResult && (
        <SessionSummary
          key="summary"
          session={activeSession}
          elapsed={lastResult.elapsed}
          fullyCompleted={lastResult.fullyCompleted}
          breathCycles={lastResult.breathCycles}
          moodBefore={moodBefore}
          moodAfter={moodAfter}
          journey={activeJourney ?? undefined}
          journeyDay={activeJourneyDay ?? undefined}
          stats={stats}
          onRestart={restartLast}
          onLibrary={afterSummary}
          onViewHistory={() => router.push("/therapy-room/history")}
        />
      )}
    </AnimatePresence>
  );
}
