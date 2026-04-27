"use client";

import { useTranslations } from "@/components/site/LocaleProvider";

export interface MixerState {
  ambient: number; // 0-100
  chimes: number;
  voice: number;
}

interface Props {
  mixer: MixerState;
  onMixerChange: (next: MixerState) => void;
  /** Sleep-mode toggle — when on, the end chime is suppressed so it doesn't
   *  wake a user who dozed off during the session. */
  sleepTimer?: boolean;
  onSleepTimerChange?: (v: boolean) => void;
}

/**
 * Pure UI mixer — three sliders wired to parent state.
 *
 * Audio playback is entirely owned by `useSessionAudio` (procedural ambient
 * via Web Audio API + Web Speech narrator + synthesized chimes). This
 * component is just controls; changing a slider updates `mixer.*` in parent
 * state and each audio layer reacts to its own value.
 *
 * Deliberately stateless + no AudioContext — this is safe to mount/unmount
 * without affecting what the user is hearing.
 */
export default function AmbientMixer({
  mixer,
  onMixerChange,
  sleepTimer,
  onSleepTimerChange,
}: Props) {
  const { locale } = useTranslations();

  function patch(p: Partial<MixerState>) {
    onMixerChange({ ...mixer, ...p });
  }

  const sliders: {
    key: keyof MixerState;
    label: string;
    icon: string;
    value: number;
  }[] = [
    { key: "ambient", label: locale === "en" ? "Nature" : "الطبيعة", icon: "🌊", value: mixer.ambient },
    { key: "chimes", label: locale === "en" ? "Chimes" : "النواقيس", icon: "🔔", value: mixer.chimes },
    { key: "voice", label: locale === "en" ? "Voice" : "الصوت", icon: "🎙️", value: mixer.voice },
  ];

  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      <div className="text-white/60 text-[10px] uppercase tracking-[0.3em] mb-1">
        Mixer
      </div>
      {sliders.map((s) => (
        <div key={s.key} className="flex items-center gap-3">
          <span className="text-base w-6 text-center" aria-hidden>
            {s.icon}
          </span>
          <span className="text-white/80 text-xs font-bold w-14 flex-shrink-0">
            {s.label}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={s.value}
            onChange={(e) => patch({ [s.key]: Number(e.target.value) })}
            aria-label={`${s.label} — ${s.value}%`}
            aria-valuetext={locale === "en" ? `${s.value} percent` : `${s.value} بالمية`}
            className="flex-1 h-1.5 appearance-none bg-white/10 rounded-full outline-none
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(255,255,255,0.4)]
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <span className="text-white/60 text-[10px] font-mono w-8 text-left">
            {s.value}
          </span>
        </div>
      ))}

      {/* Sleep mode toggle — suppresses the end chime so it doesn't wake you up */}
      {onSleepTimerChange && (
        <button
          type="button"
          onClick={() => onSleepTimerChange(!sleepTimer)}
          aria-pressed={!!sleepTimer}
          className={`mt-2 flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            sleepTimer
              ? "bg-[#91b149]/20 border border-[#91b149]/40 text-[#91b149]"
              : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-base">🌙</span>
            <span>{locale === "en" ? "Sleep mode" : "وضع النوم"}</span>
          </span>
          <span
            className={`relative inline-block w-9 h-5 rounded-full transition-colors ${
              sleepTimer ? "bg-[#91b149]" : "bg-white/15"
            }`}
            aria-hidden="true"
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                sleepTimer ? "right-0.5" : "right-[18px]"
              }`}
            />
          </span>
        </button>
      )}
    </div>
  );
}
