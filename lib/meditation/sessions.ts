/**
 * Curated meditation sessions.
 *
 * Each session has a timed VO script (`voClips`) — the player schedules
 * audio playback at precise seconds into the session.  The `text` field
 * is both documentation AND the fallback for Web Speech when the real
 * MP3 hasn't been recorded yet.
 */

import type { EnvId } from "./environments";

export type Pattern = "478" | "box" | "breathe" | "bodyscan" | "guided";

export interface BreathTimings {
  /** seconds — inhale / hold1 / exhale / hold2  (use 0 to skip a phase) */
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

/** A single narrated moment inside a session */
export interface VoClip {
  /** File ID under /public/meditation/vo/ — without .mp3 extension */
  id: string;
  /** Seconds into the session when this clip should start playing */
  at: number;
  /** Approximate spoken duration (used to estimate end time) */
  estimatedDuration: number;
  /** Fallback text used by Web Speech when the real MP3 is missing.
   *  Also serves as subtitle / documentation. */
  text: string;
}

export interface Session {
  id: string;
  name: string;
  subtitle: string;
  /** Total duration in seconds */
  duration: number;
  pattern: Pattern;
  env: EnvId;
  icon: string;
  tag: "بداية" | "تهدئة" | "نوم" | "تركيز" | "تأمل" | "قلق" | "صباح";
  /** Narration timeline — clips play at their `at` timestamps */
  voClips: VoClip[];
  /** Optional explicit breath timings — defaults per pattern if omitted */
  timings?: BreathTimings;
  /** Short visible description in the library card */
  description?: string;
  /** Ambient music track (mp3). Loops for the whole session.
   *  Resolved from env.ambientUrl if not specified. */
  audioTrack?: string;
  /** Background video (webm) shown full-screen. Silent loop. */
  videoTrack?: string;
}

const DEFAULT_TIMINGS: Record<Pattern, BreathTimings> = {
  breathe: { inhale: 4, hold1: 2, exhale: 4, hold2: 0 },
  box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  "478": { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  bodyscan: { inhale: 5, hold1: 2, exhale: 5, hold2: 0 },
  guided: { inhale: 5, hold1: 2, exhale: 6, hold2: 0 },
};

export function getTimings(session: Session): BreathTimings {
  return session.timings ?? DEFAULT_TIMINGS[session.pattern];
}

/* ─────────────────────────────────────────────────────────
   Library — 10 sessions covering beginners → advanced
   ───────────────────────────────────────────────────────── */

export const SESSIONS: Session[] = [
  {
    id: "quick-calm",
    name: "البداية الهادئة",
    subtitle: "أول جلسة ليك — 3 دقايق",
    description: "لو ده أول تأمل ليك، ابدأ هنا. مفيش ضغط.",
    duration: 180,
    pattern: "breathe",
    env: "sea",
    icon: "🌱",
    tag: "بداية",
    voClips: [
      {
        id: "quick-calm__intro",
        at: 0,
        estimatedDuration: 15,
        text: "أهلاً بيك في أول جلسة ليك. مش محتاج تكون خبير. بس خد وضعية مريحة، وخليني أمشي معاك.",
      },
      {
        id: "quick-calm__guide-1",
        at: 30,
        estimatedDuration: 20,
        text: "بص حواليك. لاحظ شكل المكان. دلوقتي، غمّض عينيك لو قدرت.",
      },
      {
        id: "quick-calm__guide-2",
        at: 60,
        estimatedDuration: 25,
        text: "خد نفس عميق من أنفك. حس الهوا. ولما تزفر، خليه يطلع من فمك. اتخيل إن كل زفير بيطلع معاه ضغط اليوم.",
      },
      {
        id: "quick-calm__guide-3",
        at: 100,
        estimatedDuration: 20,
        text: "مفيش حاجة لازمة منك دلوقتي. بس تتنفس. بس تكون موجود.",
      },
      {
        id: "quick-calm__guide-4",
        at: 140,
        estimatedDuration: 15,
        text: "افتكر، التنفس ده معاك طول حياتك. تقدر ترجع له في أي لحظة.",
      },
      {
        id: "quick-calm__outro",
        at: 170,
        estimatedDuration: 10,
        text: "ببطء، خد نفس أخير عميق، وارجع لليوم بتاعك.",
      },
    ],
  },

  {
    id: "box-focus",
    name: "تهدئة سريعة",
    subtitle: "قبل اجتماع أو امتحان — 5 دقايق",
    description: "تمرين التنفس المربع — نفس طريقة الـ Navy SEALs.",
    duration: 300,
    pattern: "box",
    env: "sea",
    icon: "⬜",
    tag: "تركيز",
    voClips: [
      {
        id: "box-focus__intro",
        at: 0,
        estimatedDuration: 15,
        text: "خمس دقايق، وهترجع لأي حاجة بعدها بصفاء ذهن مختلف.",
      },
      {
        id: "box-focus__guide-1",
        at: 30,
        estimatedDuration: 30,
        text: "شهيق 4 ثواني، إمسك 4، زفير 4، إمسك 4. 4-4-4-4.",
      },
      {
        id: "box-focus__guide-2",
        at: 80,
        estimatedDuration: 20,
        text: "لو ذهنك سرح، عادي. ارجّعه بهدوء للتنفس. بدون لوم.",
      },
      {
        id: "box-focus__guide-3",
        at: 150,
        estimatedDuration: 25,
        text: "إنت دلوقتي بتفعّل جهاز الاسترخاء في جسمك. كل دورة بتخلّي عقلك أوضح.",
      },
      {
        id: "box-focus__guide-4",
        at: 210,
        estimatedDuration: 20,
        text: "افتكر اللحظة دي. لما ترجع للشغل، كفاية نفس واحد وترجع حاضر.",
      },
      {
        id: "box-focus__outro",
        at: 280,
        estimatedDuration: 15,
        text: "ببطء، خد نفس عادي، افتح عينيك، وفضّل الصفاء ده معاك.",
      },
    ],
  },

  {
    id: "sleep-478",
    name: "قبل النوم",
    subtitle: "للأرق والتفكير الليلي — 10 دقايق",
    description: "تقنية 4-7-8 — معتمدة طبياً لتسريع النوم.",
    duration: 600,
    pattern: "478",
    env: "oasis",
    icon: "🌙",
    tag: "نوم",
    voClips: [
      {
        id: "sleep-478__intro",
        at: 0,
        estimatedDuration: 20,
        text: "الليلة هادية. لو عقلك بيفكر، عادي. احنا هنقوله يستريح.",
      },
      {
        id: "sleep-478__guide-1",
        at: 40,
        estimatedDuration: 30,
        text: "شهيق من أنفك 4 ثواني، إمسك 7، زفير طويل 8. الزفير أطول من الشهيق — ده مفتاح النوم.",
      },
      {
        id: "sleep-478__guide-2",
        at: 120,
        estimatedDuration: 25,
        text: "أفكار اليوم بتيجي؟ خليها تعدي زي عربيات على طريق بعيد. مش محتاج تلحقهم.",
      },
      {
        id: "sleep-478__guide-3",
        at: 210,
        estimatedDuration: 30,
        text: "جسمك بيدخل في وضع الراحة. قلبك بيبطّأ. جفونك ثقيلة.",
      },
      {
        id: "sleep-478__guide-4",
        at: 300,
        estimatedDuration: 25,
        text: "بكرة يوم جديد. دلوقتي دورك إنك ترتاح. بس دي.",
      },
      {
        id: "sleep-478__guide-5",
        at: 420,
        estimatedDuration: 20,
        text: "لو عقلك سرح، ارجعه برفق. مفيش صح وغلط.",
      },
      {
        id: "sleep-478__outro",
        at: 560,
        estimatedDuration: 25,
        text: "هفضّلك هنا. التنفس هيكمل معاك لحد ما تنام. تصبح على خير.",
      },
    ],
  },

  {
    id: "body-scan",
    name: "مسح الجسم",
    subtitle: "تأمل موجه — 10 دقايق",
    description: "هنمشي بالـ attention من فوق لتحت، نلاحظ كل جزء.",
    duration: 600,
    pattern: "bodyscan",
    env: "mountain",
    icon: "🧘",
    tag: "تأمل",
    voClips: [
      {
        id: "body-scan__intro",
        at: 0,
        estimatedDuration: 20,
        text: "هنعمل Body Scan. هنمشي بالـ attention من فوق لتحت. بدون حكم. بس ملاحظة.",
      },
      {
        id: "body-scan__guide-head",
        at: 30,
        estimatedDuration: 30,
        text: "ابدأ من فوق راسك. جبينك، حوالين عينيك، فكك. سيبهم كلهم يرتخوا.",
      },
      {
        id: "body-scan__guide-neck",
        at: 90,
        estimatedDuration: 25,
        text: "رقبتك. دورّها ببطء. كتفيك، ارفعهم وسيبهم ينزلوا.",
      },
      {
        id: "body-scan__guide-chest",
        at: 150,
        estimatedDuration: 30,
        text: "صدرك. حس القلب. الأنفاس بتدخل وتطلع. إنت مش بتتنفس — إنت بيتم تنفسك.",
      },
      {
        id: "body-scan__guide-abdomen",
        at: 210,
        estimatedDuration: 30,
        text: "بطنك. ترتفع مع الشهيق، تنخفض مع الزفير. إيقاع قديم موجود فيك من يوم ما اتولدت.",
      },
      {
        id: "body-scan__guide-back",
        at: 285,
        estimatedDuration: 25,
        text: "ظهرك. لو فيه توتر، تنفس فيه. كل زفير بيفك عقدة صغيرة.",
      },
      {
        id: "body-scan__guide-arms",
        at: 345,
        estimatedDuration: 25,
        text: "ذراعيك. من الكتف للأصابع. حس الطاقة بتسري فيهم.",
      },
      {
        id: "body-scan__guide-legs",
        at: 405,
        estimatedDuration: 30,
        text: "فخاديك، ركبك، قدمك. كل جزء، شكراً إنه شايلك طول اليوم.",
      },
      {
        id: "body-scan__guide-whole",
        at: 480,
        estimatedDuration: 30,
        text: "دلوقتي، حس جسمك كله مرة واحدة. خفيف، مرتخي، في أمان.",
      },
      {
        id: "body-scan__outro",
        at: 560,
        estimatedDuration: 25,
        text: "افتكر الإحساس ده. ده إنت لما بتسيب نفسك ترتاح. ببطء، ارجع.",
      },
    ],
  },

  {
    id: "beach-visualization",
    name: "رحلة الشاطئ",
    subtitle: "تخيل موجه لسفاجا — 10 دقايق",
    description: "هخدك لشط سفاجا وقت الغروب.",
    duration: 600,
    pattern: "guided",
    env: "sea",
    icon: "🏖️",
    tag: "تأمل",
    voClips: [
      {
        id: "beach-visualization__intro",
        at: 0,
        estimatedDuration: 20,
        text: "دلوقتي، هخدك لمكان. مش في خيالك — في ذاكرتك. شط سفاجا وقت الغروب.",
      },
      {
        id: "beach-visualization__guide-1",
        at: 30,
        estimatedDuration: 30,
        text: "إنت واقف على الرمل. الرمل الأسود دافي تحت رجليك. البحر قدامك هادي.",
      },
      {
        id: "beach-visualization__guide-2",
        at: 90,
        estimatedDuration: 35,
        text: "اسمع موجة جاية. بتقرب، بتبوس الشط، وبترجع. كل موجة بتاخد معاها شوية من اللي مضايقك.",
      },
      {
        id: "beach-visualization__guide-3",
        at: 180,
        estimatedDuration: 30,
        text: "الشمس بتنزل. برتقالية، وردي، بنفسجي. النور ده شافي.",
      },
      {
        id: "beach-visualization__guide-4",
        at: 270,
        estimatedDuration: 40,
        text: "اتخيل النور البرتقالي بيدخل جسمك من فوق. بينزل في كتفيك، صدرك، بطنك. بيملأ كل خلية.",
      },
      {
        id: "beach-visualization__guide-5",
        at: 390,
        estimatedDuration: 30,
        text: "الشط ده مش بعيد عنك. في أي لحظة ضغط، ارجع هنا.",
      },
      {
        id: "beach-visualization__outro",
        at: 540,
        estimatedDuration: 25,
        text: "الشمس بتغطّس. الموج بيهدا. ارجع معايا لما تكون جاهز.",
      },
    ],
  },

  {
    id: "desert-silence",
    name: "صمت الصحراء",
    subtitle: "تأمل عميق في سيوة — 20 دقيقة",
    description: "جلسة طويلة للمتقدمين. عشرين دقيقة صمت.",
    duration: 1200,
    pattern: "guided",
    env: "desert",
    icon: "🏜️",
    tag: "تأمل",
    voClips: [
      {
        id: "desert-silence__intro",
        at: 0,
        estimatedDuration: 25,
        text: "عشرين دقيقة من الصمت. مش صمت عادي — صمت الصحراء. بعيد عن كل صوت.",
      },
      {
        id: "desert-silence__guide-1",
        at: 60,
        estimatedDuration: 30,
        text: "قاعد على الرمل. السما فوقك مليانة نجوم. الصمت كامل.",
      },
      {
        id: "desert-silence__guide-2",
        at: 240,
        estimatedDuration: 30,
        text: "لو أفكار جت، خليها. الصحراء بتقبل كل حاجة. ما هتحاربهاش، بس هتلاحظها.",
      },
      {
        id: "desert-silence__guide-3",
        at: 480,
        estimatedDuration: 15,
        text: "كمّل. إنت بخير.",
      },
      {
        id: "desert-silence__guide-4",
        at: 720,
        estimatedDuration: 30,
        text: "في الصحراء، مفيش حاجة عاجلة. إنت جزء من إيقاع قديم.",
      },
      {
        id: "desert-silence__guide-5",
        at: 960,
        estimatedDuration: 20,
        text: "لحظة أخيرة. خليها تمتد. كأنها أبد.",
      },
      {
        id: "desert-silence__outro",
        at: 1140,
        estimatedDuration: 25,
        text: "ببطء شديد، ارجع. حرّك أصابعك. افتح عينيك. الصحراء هتفضل معاك.",
      },
    ],
  },

  {
    id: "mountain-focus",
    name: "تركيز جبل سيناء",
    subtitle: "صفاء ذهن قبل يوم — 15 دقيقة",
    description: "إنت على قمة جبل سيناء، وقت الفجر.",
    duration: 900,
    pattern: "box",
    env: "mountain",
    icon: "⛰️",
    tag: "تركيز",
    voClips: [
      {
        id: "mountain-focus__intro",
        at: 0,
        estimatedDuration: 20,
        text: "إنت على قمة جبل سيناء. الفجر. الدنيا كلها تحت رجليك، بتصحى.",
      },
      {
        id: "mountain-focus__guide-1",
        at: 30,
        estimatedDuration: 30,
        text: "الهوا بارد. نقي. يملأ رئتيك ويصحّي كل خلية.",
      },
      {
        id: "mountain-focus__guide-2",
        at: 120,
        estimatedDuration: 35,
        text: "هنتنفس بالنمط المربع. 4 شهيق، 4 إمسك، 4 زفير، 4 إمسك. كل دورة بتشيل ضبابة.",
      },
      {
        id: "mountain-focus__guide-3",
        at: 300,
        estimatedDuration: 25,
        text: "إنت هنا. حاضر. واضح. زي الشمس لما بتطلع من وراء الجبل.",
      },
      {
        id: "mountain-focus__guide-4",
        at: 480,
        estimatedDuration: 30,
        text: "اليوم الجاي فيه تحديات، بس إنت هتواجههم من مكان صفاء.",
      },
      {
        id: "mountain-focus__guide-5",
        at: 660,
        estimatedDuration: 25,
        text: "الشمس طلعت. الضبابة راحت. إنت جاهز.",
      },
      {
        id: "mountain-focus__outro",
        at: 840,
        estimatedDuration: 25,
        text: "ببطء، إرجع من الجبل. وإبدأ يومك من قمة.",
      },
    ],
  },

  {
    id: "gratitude",
    name: "الامتنان",
    subtitle: "صباحية — 7 دقايق",
    description: "ابدأ يومك باحترام لكل حاجة جميلة.",
    duration: 420,
    pattern: "breathe",
    env: "oasis",
    icon: "🙏",
    tag: "صباح",
    voClips: [
      {
        id: "gratitude__intro",
        at: 0,
        estimatedDuration: 15,
        text: "صباح جديد. ممكن يكون صعب، ممكن يكون عادي. بس، لسه صباح.",
      },
      {
        id: "gratitude__guide-1",
        at: 30,
        estimatedDuration: 25,
        text: "خد نفس عميق. وقول في سرّك: أنا ممتن. ما تكمّلش. سيبها مفتوحة.",
      },
      {
        id: "gratitude__guide-2",
        at: 90,
        estimatedDuration: 30,
        text: "فكّر في 3 حاجات صغيرة. كوباية قهوة، ضحكة، سرير دافي.",
      },
      {
        id: "gratitude__guide-3",
        at: 180,
        estimatedDuration: 30,
        text: "حسّ الامتنان. دفّي في صدرك؟ ده الجسم بيستقبل النعمة.",
      },
      {
        id: "gratitude__guide-4",
        at: 270,
        estimatedDuration: 25,
        text: "الامتنان مش إنكار للصعب. ده اعتراف بإن فيه جمال موجود.",
      },
      {
        id: "gratitude__outro",
        at: 380,
        estimatedDuration: 20,
        text: "امشي في يومك، وإنت حاسس النعمة دي.",
      },
    ],
  },

  {
    id: "anxiety-release",
    name: "التخلص من القلق",
    subtitle: "في لحظة توتر — 10 دقايق",
    description: "تقنية 5-4-3-2-1 + تنفس 4-7-8.",
    duration: 600,
    pattern: "478",
    env: "sea",
    icon: "💚",
    tag: "قلق",
    voClips: [
      {
        id: "anxiety-release__intro",
        at: 0,
        estimatedDuration: 20,
        text: "إنت هنا. القلق ده إحساس، مش حقيقة. هييجي ويروح. خليني معاك.",
      },
      {
        id: "anxiety-release__guide-1",
        at: 30,
        estimatedDuration: 30,
        text: "أولاً، شكراً لجسمك. هو بيحاول يحميك. دلوقتي هنقوله: شكراً، بس أنا آمن.",
      },
      {
        id: "anxiety-release__guide-2",
        at: 90,
        estimatedDuration: 30,
        text: "شهيق 4 ثواني، إمسك 7، زفير طويل 8. الزفير الطويل بيفعّل الراحة. علمياً.",
      },
      {
        id: "anxiety-release__guide-3",
        at: 180,
        estimatedDuration: 30,
        text: "ركّز في 5 حاجات بتشوفهم، 4 بتحسهم، 3 بتسمعهم، 2 ريحة، 1 طعم.",
      },
      {
        id: "anxiety-release__guide-4",
        at: 330,
        estimatedDuration: 25,
        text: "التمرين ده بيرجّع عقلك للحاضر. القلق بيعيش في المستقبل. إنت دلوقتي هنا.",
      },
      {
        id: "anxiety-release__guide-5",
        at: 420,
        estimatedDuration: 30,
        text: "إنت أقوى من القلق. شفت قلق قبل كده وعدّى. ده هيعدّي برضه.",
      },
      {
        id: "anxiety-release__outro",
        at: 560,
        estimatedDuration: 25,
        text: "افتكر، التنفس ده معاك. في أي لحظة تحتاجه، ارجع له. إنت مش لوحدك.",
      },
    ],
  },

  {
    id: "deep-relax",
    name: "استرخاء عميق",
    subtitle: "نهاية الأسبوع — 30 دقيقة",
    description: "نص ساعة بالكامل ليك. تجديد شامل.",
    duration: 1800,
    pattern: "bodyscan",
    env: "oasis",
    icon: "🌿",
    tag: "تأمل",
    voClips: [
      {
        id: "deep-relax__intro",
        at: 0,
        estimatedDuration: 25,
        text: "نص ساعة بالكامل ليك. مفيش حاجة أهم من اللحظة دي.",
      },
      {
        id: "deep-relax__guide-1",
        at: 60,
        estimatedDuration: 30,
        text: "الجلسة دي مش سباق. لو سرح ذهنك، عادي. لو نمت، عادي. كل حاجة هتحصل هنا صح.",
      },
      {
        id: "deep-relax__guide-2",
        at: 240,
        estimatedDuration: 30,
        text: "جسمك بيحمل كل ضغط الأسبوع. دلوقتي بيسلمهم لك. خدهم، وخليهم يروحوا.",
      },
      {
        id: "deep-relax__guide-3",
        at: 480,
        estimatedDuration: 15,
        text: "استمر. إنت بتعمل حاجة عظيمة.",
      },
      {
        id: "deep-relax__guide-4",
        at: 840,
        estimatedDuration: 30,
        text: "ممكن تحس تحول داخلي صغير. مش لازم تعرفه بالظبط. بس لاحظه.",
      },
      {
        id: "deep-relax__guide-5",
        at: 1200,
        estimatedDuration: 25,
        text: "النفس بيكمل بدون مجهود. ذهنك أهدى. جسمك أخف. قلبك أوسع.",
      },
      {
        id: "deep-relax__guide-6",
        at: 1560,
        estimatedDuration: 20,
        text: "لحظات كمان. مع الصمت. مع نفسك.",
      },
      {
        id: "deep-relax__outro",
        at: 1740,
        estimatedDuration: 30,
        text: "ببطء شديد، ارجع. ادّي لنفسك لحظة قبل ما تقوم. إنت خلقت حاجة جميلة.",
      },
    ],
  },
];

export function getSession(id: string): Session {
  return SESSIONS.find((s) => s.id === id) || SESSIONS[0];
}

export const SESSION_TAGS = [
  { id: "all", label: "الكل", icon: "✨" },
  { id: "بداية", label: "للمبتدئين", icon: "🌱" },
  { id: "تركيز", label: "تركيز", icon: "🎯" },
  { id: "تهدئة", label: "تهدئة", icon: "💨" },
  { id: "قلق", label: "للقلق", icon: "💚" },
  { id: "نوم", label: "للنوم", icon: "🌙" },
  { id: "تأمل", label: "تأمل عميق", icon: "🧘" },
  { id: "صباح", label: "صباحية", icon: "☀️" },
] as const;

/** Helper: the flat array of narration lines — kept for backward
 *  compatibility with the old player / summary components. */
export function narrationLinesOf(session: Session): string[] {
  return session.voClips.map((c) => c.text);
}

/* ─────────────────────────────────────────────────────────
   Audio asset paths — resolved per session.
   These paths match files you drop into /public/audio/meditation/
   (see docs/AUDIO_ASSETS.md).
   ───────────────────────────────────────────────────────── */

const AUDIO_ROOT = "/meditation";

const ENV_MUSIC: Record<EnvId, string> = {
  sea: `${AUDIO_ROOT}/ambient/ambient__sea__loop.mp3`,
  desert: `${AUDIO_ROOT}/ambient/ambient__desert__loop.mp3`,
  mountain: `${AUDIO_ROOT}/ambient/ambient__mountain__loop.mp3`,
  oasis: `${AUDIO_ROOT}/ambient/ambient__oasis__loop.mp3`,
};

const ENV_VIDEO: Record<EnvId, string> = {
  sea: `${AUDIO_ROOT}/videos/backdrop__sea.webm`,
  desert: `${AUDIO_ROOT}/videos/backdrop__desert.webm`,
  mountain: `${AUDIO_ROOT}/videos/backdrop__mountain.webm`,
  oasis: `${AUDIO_ROOT}/videos/backdrop__oasis.webm`,
};

/**
 * Resolves the music track for a session.
 * Falls back to the environment default if `audioTrack` isn't set.
 */
export function getSessionAudioTrack(session: Session): string {
  return session.audioTrack ?? ENV_MUSIC[session.env];
}

/**
 * Resolves the background video for a session.
 */
export function getSessionVideoTrack(session: Session): string {
  return session.videoTrack ?? ENV_VIDEO[session.env];
}

/**
 * Resolves the MP3 path for a VO clip.
 * The clip id is like `quick-calm__intro` → `/meditation/vo/quick-calm__intro.mp3`
 * (flat layout — matches useTimedVoice + audioAssets.ts).
 */
export function getVoClipPath(clipId: string): string {
  return `${AUDIO_ROOT}/vo/${clipId}.mp3`;
}

export const CHIMES = {
  start: `${AUDIO_ROOT}/chimes/chime__session-start.mp3`,
  end: `${AUDIO_ROOT}/chimes/chime__session-end.mp3`,
  transition: `${AUDIO_ROOT}/chimes/chime__milestone.mp3`,
  signature: `${AUDIO_ROOT}/chimes/chime__breath-in.mp3`,
} as const;

export const SIGNATURE_INTRO = `${AUDIO_ROOT}/vo/signature__welcome.mp3`;

// Journeys moved to ./journeys.ts — they have a richer shape (per-day teasers,
// cover images, progress tracking) than a flat sessionIds array supports.
