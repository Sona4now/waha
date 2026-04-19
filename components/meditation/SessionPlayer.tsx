"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getSession, getTimings, type Session } from "@/lib/meditation/sessions";
import { getEnvironment } from "@/lib/meditation/environments";
import { useBreathCycle } from "@/hooks/meditation/useBreathCycle";
import { useSessionTimer } from "@/hooks/meditation/useSessionTimer";
import { useVoiceNarrator } from "@/hooks/meditation/useVoiceNarrator";
import { playPhaseTick, playStartChime, playEndChime } from "@/lib/meditation/chimes";
import BreathingOrb from "./BreathingOrb";
import SessionControls from "./SessionControls";
import AmbientMixer, { type MixerState } from "./AmbientMixer";

interface Props {
  sessionId: string;
  initialSettings: {
    voiceEnabled: boolean;
    volumeAmbient: number;
    volumeChimes: number;
    volumeVoice: number;
  };
  onSettingsChange: (s: {
    voiceEnabled: boolean;
    volumeAmbient: number;
    volumeChimes: number;
    volumeVoice: number;
  }) => void;
  onComplete: (elapsed: number, fullyCompleted: boolean, breathCycles: number) => void;
}

/**
 * The active meditation experience — orb, narration, timer, controls.
 * All the stateful/side-effect work lives here.
 */
export default function SessionPlayer({
  sessionId,
  initialSettings,
  onSettingsChange,
  onComplete,
}: Props) {
  const session: Session = useMemo(() => getSession(sessionId), [sessionId]);
  const env = useMemo(() => getEnvironment(session.env), [session.env]);
  const timings = useMemo(() => getTimings(session), [session]);

  const [playing, setPlaying] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [intro, setIntro] = useState(true);
  const [breathCycles, setBreathCycles] = useState(0);
  const [narrationIdx, setNarrationIdx] = useState(0);
  const [mixer, setMixer] = useState<MixerState>({
    ambient: initialSettings.volumeAmbient,
    chimes: initialSettings.volumeChimes,
    voice: initialSettings.volumeVoice,
  });
  const [voiceEnabled, setVoiceEnabled] = useState(initialSettings.voiceEnabled);
  const [showMixer, setShowMixer] = useState(false);
  const startChimePlayed = useRef(false);

  // Prefers-reduced-motion
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // Persist settings whenever the user tweaks them.
  useEffect(() => {
    onSettingsChange({
      voiceEnabled,
      volumeAmbient: mixer.ambient,
      volumeChimes: mixer.chimes,
      volumeVoice: mixer.voice,
    });
  }, [voiceEnabled, mixer, onSettingsChange]);

  // Narration (Web Speech)
  const { speak, stop: stopVoice } = useVoiceNarrator({
    enabled: voiceEnabled,
    volume: mixer.voice / 100,
  });

  // 3-2-1 intro countdown
  useEffect(() => {
    if (!intro) return;
    if (countdown <= 0) {
      setIntro(false);
      if (!startChimePlayed.current) {
        startChimePlayed.current = true;
        playStartChime(mixer.chimes / 100);
        // First narration line (only on full narration sessions)
        if (session.narration[0]) {
          setTimeout(() => speak(session.narration[0]), 900);
        }
      }
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [intro, countdown, mixer.chimes, speak, session.narration]);

  // Breath cycle
  const { phase } = useBreathCycle({
    active: playing && !intro,
    timings,
    onCycleComplete: () => setBreathCycles((c) => c + 1),
  });

  // Session timer
  const { elapsed, progress } = useSessionTimer({
    active: playing && !intro,
    durationSec: session.duration,
    onComplete: () => {
      playEndChime(mixer.chimes / 100);
      onComplete(session.duration, true, breathCycles + 1);
    },
  });

  // Chimes on each "in" phase (optional subtle tick)
  const lastPhaseRef = useRef(phase);
  useEffect(() => {
    if (!playing || intro) return;
    if (phase !== lastPhaseRef.current && phase === "in" && mixer.chimes > 0) {
      playPhaseTick((mixer.chimes / 100) * 0.4);
    }
    lastPhaseRef.current = phase;
  }, [phase, playing, intro, mixer.chimes]);

  // Advance narration over time, distributed across the session duration.
  useEffect(() => {
    if (intro || !playing) return;
    if (session.narration.length <= 1) return;
    const interval = Math.max(
      12,
      Math.floor(session.duration / session.narration.length),
    );
    const t = setInterval(() => {
      setNarrationIdx((i) => {
        const next = Math.min(i + 1, session.narration.length - 1);
        if (next !== i) speak(session.narration[next]);
        return next;
      });
    }, interval * 1000);
    return () => clearInterval(t);
  }, [intro, playing, session.duration, session.narration, speak]);

  // Haptic on breath phase — only on actual phase change.
  const vibratedPhaseRef = useRef<string>("");
  useEffect(() => {
    if (!playing || intro) return;
    if (phase === vibratedPhaseRef.current) return;
    vibratedPhaseRef.current = phase;
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(phase === "in" ? 25 : phase === "out" ? 18 : 10);
      } catch {}
    }
  }, [phase, playing, intro]);

  // Stop voice if muted
  useEffect(() => {
    if (!voiceEnabled) stopVoice();
  }, [voiceEnabled, stopVoice]);

  function togglePlay() {
    setPlaying((p) => !p);
    if (playing) stopVoice();
  }

  function skipLine() {
    const next = Math.min(narrationIdx + 1, session.narration.length - 1);
    setNarrationIdx(next);
    speak(session.narration[next]);
  }

  function endNow() {
    stopVoice();
    playEndChime(mixer.chimes / 100);
    onComplete(elapsed, false, breathCycles);
  }

  // Time-of-session gradient cue
  const gradientKey =
    progress < 0.2
      ? "dawn"
      : progress < 0.55
        ? "day"
        : progress < 0.85
          ? "sunset"
          : "night";
  const gradient = env.gradients[gradientKey];

  return (
    <div
      className={`fixed inset-0 overflow-hidden select-none`}
      dir="rtl"
      aria-label={`جلسة ${session.name}`}
    >
      {/* ── Cross-fade gradient layer (no remount) ── */}
      {(["dawn", "day", "sunset", "night"] as const).map((g) => (
        <div
          key={g}
          className={`absolute inset-0 bg-gradient-to-b ${env.gradients[g]} transition-opacity duration-[4000ms] ease-in-out`}
          style={{ opacity: g === gradientKey ? 1 : 0 }}
          aria-hidden="true"
        />
      ))}

      {/* ── Subtle animated particles (disabled for reduced motion) ── */}
      {!reduceMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute left-0 right-0 h-1/3 bottom-0 rounded-[50%] opacity-20"
            style={{ background: env.waveColor, transform: "scale(1.5)" }}
          />
        </motion.div>
      )}

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4">
        <button
          onClick={endNow}
          className="text-white/60 hover:text-white text-xs bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10 transition-colors"
          aria-label="إنهاء الجلسة"
        >
          ✕ إنهاء
        </button>
        <div className="text-white/60 text-xs font-display bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
          {env.emoji} {session.name}
        </div>
        <button
          onClick={() => setShowMixer((s) => !s)}
          aria-pressed={showMixer}
          aria-label="إعدادات الصوت"
          className="text-white/60 hover:text-white text-xs bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-full w-9 h-9 border border-white/10 flex items-center justify-center transition-colors"
        >
          🎚️
        </button>
      </div>

      {/* ── Intro countdown ── */}
      {intro ? (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div
            key={countdown}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-white/60 text-xs uppercase tracking-[0.4em] mb-4">
              استعد...
            </div>
            <div className="text-white font-display font-black text-9xl leading-none">
              {countdown > 0 ? countdown : "•"}
            </div>
            <div className="text-white/50 text-sm mt-6 max-w-xs mx-auto">
              خد وضعية مريحة واغمض عينيك لو حبيت
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          {/* ── Center orb ── */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <BreathingOrb
              phase={phase}
              timings={timings}
              progress={progress}
              reduceMotion={reduceMotion}
              narrationLine={session.narration[narrationIdx]}
            />
          </div>

          {/* ── Mixer drawer ── */}
          {showMixer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-20 right-4 z-30 w-[280px]"
            >
              <AmbientMixer
                ambientUrl={env.ambientUrl}
                playing={playing}
                mixer={mixer}
                onMixerChange={setMixer}
              />
            </motion.div>
          )}
          {/* Always-mounted (hidden) mixer so audio keeps playing when drawer is closed */}
          {!showMixer && (
            <div className="absolute -top-[9999px] left-0 opacity-0 pointer-events-none">
              <AmbientMixer
                ambientUrl={env.ambientUrl}
                playing={playing}
                mixer={mixer}
                onMixerChange={setMixer}
              />
            </div>
          )}

          {/* ── Controls ── */}
          <div className="absolute bottom-8 left-0 right-0 z-30 px-4">
            <SessionControls
              playing={playing}
              onToggle={togglePlay}
              onEnd={endNow}
              onSkip={skipLine}
              voiceEnabled={voiceEnabled}
              onToggleVoice={() => setVoiceEnabled((v) => !v)}
              elapsed={elapsed}
              duration={session.duration}
            />
          </div>
        </>
      )}
    </div>
  );
}
