/**
 * Curated meditation sessions — library of ready-to-start presets.
 * Each session has a fixed duration, breathing pattern, and narration script.
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
  narration: string[];
  /** Optional explicit breath timings — defaults per pattern if omitted */
  timings?: BreathTimings;
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

export const SESSIONS: Session[] = [
  {
    id: "quick-calm",
    name: "البداية الهادئة",
    subtitle: "جلسة سريعة للمبتدئين",
    duration: 180,
    pattern: "breathe",
    env: "sea",
    icon: "🌱",
    tag: "بداية",
    narration: [
      "خد وضعية مريحة... ظهرك مفرود وكتفك مرتخيين",
      "اغمض عينيك... خد نفس عميق من أنفك",
      "حس بالهوا بيدخل جسمك... ويملأ رئتيك",
      "خرّج الهوا ببطء من فمك... وسيب التوتر يطلع معاه",
      "كمل كده... مع كل شهيق... تستقبل راحة",
      "مع كل زفير... تسيب ضغط",
      "أنت هنا... في اللحظة دي... أنت بأمان",
    ],
  },
  {
    id: "box-focus",
    name: "تهدئة سريعة",
    subtitle: "قبل اجتماع أو امتحان",
    duration: 300,
    pattern: "box",
    env: "sea",
    icon: "⬜",
    tag: "تركيز",
    narration: [
      "ده تمرين التنفس المربع — 4 ثواني لكل مرحلة",
      "هيساعدك تركز وتهدى أعصابك",
      "شهيق 4 ثواني... إمسك 4... زفير 4... إمسك 4",
      "كمل الإيقاع... عقلك بيتصفّى",
      "كل دورة بتخليك أكتر حضور",
      "مش محتاج تفكر في حاجة... بس اتبع الدايرة",
    ],
  },
  {
    id: "sleep-478",
    name: "قبل النوم",
    subtitle: "للأرق والتفكير الليلي",
    duration: 600,
    pattern: "478",
    env: "oasis",
    icon: "🌙",
    tag: "نوم",
    narration: [
      "تمرين 4-7-8 معترف بيه طبياً لتسريع النوم",
      "شهيق من أنفك 4 ثواني... إحبس نفسك 7 ثواني... زفير طويل من فمك 8 ثواني",
      "ده هيبطأ نبضات قلبك ويريّح جهازك العصبي",
      "كمل لحد ما تحس بنعاس",
      "جسمك بيتخدر... عقلك بيهدى",
      "سيب كل أفكار اليوم تمشي",
      "بكرة يوم جديد... دلوقتي دورك إنك ترتاح",
    ],
  },
  {
    id: "body-scan",
    name: "مسح الجسم",
    subtitle: "تأمل موجه في آخر اليوم",
    duration: 600,
    pattern: "bodyscan",
    env: "mountain",
    icon: "🧘",
    tag: "تأمل",
    narration: [
      "استلقي أو اقعد مريح... عينيك مغلقة",
      "ابدأ من قدميك... حس بثقلهم على الأرض",
      "اصعد لركبك وساقيك... لاحظ أي توتر وسيبه",
      "ظهرك... لو فيه تعب... تنفس فيه",
      "بطنك... ترتفع وتنخفض مع نفسك",
      "كتفيك... ارخيهم... خليهم ينزلوا",
      "رقبتك... دوّرها ببطء لو محتاج",
      "وجهك... جبينك... فكك... كله مرتخي",
      "جسمك كله خفيف... في سلام",
      "خد نفس أخير عميق... وافتكر الشعور ده",
    ],
  },
  {
    id: "beach-visualization",
    name: "رحلة الشاطئ",
    subtitle: "تخيل موجه للاسترخاء",
    duration: 600,
    pattern: "guided",
    env: "sea",
    icon: "🏖️",
    tag: "تأمل",
    narration: [
      "تخيل إنك واقف على شاطئ هادي وقت الغروب",
      "الرمل دافي تحت رجليك",
      "النسمة بتلمس وشك... دافية ولطيفة",
      "اسمع صوت الأمواج... بتيجي وتروح",
      "كل موجة بتاخد شوية من توترك",
      "الشمس بتغرب بلون ذهبي",
      "النور الذهبي ده بيدخل جسمك من فوق",
      "بينزل في كتفيك... صدرك... بطنك... رجليك",
      "كل خلية في جسمك بتتملى دفا وراحة",
      "أنت في سلام تام... والشاطئ ده بتاعك دايماً",
    ],
  },
  {
    id: "desert-silence",
    name: "صمت الصحراء",
    subtitle: "تأمل عميق في الصحراء",
    duration: 1200,
    pattern: "guided",
    env: "desert",
    icon: "🏜️",
    tag: "تأمل",
    narration: [
      "تخيل إنك قاعد في قلب صحراء سيوة",
      "الصمت حواليك... كامل... عميق",
      "السما فوقك مليانة نجوم",
      "الرمل دافي... والهوا نقي",
      "مفيش إشارة موبايل... مفيش ضوضاء",
      "بس أنت... ونفسك... والكون",
      "خد وقتك... كل لحظة كاملة",
      "دلوقتي أنت الأهم... ابقى معاها",
    ],
  },
  {
    id: "mountain-focus",
    name: "تركيز جبال سيناء",
    subtitle: "تصفية ذهن قبل يوم شغل",
    duration: 900,
    pattern: "box",
    env: "mountain",
    icon: "⛰️",
    tag: "تركيز",
    narration: [
      "تخيل إنك على قمة جبل سيناء عند الفجر",
      "الهوا بارد ونقي... يملأ رئتيك",
      "أنت فوق كل ضوضاء الدنيا",
      "تنفس بنمط مربع... ذهنك يتصفى",
      "شهيق... إمسك... زفير... إمسك",
      "كل دورة بتزيل ضبابة من عقلك",
      "أنت هادي... حاضر... مركز",
    ],
  },
  {
    id: "gratitude",
    name: "الامتنان",
    subtitle: "صباحاً قبل بدء اليوم",
    duration: 420,
    pattern: "breathe",
    env: "oasis",
    icon: "🙏",
    tag: "صباح",
    narration: [
      "صباح جديد... نعمة جديدة",
      "خد نفس عميق... وقول في سرك: أنا ممتن",
      "فكر في 3 حاجات بتحبها في حياتك",
      "ممكن تكون بسيطة... كوباية قهوة... ضحكة طفل... شمس الصبح",
      "حس بالامتنان في صدرك... دفي حلو",
      "الامتنان مش إنكار للصعوبة... ده اعتراف بالجمال اللي موجود",
      "امشي اليوم وأنت حاسس بالنعمة دي",
    ],
  },
  {
    id: "anxiety-release",
    name: "التخلص من القلق",
    subtitle: "في لحظة قلق أو توتر",
    duration: 600,
    pattern: "478",
    env: "sea",
    icon: "💚",
    tag: "قلق",
    narration: [
      "القلق مش عدو... بس رسالة من جسمك",
      "شكرا لجسمك إنه بيحاول يحميك",
      "دلوقتي هنقول له إنك آمن",
      "شهيق من أنفك 4 ثواني",
      "إمسك نفسك 7 ثواني — ده بيفعّل الاسترخاء",
      "زفير طويل 8 ثواني من فمك",
      "التمرين ده بيقلل الأدرينالين ويزود السيروتونين",
      "كمل... دقايق قليلة وهتحس بفرق",
      "أنت أقوى من القلق ده... وهو هيعدي",
    ],
  },
  {
    id: "deep-relax",
    name: "استرخاء عميق",
    subtitle: "لعطلة نهاية الأسبوع",
    duration: 1800,
    pattern: "bodyscan",
    env: "oasis",
    icon: "🌿",
    tag: "تأمل",
    narration: [
      "نص ساعة كاملة ليك أنت بس",
      "ما فيش حاجة أهم من دي اللحظة",
      "خد وقتك في كل خطوة",
      "لو سرح ذهنك... عادي... رجّعه بلطف",
      "مفيش صح وغلط في التأمل",
      "كل اللي محتاجه إنك موجود",
      "جسمك هيشكرك على الهدية دي",
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
