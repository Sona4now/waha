"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getSession,
  getTimings,
  type Session,
} from "@/lib/meditation/sessions";
import { getEnvironment } from "@/lib/meditation/environments";
import { useBreathCycle } from "@/hooks/meditation/useBreathCycle";
import { useSessionTimer } from "@/hooks/meditation/useSessionTimer";
import { useSessionAudio } from "@/hooks/meditation/useSessionAudio";
import { useVoiceNarrator } from "@/hooks/meditation/useVoiceNarrator";
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
  onComplete: (
    elapsed: number,
    fullyCompleted: boolean,
    breathCycles: number,
  ) => void;
}

/**
 * Immersive meditation experience.
 *
 * Visual layers (back → front):
 *   · Video backdrop (optional) OR cross-fading gradient
 *   · Subtle wave particle
 *   · Breathing orb (center)
 *   · Caption text (when voice muted)
 *   · Auto-hiding top bar + bottom controls
 *
 * Audio layers handled by `useSessionAudio`:
 *   · Ambient music loop (auto-ducks when VO speaks)
 *   · Timed VO clips (MP3 → Web Speech fallback)
 *   · Start/end chimes
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
  const [mixer, setMixer] = useState<MixerState>({
    ambient: initialSettings.volumeAmbient,
    chimes: initialSettings.volumeChimes,
    voice: initialSettings.volumeVoice,
  });
  const [voiceEnabled, setVoiceEnabled] = useState(initialSettings.voiceEnabled);
  const [showMixer, setShowMixer] = useState(false);
  const [uiHidden, setUiHidden] = useState(false);
  const startChimePlayed = useRef(false);

  // Auto-hide UI after 4s of inactivity (zen mode)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const reset = () => {
      setUiHidden(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setUiHidden(true), 4000);
    };
    reset();
    window.addEventListener("pointermove", reset, { passive: true });
    window.addEventListener("touchstart", reset, { passive: true });
    return () => {
      window.removeEventListener("pointermove", reset);
      window.removeEventListener("touchstart", reset);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
  }, []);

  // Persist settings
  useEffect(() => {
    onSettingsChange({
      voiceEnabled,
      volumeAmbient: mixer.ambient,
      volumeChimes: mixer.chimes,
      volumeVoice: mixer.voice,
    });
  }, [voiceEnabled, mixer, onSettingsChange]);

  // Web Speech narrator — primary narration source (we don't ship MP3 VO
  // files; everything runs locally through the browser's TTS).
  const { speak, stop: stopSpeech, unlock: unlockSpeech } = useVoiceNarrator({
    enabled: voiceEnabled,
    volume: mixer.voice / 100,
  });

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
      playEnd();
      onComplete(session.duration, true, breathCycles + 1);
    },
  });

  // Fully-procedural 3-layer audio engine. Zero files, zero network.
  const { currentClipIdx, playStart, playEnd } = useSessionAudio({
    session,
    playing,
    elapsed,
    intro,
    voiceEnabled,
    volumeAmbient: mixer.ambient,
    volumeChimes: mixer.chimes,
    volumeVoice: mixer.voice,
    speak,
    stopSpeech,
  });

  const currentCaption =
    currentClipIdx >= 0 ? session.voClips[currentClipIdx]?.text ?? "" : "";

  // 3-2-1 intro countdown.
  // The intro exists partly as UX (deep breath before we begin) and partly
  // to unlock the browser audio pipeline from the user's original tap —
  // iOS Safari drops the first speech/audio attempt otherwise.
  useEffect(() => {
    if (!intro) return;
    if (countdown === 3) {
      // We're still in the same tick as the "Start" tap → warm up speech.
      unlockSpeech();
    }
    if (countdown <= 0) {
      setIntro(false);
      if (!startChimePlayed.current) {
        startChimePlayed.current = true;
        playStart();
      }
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [intro, countdown, playStart, unlockSpeech]);

  // Haptic on breath phase change
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

  function togglePlay() {
    setPlaying((p) => !p);
  }

  function endNow() {
    playEnd();
    onComplete(elapsed, false, breathCycles);
  }

  // Progress-based gradient cue
  const gradientKey =
    progress < 0.2
      ? "dawn"
      : progress < 0.55
        ? "day"
        : progress < 0.85
          ? "sunset"
          : "night";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 overflow-hidden select-none bg-[#070d15]"
      dir="rtl"
      aria-label={`جلسة ${session.name}`}
    >
      {/* ── Cross-fade gradient backdrop ──
           The gradient shifts slowly across the session (dawn → day → sunset
           → night) giving a sense of time passing without needing any video
           files. This is the whole visual layer — no assets loaded. */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {(["dawn", "day", "sunset", "night"] as const).map((g) => (
          <div
            key={g}
            className={`absolute inset-0 bg-gradient-to-b ${env.gradients[g]} transition-opacity duration-[4000ms] ease-in-out`}
            style={{ opacity: g === gradientKey ? 1 : 0 }}
          />
        ))}
      </div>

      {/* ── Subtle wave particle ── */}
      {!reduceMotion && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute left-0 right-0 h-1/3 bottom-0 rounded-[50%] opacity-20"
            style={{ background: env.waveColor, transform: "scale(1.5)" }}
          />
        </div>
      )}

      {/* ── Top bar (auto-hides) ── */}
      <motion.div
        animate={{ opacity: uiHidden && !intro ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4"
        style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}
      >
        <button
          onClick={endNow}
          className="text-white/70 hover:text-white text-xs bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10 transition-colors"
          aria-label="إنهاء الجلسة"
        >
          ✕ إنهاء
        </button>
        <div className="text-white/70 text-xs font-display bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
          {env.emoji} {session.name}
        </div>
        <button
          onClick={() => setShowMixer((s) => !s)}
          aria-pressed={showMixer}
          aria-label="إعدادات الصوت"
          className="text-white/70 hover:text-white text-xs bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full w-9 h-9 border border-white/10 flex items-center justify-center transition-colors"
        >
          🎚️
        </button>
      </motion.div>

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
            <div className="text-white font-display font-black text-9xl leading-none drop-shadow-2xl">
              {countdown > 0 ? countdown : "•"}
            </div>
            <div className="text-white/60 text-sm mt-6 max-w-xs mx-auto">
              خد وضعية مريحة واغمض عينيك لو حبيت
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          {/* ── Breathing orb ── */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <BreathingOrb
              phase={phase}
              timings={timings}
              progress={progress}
              reduceMotion={reduceMotion}
              narrationLine={currentCaption}
            />
          </div>

          {/* ── Caption (always visible) ──
               Narration is delivered via Web Speech which varies by browser;
               the caption is the guaranteed reliable channel. Tint is subtle
               when voice is on (redundant with audio) and stronger when muted. */}
          <AnimatePresence mode="wait">
            {currentCaption && (
              <motion.div
                key={currentCaption}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-32 md:bottom-36 left-4 right-4 z-20 text-center pointer-events-none"
              >
                <p
                  className={`text-sm md:text-base leading-relaxed max-w-md mx-auto backdrop-blur-md rounded-2xl px-5 py-3 border transition-colors ${
                    voiceEnabled
                      ? "bg-black/25 border-white/10 text-white/75"
                      : "bg-black/45 border-white/15 text-white/90"
                  }`}
                >
                  {currentCaption}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Mixer drawer ── */}
          <AnimatePresence>
            {showMixer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute top-24 right-4 z-30 w-[280px]"
              >
                <AmbientMixer
                  mixer={mixer}
                  onMixerChange={setMixer}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Bottom controls (auto-hide) ── */}
          <motion.div
            animate={{ opacity: uiHidden ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-8 left-0 right-0 z-30 px-4"
            style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}
          >
            <SessionControls
              playing={playing}
              onToggle={togglePlay}
              onEnd={endNow}
              onSkip={() => {
                // The audio engine handles its own internal scheduling;
                // a "skip" here just cancels any current VO via Web Speech
                // or short-circuits by nudging. Simplest: silent no-op.
              }}
              voiceEnabled={voiceEnabled}
              onToggleVoice={() => setVoiceEnabled((v) => !v)}
              elapsed={elapsed}
              duration={session.duration}
            />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
