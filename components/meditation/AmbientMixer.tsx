"use client";

import { useEffect, useRef } from "react";

export interface MixerState {
  ambient: number; // 0-100
  chimes: number;
  voice: number;
}

interface Props {
  ambientUrl: string;
  /** Whether audio should be playing (respects pause state). */
  playing: boolean;
  mixer: MixerState;
  onMixerChange: (next: MixerState) => void;
}

/**
 * Renders a hidden <audio> loop for the ambient track + three volume sliders.
 * Chimes and voice are triggered externally — we expose their volume values
 * via parent state so every audio element uses the same gain.
 */
export default function AmbientMixer({
  ambientUrl,
  playing,
  mixer,
  onMixerChange,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load/swap the source whenever the URL changes.
  useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.loop = true;
      a.preload = "auto";
      audioRef.current = a;
    }
    const a = audioRef.current;
    if (a.src !== ambientUrl) {
      a.src = ambientUrl;
      a.load();
    }
    return () => {
      a.pause();
    };
  }, [ambientUrl]);

  // Volume follows slider — divided by 100 to produce a 0..1 gain.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, mixer.ambient / 100));
    }
  }, [mixer.ambient]);

  // Play / pause reacts to parent state.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.play().catch(() => {
        /* autoplay blocked — user can retry via a gesture */
      });
    } else {
      a.pause();
    }
  }, [playing]);

  function patch(p: Partial<MixerState>) {
    onMixerChange({ ...mixer, ...p });
  }

  const sliders: {
    key: keyof MixerState;
    label: string;
    icon: string;
    value: number;
  }[] = [
    {
      key: "ambient",
      label: "الطبيعة",
      icon: "🌊",
      value: mixer.ambient,
    },
    {
      key: "chimes",
      label: "النواقيس",
      icon: "🔔",
      value: mixer.chimes,
    },
    {
      key: "voice",
      label: "الصوت",
      icon: "🎙️",
      value: mixer.voice,
    },
  ];

  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10"
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
