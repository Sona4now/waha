/**
 * Narrative chapter metadata for /destinations.
 *
 * The destinations page used to be a flat filter+grid surface — functional
 * but transactional. The chapter structure groups destinations into 4
 * sensory "elements" (sea / mountain / oasis / desert) with poetic
 * editorial intros, turning the page into a scrollable journey.
 *
 * Order matters: sea → mountain → oasis → desert traces a sensory arc
 * (water → air → green → silence) that mirrors how the body relaxes:
 * outer relief first, deeper stillness last.
 */

export interface EnvironmentChapter {
  /** Stable slug used as the React key + ARIA target. */
  key: "sea" | "mountain" | "oasis" | "desert";
  /** The exact `environment` string in DESTINATIONS that maps here. */
  matchesEnvironment: string[];
  /** Two-digit chapter number (٠١ ٠٢ etc.). */
  number: string;
  /** Single-word element name. */
  name: string;
  /** One-line poetic tagline shown over the hero. */
  tagline: string;
  /** Editorial opening paragraph (3-4 sentences, poetic, sensory). */
  intro: string;
  /** Emoji that anchors the chapter visually. */
  icon: string;
  /** Brand accent for chapter headings + chapter number. */
  accent: string;
  /** Hero background image URL — full-bleed parallax. */
  heroImage: string;
  /** Subtle CSS gradient over the hero for legibility of overlay text. */
  overlayGradient: string;
}

export const ENVIRONMENT_CHAPTERS: EnvironmentChapter[] = [
  {
    key: "sea",
    matchesEnvironment: ["بحر"],
    number: "٠١",
    name: "البحر",
    tagline: "حيث يذوب الالتهاب في ملح الأرض",
    intro:
      "على ساحل البحر الأحمر تتدفّق المياه الأعلى ملوحةً في العالم. الرمال السوداء تخزّن حرارة الشمس وتُفلت الالتهاب من تحت الجلد، والأشعة هنا أعمق طولاً موجياً مما هي على المتوسط — ولهذا اعتُمدت سفاجا دولياً لعلاج الصدفية. ملح، شمس، ومعدن — في توازن لا يعرفه إلا هذا الساحل.",
    icon: "🌊",
    accent: "#0369a1",
    heroImage:
      "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1920&q=80",
    overlayGradient:
      "linear-gradient(180deg, rgba(3,105,161,0.15) 0%, rgba(10,21,31,0.65) 70%, rgba(10,21,31,0.95) 100%)",
  },
  {
    key: "mountain",
    matchesEnvironment: ["جبال"],
    number: "٠٢",
    name: "الجبال",
    tagline: "على ارتفاع، يخسر الهواء شوائبه",
    intro:
      "على ارتفاع ألفي متر، الجهاز التنفسي يجد نفسه فجأة بدون عبء — لا حبوب لقاح، لا عوادم، لا غبار حضر. التنفس يتعمّق دون مجهود، والصدر يتّسع. جبال سيناء كانت ملجأ النبيّين والمتعَبين قبل آلاف السنين، ليس لأنها بعيدة بل لأنها تفصل الإنسان عن ضجيجه. هنا، الصمت دواء، والارتفاع علاج.",
    icon: "⛰️",
    accent: "#374151",
    heroImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
    overlayGradient:
      "linear-gradient(180deg, rgba(55,65,81,0.15) 0%, rgba(10,21,31,0.65) 70%, rgba(10,21,31,0.95) 100%)",
  },
  {
    key: "oasis",
    matchesEnvironment: ["واحة"],
    number: "٠٣",
    name: "الواحات",
    tagline: "حيث تنبت الحياة في أصعب الأماكن",
    intro:
      "في قلب الصحراء، خرجت من باطن الأرض عيون لا تتوقّف منذ آلاف السنين. سيوة، الفيوم، ومزارع شجيع — ثلاث واحات لا تجمعها جغرافيا واحدة، بل لغة مشتركة من المياه الكبريتية والأشجار المثمرة والحياة البطيئة. الواحة وعد بأن الجفاف ليس نهاية، وأن الراحة ممكنة حتى لو الأرض من حولك صحراء.",
    icon: "🌴",
    accent: "#065f46",
    heroImage:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80",
    overlayGradient:
      "linear-gradient(180deg, rgba(6,95,70,0.18) 0%, rgba(10,21,31,0.65) 70%, rgba(10,21,31,0.95) 100%)",
  },
  {
    key: "desert",
    matchesEnvironment: ["صحراء"],
    number: "٠٤",
    name: "الصحاري",
    tagline: "أعمق Reset عرفه الإنسان",
    intro:
      "الصحراء البيضاء، الصحراء السوداء، والكانيونات على أطراف القاهرة — مكان واحد بمناخ واحد: لا شيء. لا ضوضاء، لا إشعارات، لا أحد. التخييم تحت سماء غير ملوّثة بالضوء يعيد ضبط هرمون الميلاتونين، وملايين النجوم فوق رأسك تذكّر العقل بحجمه الحقيقي. أحياناً، أن لا تفعل شيئاً، هو أهم شيء.",
    icon: "🏜️",
    accent: "#92400e",
    heroImage:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80",
    overlayGradient:
      "linear-gradient(180deg, rgba(146,64,14,0.18) 0%, rgba(10,21,31,0.65) 70%, rgba(10,21,31,0.95) 100%)",
  },
];

/** Lookup helper: chapter key for a destination. */
export function chapterForEnvironment(
  env: string,
): EnvironmentChapter | undefined {
  return ENVIRONMENT_CHAPTERS.find((c) =>
    c.matchesEnvironment.includes(env),
  );
}
