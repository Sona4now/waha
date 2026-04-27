/**
 * Lightweight destination schema used ONLY by the cinematic intro flow
 * (app/page.tsx, ShareCard, RevealScreen, TransitionScreen, Teaser360).
 *
 * For the full site, import from `@/data/siteData` (DestinationFull).
 * Kept separate because these only need visual metadata (poem, panorama,
 * gradient) — not treatments, benefits, or FAQ.
 *
 * Each destination has both Arabic source copy and an English overlay
 * (`nameEn` / `subtitleEn` / `poemEn`). Use `localizeIntroDestination` to
 * get a locale-aware view.
 */
export type Destination = {
  id: string;
  name: string;
  subtitle: string;
  poem: string;
  /** English name override (optional). */
  nameEn?: string;
  subtitleEn?: string;
  poemEn?: string;
  gradient: string;
  color: string;
  panorama: string;
};

export const destinations: Record<string, Destination> = {
  safaga: {
    id: "safaga",
    name: "سفاجا",
    nameEn: "Safaga",
    subtitle: "حيث يبدأ الجسد في التذكّر",
    subtitleEn: "Where the body begins to remember",
    poem: "مياهها تعرف ما تحتاجه قبل أن تسأل.",
    poemEn: "Its waters know what you need before you ask.",
    gradient: "from-cyan-950 via-blue-900 to-teal-900",
    color: "#0e7490",
    panorama:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  },
  siwa: {
    id: "siwa",
    name: "سيوة",
    nameEn: "Siwa",
    subtitle: "حيث الصمت يتكلّم",
    subtitleEn: "Where silence speaks",
    poem: "في قلب الصحراء، تجد ما فقدته في الضوضاء.",
    poemEn: "In the heart of the desert, you find what you lost in the noise.",
    gradient: "from-amber-950 via-yellow-900 to-orange-900",
    color: "#92400e",
    panorama:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80",
  },
  sinai: {
    id: "sinai",
    name: "سيناء",
    nameEn: "Sinai",
    subtitle: "حيث تلمس السماء والأرض معاً",
    subtitleEn: "Where sky and earth touch as one",
    poem: "الجبال لا تعجل — وهي تعلّمك ذلك.",
    poemEn: "Mountains never rush — and they teach you the same.",
    gradient: "from-stone-950 via-slate-900 to-zinc-900",
    color: "#44403c",
    panorama:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  },
  fayoum: {
    id: "fayoum",
    name: "الفيوم",
    nameEn: "Fayoum",
    subtitle: "واحة الروح الهادئة",
    subtitleEn: "An oasis for a quiet soul",
    poem: "حيث يختلط الماء بالرمل وتُولد اللحظة.",
    poemEn: "Where water meets sand and the moment is born.",
    gradient: "from-emerald-950 via-green-900 to-teal-900",
    color: "#065f46",
    panorama:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80",
  },
  bahariya: {
    id: "bahariya",
    name: "الواحات البحرية",
    nameEn: "Bahariya Oasis",
    subtitle: "حيث الصحراء تحتضنك",
    subtitleEn: "Where the desert holds you close",
    poem: "في الصحراء البيضاء، كل شيء يعود إلى أصله.",
    poemEn: "In the White Desert, everything returns to its origin.",
    gradient: "from-orange-950 via-amber-900 to-yellow-900",
    color: "#b45309",
    panorama:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80",
  },
  "wadi-degla": {
    id: "wadi-degla",
    name: "وادي دجلة",
    nameEn: "Wadi Degla",
    subtitle: "صمت الصحراء على أطراف المدينة",
    subtitleEn: "Desert silence at the edge of the city",
    poem: "قريب جداً، وكأنه بعيد عن كل شيء.",
    poemEn: "So close — and yet far from everything.",
    gradient: "from-stone-900 via-zinc-900 to-neutral-900",
    color: "#78716c",
    panorama:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1920&q=80",
  },
  "shagie-farms": {
    id: "shagie-farms",
    name: "مزارع شجيع",
    nameEn: "Shagie Farms",
    subtitle: "حيث الشفاء يبدأ من الأرض",
    subtitleEn: "Where healing begins from the soil",
    poem: "في ظل الأشجار، يتعلم الجسد أن يتنفس ببطء.",
    poemEn: "In the shade of the trees, the body learns to breathe slowly.",
    gradient: "from-lime-950 via-emerald-900 to-green-900",
    color: "#3f6212",
    panorama:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
  },
};

/**
 * Pick the locale-aware view of a Destination — returns the original AR
 * source for `ar`, and overlays English fields for `en`.
 */
export function localizeIntroDestination(
  d: Destination,
  locale: "ar" | "en",
): Destination {
  if (locale !== "en") return d;
  return {
    ...d,
    name: d.nameEn ?? d.name,
    subtitle: d.subtitleEn ?? d.subtitle,
    poem: d.poemEn ?? d.poem,
  };
}
