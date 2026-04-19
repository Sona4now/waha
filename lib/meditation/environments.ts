/**
 * Meditation environments — visual + audio identity per biome.
 *
 * Sounds are hosted externally (freesound.org previews). A `media-src`
 * directive in next.config.ts must allow that domain.
 */

export type EnvId = "sea" | "desert" | "mountain" | "oasis";

export interface Environment {
  id: EnvId;
  name: string;
  emoji: string;
  particleColor: string;
  waveColor: string;
  soundLabel: string;
  /** Primary ambient loop (waves / wind / birds / stream) */
  ambientUrl: string;
  /** Gradient by time-of-session (visual progress cue) */
  gradients: {
    dawn: string;
    day: string;
    sunset: string;
    night: string;
  };
}

export const ENVIRONMENTS: Environment[] = [
  {
    id: "sea",
    name: "بحر سفاجا",
    emoji: "🌊",
    particleColor: "#38bdf8",
    waveColor: "rgba(56, 189, 248, 0.15)",
    soundLabel: "أمواج البحر",
    ambientUrl:
      "https://cdn.freesound.org/previews/527/527415_2485975-lq.mp3",
    gradients: {
      dawn: "from-[#1e3a5a] via-[#2d6187] to-[#0c4a6e]",
      day: "from-[#0c4a6e] via-[#1d5770] to-[#0a3d5c]",
      sunset: "from-[#7c2d12] via-[#1d5770] to-[#0c4a6e]",
      night: "from-[#020617] via-[#0c2d48] to-[#0a1628]",
    },
  },
  {
    id: "desert",
    name: "صحراء سيوة",
    emoji: "🏜️",
    particleColor: "#fbbf24",
    waveColor: "rgba(251, 191, 36, 0.10)",
    soundLabel: "رياح الصحراء",
    ambientUrl:
      "https://cdn.freesound.org/previews/370/370293_4397472-lq.mp3",
    gradients: {
      dawn: "from-[#92400e] via-[#b45309] to-[#78350f]",
      day: "from-[#78350f] via-[#92400e] to-[#451a03]",
      sunset: "from-[#9a3412] via-[#c2410c] to-[#78350f]",
      night: "from-[#1c1917] via-[#292524] to-[#0c0a09]",
    },
  },
  {
    id: "mountain",
    name: "جبال سيناء",
    emoji: "⛰️",
    particleColor: "#a8a29e",
    waveColor: "rgba(168, 162, 158, 0.10)",
    soundLabel: "طيور الجبل",
    ambientUrl:
      "https://cdn.freesound.org/previews/398/398632_1648170-lq.mp3",
    gradients: {
      dawn: "from-[#44403c] via-[#57534e] to-[#292524]",
      day: "from-[#1c1917] via-[#44403c] to-[#292524]",
      sunset: "from-[#78350f] via-[#44403c] to-[#1c1917]",
      night: "from-[#0c0a09] via-[#1c1917] to-[#0a0a0a]",
    },
  },
  {
    id: "oasis",
    name: "واحة الفيوم",
    emoji: "🌴",
    particleColor: "#34d399",
    waveColor: "rgba(52, 211, 153, 0.10)",
    soundLabel: "مياه وعصافير",
    ambientUrl:
      "https://cdn.freesound.org/previews/531/531952_10600515-lq.mp3",
    gradients: {
      dawn: "from-[#065f46] via-[#047857] to-[#064e3b]",
      day: "from-[#064e3b] via-[#065f46] to-[#022c22]",
      sunset: "from-[#92400e] via-[#065f46] to-[#022c22]",
      night: "from-[#022c22] via-[#0a1f1a] to-[#0a0f0d]",
    },
  },
];

export function getEnvironment(id: EnvId | string): Environment {
  return ENVIRONMENTS.find((e) => e.id === id) || ENVIRONMENTS[0];
}
