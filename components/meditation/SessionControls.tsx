"use client";

import { useTranslations } from "@/components/site/LocaleProvider";

interface Props {
  playing: boolean;
  onToggle: () => void;
  onEnd: () => void;
  onSkip: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  elapsed: number;
  duration: number;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

/**
 * Bottom control bar — Play/Pause, Skip, End + voice toggle.
 * Elapsed / remaining clocks are readable at a glance.
 */
export default function SessionControls({
  playing,
  onToggle,
  onEnd,
  onSkip,
  voiceEnabled,
  onToggleVoice,
  elapsed,
  duration,
}: Props) {
  const { locale } = useTranslations();
  const remaining = Math.max(0, duration - elapsed);

  return (
    <div
      className="flex items-center justify-between gap-3 w-full max-w-md mx-auto"
      dir={locale === "en" ? "ltr" : "rtl"}
      role="group"
      aria-label={locale === "en" ? "Session controls" : "أدوات التحكم في الجلسة"}
    >
      {/* Elapsed */}
      <div className="text-white/80 font-mono text-sm bg-white/10 backdrop-blur rounded-full px-3 py-2 border border-white/10 w-16 text-center">
        {fmt(elapsed)}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleVoice}
          aria-pressed={voiceEnabled}
          aria-label={
            voiceEnabled
              ? locale === "en"
                ? "Mute guided voice"
                : "إيقاف الصوت الموجه"
              : locale === "en"
                ? "Enable guided voice"
                : "تشغيل الصوت الموجه"
          }
          className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${
            voiceEnabled
              ? "bg-[#91b149]/20 border-[#91b149]/50 text-[#91b149]"
              : "bg-white/5 border-white/10 text-white/40"
          }`}
        >
          <span className="text-lg">{voiceEnabled ? "🔊" : "🔇"}</span>
        </button>

        <button
          onClick={onSkip}
          aria-label={locale === "en" ? "Skip to next segment" : "تخطي للفقرة التالية"}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 flex items-center justify-center transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 20V4l-8 8 8 8zM9 20V4l-8 8 8 8z" />
          </svg>
        </button>

        <button
          onClick={onToggle}
          aria-label={
            playing
              ? locale === "en"
                ? "Pause"
                : "إيقاف مؤقت"
              : locale === "en"
                ? "Play"
                : "تشغيل"
          }
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#91b149] to-[#6a8435] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(145,177,73,0.45)] hover:scale-105 active:scale-95 transition-transform"
        >
          {playing ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={onEnd}
          aria-label={locale === "en" ? "End session" : "إنهاء الجلسة"}
          className="w-11 h-11 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 text-white/50 hover:text-red-300 flex items-center justify-center transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="6" width="12" height="12" rx="1.5" />
          </svg>
        </button>
      </div>

      {/* Remaining */}
      <div className="text-white/50 font-mono text-sm bg-white/10 backdrop-blur rounded-full px-3 py-2 border border-white/10 w-16 text-center">
        -{fmt(remaining)}
      </div>
    </div>
  );
}
