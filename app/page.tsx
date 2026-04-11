"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import EntryScreen from "@/components/EntryScreen";
import HookScreen from "@/components/HookScreen";
import DiscoveryScreen from "@/components/DiscoveryScreen";
import QuestionStep from "@/components/QuestionStep";
import ProcessingScreen from "@/components/ProcessingScreen";
import RevealScreen from "@/components/RevealScreen";
import Teaser360 from "@/components/Teaser360";
import TransitionScreen from "@/components/TransitionScreen";
import AmbientSound from "@/components/AmbientSound";
import ShareCard from "@/components/ShareCard";
import CustomCursor from "@/components/CustomCursor";
import { questions } from "@/data/questions";
import { getRecommendation, type Answers } from "@/utils/getRecommendation";
import type { Destination } from "@/data/destinations";

type Step =
  | "entry"
  | "hook"
  | "discovery"
  | "q-0"
  | "q-1"
  | "q-2"
  | "processing"
  | "reveal"
  | "teaser360"
  | "transition";

const SOUND_MAP: Record<string, "waves" | "wind" | "nature"> = {
  entry: "nature",
  hook: "nature",
  discovery: "nature",
  "q-0": "nature",
  "q-1": "nature",
  "q-2": "nature",
  processing: "wind",
  reveal: "waves",
  teaser360: "waves",
  transition: "waves",
};

export default function CinematicExperience() {
  const [step, setStep] = useState<Step>("entry");
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [destination, setDestination] = useState<Destination | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);

  /* ---- Navigation helpers ---- */

  const goToMainSite = useCallback(() => {
    document.body.style.transition = "opacity 0.4s ease";
    document.body.style.opacity = "0";
    setTimeout(() => {
      window.location.href = "/home";
    }, 400);
  }, []);

  const goToDestinationPage = useCallback((id: string) => {
    document.body.style.transition = "opacity 0.4s ease";
    document.body.style.opacity = "0";
    setTimeout(() => {
      window.location.href = `/destination/${id}`;
    }, 400);
  }, []);

  /* ---- Step handlers ---- */

  const handleStart = useCallback(() => setStep("hook"), []);
  const handleHookDone = useCallback(() => setStep("discovery"), []);
  const handleDiscoveryDone = useCallback(() => setStep("q-0"), []);
  const handleProcessingDone = useCallback(() => setStep("reveal"), []);
  const handleExplore = useCallback(() => setStep("transition"), []);
  const handle360 = useCallback(() => setStep("teaser360"), []);
  const handleTeaserContinue = useCallback(() => setStep("transition"), []);
  const handleShare = useCallback(() => setShowShareCard(true), []);

  const handleEnterSite = useCallback(() => {
    if (destination) {
      goToDestinationPage(destination.id);
    } else {
      goToMainSite();
    }
  }, [destination, goToDestinationPage, goToMainSite]);

  const handleAnswer = useCallback(
    (questionIndex: number, answerId: string) => {
      const key = questions[questionIndex].id;
      const newAnswers = { ...answers, [key]: answerId };
      setAnswers(newAnswers);

      if (questionIndex < questions.length - 1) {
        setStep(`q-${questionIndex + 1}` as Step);
      } else {
        // Calculate recommendation
        const dest = getRecommendation(newAnswers);
        setDestination(dest);

        // Save to localStorage for the main site
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

  return (
    <div className="fixed inset-0 bg-[#070d15]">
      <CustomCursor />
      {/* Ambient Sound */}
      <AmbientSound track={SOUND_MAP[step] || "nature"} volume={0.12} />

      <AnimatePresence mode="wait">
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

      {/* Share Card Overlay */}
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
