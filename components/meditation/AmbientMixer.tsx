"use client";

export interface MixerState {
  ambient: number; // 0-100
  chimes: number;
  voice: number;
}

interface Props {
  mixer: MixerState;
  onMixerChange: (next: MixerState) => void;
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
export default function AmbientMixer({ mixer, onMixerChange }: Props) {
  function patch(p: Partial<MixerState>) {
    onMixerChange({ ...mixer, ...p });
  }

  const sliders: {
    key: keyof MixerState;
    label: string;
    icon: string;
    value: number;
  }[] = [
    { key: "ambient", label: "الطبيعة", icon: "🌊", value: mixer.ambient },
    { key: "chimes", label: "النواقيس", icon: "🔔", value: mixer.chimes },
    { key: "voice", label: "الصوت", icon: "🎙️", value: mixer.voice },
  ];

  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
      dir="rtl"
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
            aria-valuetext={`${s.value} بالمية`}
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
    </div>
  );
}
