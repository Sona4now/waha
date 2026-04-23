/**
 * Lightweight destination schema used ONLY by the cinematic intro flow
 * (app/page.tsx, ShareCard, RevealScreen, TransitionScreen, Teaser360).
 *
 * For the full site, import from `@/data/siteData` (DestinationFull).
 * Kept separate because these only need visual metadata (poem, panorama,
 * gradient) — not treatments, benefits, or FAQ.
 */
export type Destination = {
  id: string;
  name: string;
  subtitle: string;
  poem: string;
  gradient: string;
  color: string;
  panorama: string;
};

export const destinations: Record<string, Destination> = {
  safaga: {
    id: "safaga",
    name: "سفاجا",
    subtitle: "حيث يبدأ الجسد في التذكّر",
    poem: "مياهها تعرف ما تحتاجه قبل أن تسأل.",
    gradient: "from-cyan-950 via-blue-900 to-teal-900",
    color: "#0e7490",
    panorama:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  },
  siwa: {
    id: "siwa",
    name: "سيوة",
    subtitle: "حيث الصمت يتكلّم",
    poem: "في قلب الصحراء، تجد ما فقدته في الضوضاء.",
    gradient: "from-amber-950 via-yellow-900 to-orange-900",
    color: "#92400e",
    panorama:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80",
  },
  sinai: {
    id: "sinai",
    name: "سيناء",
    subtitle: "حيث تلمس السماء والأرض معاً",
    poem: "الجبال لا تعجل — وهي تعلّمك ذلك.",
    gradient: "from-stone-950 via-slate-900 to-zinc-900",
    color: "#44403c",
    panorama:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  },
  fayoum: {
    id: "fayoum",
    name: "الفيوم",
    subtitle: "واحة الروح الهادئة",
    poem: "حيث يختلط الماء بالرمل وتُولد اللحظة.",
    gradient: "from-emerald-950 via-green-900 to-teal-900",
    color: "#065f46",
    panorama:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80",
  },
  bahariya: {
    id: "bahariya",
    name: "الواحات البحرية",
    subtitle: "حيث الصحراء تحتضنك",
    poem: "في الصحراء البيضاء، كل شيء يعود إلى أصله.",
    gradient: "from-orange-950 via-amber-900 to-yellow-900",
    color: "#b45309",
    panorama:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80",
  },
  "wadi-degla": {
    id: "wadi-degla",
    name: "وادي دجلة",
    subtitle: "صمت الصحراء على أطراف المدينة",
    poem: "قريب جداً، وكأنه بعيد عن كل شيء.",
    gradient: "from-stone-900 via-zinc-900 to-neutral-900",
    color: "#78716c",
    panorama:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1920&q=80",
  },
  "shagie-farms": {
    id: "shagie-farms",
    name: "مزارع شجيع",
    subtitle: "حيث الشفاء يبدأ من الأرض",
    poem: "في ظل الأشجار، يتعلم الجسد أن يتنفس ببطء.",
    gradient: "from-lime-950 via-emerald-900 to-green-900",
    color: "#3f6212",
    panorama:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
  },
};
