"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LanguageGate from "@/components/LanguageGate";
import EntryScreen from "@/components/EntryScreen";
import HookScreen from "@/components/HookScreen";
import DiscoveryScreen from "@/components/DiscoveryScreen";
import QuestionStep from "@/components/QuestionStep";
import ProcessingScreen from "@/components/ProcessingScreen";
import RevealScreen from "@/components/RevealScreen";
import ReturningScreen from "@/components/ReturningScreen";
import Teaser360 from "@/components/Teaser360";
import TransitionScreen from "@/components/TransitionScreen";
import AmbientSound from "@/components/AmbientSound";
import ShareCard from "@/components/ShareCard";
import CustomCursor from "@/components/CustomCursor";
import { questions } from "@/data/questions";
import { getRecommendation, type Answers } from "@/utils/getRecommendation";
import { destinations, type Destination } from "@/data/destinations";

type Step =
  | "language"
  | "returning"
  | "entry"
  | "hook"
  | "discovery"
  | "q-0"
  | "q-1"
  | "processing"
  | "reveal"
  | "teaser360"
  | "transition";

const SOUND_MAP: Record<string, "waves" | "wind" | "nature"> = {
  language: "nature",
  returning: "waves",
  entry: "nature",
  hook: "nature",
  discovery: "nature",
  "q-0": "nature",
  "q-1": "nature",
  processing: "wind",
  reveal: "waves",
  teaser360: "waves",
  transition: "waves",
};

// Maps a step to a 1-based progress value out of 5 (shown during the quiz flow).
const STEP_PROGRESS: Partial<Record<Step, number>> = {
  hook: 1,
  discovery: 2,
  "q-0": 3,
  "q-1": 4,
  processing: 5,
};

interface Props {
  /** Decided server-side from the locale cookie. When `true` the
   *  cinematic flow opens with the language gate instead of Entry. */
  showLanguageGate: boolean;
}

export default function CinematicExperience({ showLanguageGate }: Props) {
  const [step, setStep] = useState<Step>(
    showLanguageGate ? "language" : "entry",
  );
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [destination, setDestination] = useState<Destination | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);

  // Re-entry: check for a previous recommendation saved < 7 days ago.
  useEffect(() => {
    if (showLanguageGate) return;
    try {
      const raw = localStorage.getItem("waaha_recommendation");
      if (!raw) return;
      const rec = JSON.parse(raw) as {
        destinationId: string;
        timestamp: number;
        need?: string;
        environment?: string;
        journeyStyle?: string;
      };
      const age = Date.now() - (rec.timestamp ?? 0);
      if (age < 7 * 24 * 60 * 60 * 1000 && destinations[rec.destinationId]) {
        const dest = destinations[rec.destinationId];
        const savedAnswers = { need: rec.need, environment: rec.environment, journeyStyle: rec.journeyStyle };
        setTimeout(() => {
          setDestination(dest);
          setAnswers(savedAnswers);
          setStep("returning");
        }, 0);
      }
    } catch {
      // localStorage unavailable or malformed
    }
  }, [showLanguageGate]);

  /* ---- Navigation helpers ---- */

  const goToMainSite = useCallback(() => {
    document.body.style.transition = "opacity 0.4s ease";
    document.body.style.opacity = "0";
    setTimeout(() => { window.location.href = "/home"; }, 400);
  }, []);

  const goToDestinationPage = useCallback((id: string) => {
    document.body.style.transition = "opacity 0.4s ease";
    document.body.style.opacity = "0";
    setTimeout(() => { window.location.href = `/destination/${id}`; }, 400);
  }, []);

  /* ---- Step handlers ---- */

  const handleLanguagePicked = useCallback(() => { setStep("entry"); }, []);
  const handleStart = useCallback(() => setStep("hook"), []);
  const handleHookDone = useCallback(() => setStep("discovery"), []);

  // Discovery now captures the environment answer directly.
  const handleDiscoveryDone = useCallback((environment: string) => {
    setAnswers((prev) => ({ ...prev, environment }));
    setStep("q-0");
  }, []);

  const handleProcessingDone = useCallback(() => setStep("reveal"), []);
  const handleExplore = useCallback(() => setStep("transition"), []);
  const handle360 = useCallback(() => setStep("teaser360"), []);
  const handleTeaserContinue = useCallback(() => setStep("transition"), []);
  const handleShare = useCallback(() => setShowShareCard(true), []);

  // Re-entry: "continue" goes straight to the destination page.
  const handleReturningContinue = useCallback(() => {
    if (destination) goToDestinationPage(destination.id);
    else goToMainSite();
  }, [destination, goToDestinationPage, goToMainSite]);

  // Re-entry: "start fresh" resets state and restarts from hook.
  const handleReturningRestart = useCallback(() => {
    setAnswers({});
    setDestination(null);
    setStep("hook");
  }, []);

  const handleEnterSite = useCallback(() => {
    if (destination) goToDestinationPage(destination.id);
    else goToMainSite();
  }, [destination, goToDestinationPage, goToMainSite]);

  const handleAnswer = useCallback(
    (questionIndex: number, answerId: string) => {
      const key = questions[questionIndex].id;
      const newAnswers = { ...answers, [key]: answerId };
      setAnswers(newAnswers);

      if (questionIndex < questions.length - 1) {
        setStep(`q-${questionIndex + 1}` as Step);
      } else {
        const dest = getRecommendation(newAnswers);
        setDestination(dest);

        try {
          localStorage.setItem(
            "waaha_recommendation",
            JSON.stringify({
              destinationId: dest.id,
              need: newAnswers.need,
              environment: newAnswers.environment,
              journeyStyle: newAnswers.journeyStyle,
              timestamp: Date.now(),
            })
          );
        } catch {
          // localStorage unavailable
        }

        setStep("processing");
      }
    },
    [answers]
  );

  /* ---- Render ---- */

  const questionIndex = step.startsWith("q-")
    ? parseInt(step.split("-")[1])
    : -1;

  const progressStep = STEP_PROGRESS[step];

  return (
    <div className="fixed inset-0 bg-[#070d15]">
      <CustomCursor />
      <AmbientSound track={SOUND_MAP[step] || "nature"} volume={0.12} />

      {/* Progress bar — thin line at top, only visible during the quiz flow */}
      <AnimatePresence>
        {progressStep !== undefined && (
          <motion.div
            key="progress-bar"
            className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/[0.07]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-[#91b149]"
              initial={{ width: 0 }}
              animate={{ width: `${(progressStep / 5) * 100}%` }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === "language" && (
          <LanguageGate key="language" onPicked={handleLanguagePicked} />
        )}

        {step === "returning" && destination && (
          <ReturningScreen
            key="returning"
            destination={destination}
            onContinue={handleReturningContinue}
            onRestart={handleReturningRestart}
          />
        )}

        {step === "entry" && (
          <EntryScreen
            key="entry"
            onStart={handleStart}
            onSkip={goToMainSite}
          />
        )}

        {step === "hook" && (
          <HookScreen key="hook" onDone={handleHookDone} />
        )}

        {step === "discovery" && (
          <DiscoveryScreen key="discovery" onDone={handleDiscoveryDone} />
        )}

        {questionIndex >= 0 && (
          <QuestionStep
            key={step}
            question={questions[questionIndex]}
            stepIndex={questionIndex}
            totalSteps={questions.length}
            onAnswer={(id) => handleAnswer(questionIndex, id)}
          />
        )}

        {step === "processing" && (
          <ProcessingScreen key="processing" onDone={handleProcessingDone} />
        )}

        {step === "reveal" && destination && (
          <RevealScreen
            key="reveal"
            destination={destination}
            answers={answers}
            onExplore={handleExplore}
            on360={handle360}
            onShare={handleShare}
          />
        )}

        {step === "teaser360" && destination && (
          <Teaser360
            key="teaser360"
            destination={destination}
            onContinue={handleTeaserContinue}
          />
        )}

        {step === "transition" && destination && (
          <TransitionScreen
            key="transition"
            destination={destination}
            onEnter={handleEnterSite}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShareCard && destination && (
          <ShareCard
            destination={destination}
            answers={answers}
            onClose={() => setShowShareCard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
