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
  /** Narration text in both supported locales. Used by Web Speech when
   *  the real MP3 is missing, and as subtitle / caption text. */
  text: { ar: string; en: string };
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
        text: {
          ar: "أهلاً بيك في أول جلسة ليك. مش محتاج تكون خبير. بس خد وضعية مريحة، وخليني أمشي معاك.",
          en: "Welcome to your first session. You don't need to be an expert. Just find a comfortable position and let me guide you.",
        },
      },
      {
        id: "quick-calm__guide-1",
        at: 30,
        estimatedDuration: 20,
        text: {
          ar: "بص حواليك. لاحظ شكل المكان. دلوقتي، غمّض عينيك لو قدرت.",
          en: "Look around you. Notice the space. Now, gently close your eyes if you can.",
        },
      },
      {
        id: "quick-calm__guide-2",
        at: 60,
        estimatedDuration: 25,
        text: {
          ar: "خد نفس عميق من أنفك. حس الهوا. ولما تزفر، خليه يطلع من فمك. اتخيل إن كل زفير بيطلع معاه ضغط اليوم.",
          en: "Take a deep breath through your nose. Feel the air. As you exhale through your mouth, imagine every breath out carries the day's tension with it.",
        },
      },
      {
        id: "quick-calm__guide-3",
        at: 100,
        estimatedDuration: 20,
        text: {
          ar: "مفيش حاجة لازمة منك دلوقتي. بس تتنفس. بس تكون موجود.",
          en: "Nothing is required of you right now. Just breathe. Just be here.",
        },
      },
      {
        id: "quick-calm__guide-4",
        at: 140,
        estimatedDuration: 15,
        text: {
          ar: "افتكر، التنفس ده معاك طول حياتك. تقدر ترجع له في أي لحظة.",
          en: "Remember, this breath is always with you. You can return to it at any moment.",
        },
      },
      {
        id: "quick-calm__outro",
        at: 170,
        estimatedDuration: 10,
        text: {
          ar: "ببطء، خد نفس أخير عميق، وارجع لليوم بتاعك.",
          en: "Slowly, take one last deep breath, and return to your day.",
        },
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
        text: {
          ar: "خمس دقايق، وهترجع لأي حاجة بعدها بصفاء ذهن مختلف.",
          en: "Five minutes, and you'll return to whatever comes next with a clearer mind.",
        },
      },
      {
        id: "box-focus__guide-1",
        at: 30,
        estimatedDuration: 30,
        text: {
          ar: "شهيق 4 ثواني، إمسك 4، زفير 4، إمسك 4. 4-4-4-4.",
          en: "Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Four-four-four-four.",
        },
      },
      {
        id: "box-focus__guide-2",
        at: 80,
        estimatedDuration: 20,
        text: {
          ar: "لو ذهنك سرح، عادي. ارجّعه بهدوء للتنفس. بدون لوم.",
          en: "If your mind drifts, that's fine. Gently bring it back to the breath. No judgment.",
        },
      },
      {
        id: "box-focus__guide-3",
        at: 150,
        estimatedDuration: 25,
        text: {
          ar: "إنت دلوقتي بتفعّل جهاز الاسترخاء في جسمك. كل دورة بتخلّي عقلك أوضح.",
          en: "You're activating your body's relaxation system right now. Each cycle makes your mind clearer.",
        },
      },
      {
        id: "box-focus__guide-4",
        at: 210,
        estimatedDuration: 20,
        text: {
          ar: "افتكر اللحظة دي. لما ترجع للشغل، كفاية نفس واحد وترجع حاضر.",
          en: "Remember this feeling. When you're back at work, one breath is all it takes to return here.",
        },
      },
      {
        id: "box-focus__outro",
        at: 280,
        estimatedDuration: 15,
        text: {
          ar: "ببطء، خد نفس عادي، افتح عينيك، وفضّل الصفاء ده معاك.",
          en: "Slowly, take a normal breath, open your eyes, and carry this clarity with you.",
        },
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
        text: {
          ar: "الليلة هادية. لو عقلك بيفكر، عادي. احنا هنقوله يستريح.",
          en: "The night is calm. If your mind is racing, that's okay. We'll ask it to rest.",
        },
      },
      {
        id: "sleep-478__guide-1",
        at: 40,
        estimatedDuration: 30,
        text: {
          ar: "شهيق من أنفك 4 ثواني، إمسك 7، زفير طويل 8. الزفير أطول من الشهيق — ده مفتاح النوم.",
          en: "Inhale through your nose for 4 counts, hold for 7, long exhale for 8. The longer exhale is the key to sleep.",
        },
      },
      {
        id: "sleep-478__guide-2",
        at: 120,
        estimatedDuration: 25,
        text: {
          ar: "أفكار اليوم بتيجي؟ خليها تعدي زي عربيات على طريق بعيد. مش محتاج تلحقهم.",
          en: "Thoughts from the day arriving? Let them pass like cars on a distant road. You don't need to follow them.",
        },
      },
      {
        id: "sleep-478__guide-3",
        at: 210,
        estimatedDuration: 30,
        text: {
          ar: "جسمك بيدخل في وضع الراحة. قلبك بيبطّأ. جفونك ثقيلة.",
          en: "Your body is entering rest mode. Your heart is slowing. Your eyelids are heavy.",
        },
      },
      {
        id: "sleep-478__guide-4",
        at: 300,
        estimatedDuration: 25,
        text: {
          ar: "بكرة يوم جديد. دلوقتي دورك إنك ترتاح. بس دي.",
          en: "Tomorrow is a new day. Right now your only job is to rest. Just this.",
        },
      },
      {
        id: "sleep-478__guide-5",
        at: 420,
        estimatedDuration: 20,
        text: {
          ar: "لو عقلك سرح، ارجعه برفق. مفيش صح وغلط.",
          en: "If your mind wanders, bring it back gently. There's no right or wrong here.",
        },
      },
      {
        id: "sleep-478__outro",
        at: 560,
        estimatedDuration: 25,
        text: {
          ar: "هفضّلك هنا. التنفس هيكمل معاك لحد ما تنام. تصبح على خير.",
          en: "I'll stay with you here. The breath will carry you until you sleep. Goodnight.",
        },
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
        text: {
          ar: "هنعمل Body Scan. هنمشي بالـ attention من فوق لتحت. بدون حكم. بس ملاحظة.",
          en: "We'll do a body scan. Moving our attention from top to bottom. No judgment. Just noticing.",
        },
      },
      {
        id: "body-scan__guide-head",
        at: 30,
        estimatedDuration: 30,
        text: {
          ar: "ابدأ من فوق راسك. جبينك، حوالين عينيك، فكك. سيبهم كلهم يرتخوا.",
          en: "Start at the top of your head. Your forehead, around your eyes, your jaw. Let them all soften.",
        },
      },
      {
        id: "body-scan__guide-neck",
        at: 90,
        estimatedDuration: 25,
        text: {
          ar: "رقبتك. دورّها ببطء. كتفيك، ارفعهم وسيبهم ينزلوا.",
          en: "Your neck. Roll it slowly. Your shoulders — raise them and let them drop.",
        },
      },
      {
        id: "body-scan__guide-chest",
        at: 150,
        estimatedDuration: 30,
        text: {
          ar: "صدرك. حس القلب. الأنفاس بتدخل وتطلع. إنت مش بتتنفس — إنت بيتم تنفسك.",
          en: "Your chest. Feel the heart. Breath moving in and out. You're not breathing — you're being breathed.",
        },
      },
      {
        id: "body-scan__guide-abdomen",
        at: 210,
        estimatedDuration: 30,
        text: {
          ar: "بطنك. ترتفع مع الشهيق، تنخفض مع الزفير. إيقاع قديم موجود فيك من يوم ما اتولدت.",
          en: "Your belly. Rising with the inhale, falling with the exhale. An ancient rhythm that has lived in you since birth.",
        },
      },
      {
        id: "body-scan__guide-back",
        at: 285,
        estimatedDuration: 25,
        text: {
          ar: "ظهرك. لو فيه توتر، تنفس فيه. كل زفير بيفك عقدة صغيرة.",
          en: "Your back. If there's tension, breathe into it. Each exhale releases a small knot.",
        },
      },
      {
        id: "body-scan__guide-arms",
        at: 345,
        estimatedDuration: 25,
        text: {
          ar: "ذراعيك. من الكتف للأصابع. حس الطاقة بتسري فيهم.",
          en: "Your arms. From shoulder to fingertips. Feel the energy flowing through them.",
        },
      },
      {
        id: "body-scan__guide-legs",
        at: 405,
        estimatedDuration: 30,
        text: {
          ar: "فخاديك، ركبك، قدمك. كل جزء، شكراً إنه شايلك طول اليوم.",
          en: "Your thighs, knees, feet. Each part — thank it for carrying you through the day.",
        },
      },
      {
        id: "body-scan__guide-whole",
        at: 480,
        estimatedDuration: 30,
        text: {
          ar: "دلوقتي، حس جسمك كله مرة واحدة. خفيف، مرتخي، في أمان.",
          en: "Now, feel your whole body at once. Light, relaxed, safe.",
        },
      },
      {
        id: "body-scan__outro",
        at: 560,
        estimatedDuration: 25,
        text: {
          ar: "افتكر الإحساس ده. ده إنت لما بتسيب نفسك ترتاح. ببطء، ارجع.",
          en: "Remember this feeling. This is you when you let yourself rest. Slowly, return.",
        },
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
        text: {
          ar: "دلوقتي، هخدك لمكان. مش في خيالك — في ذاكرتك. شط سفاجا وقت الغروب.",
          en: "Right now, I'll take you somewhere. Not in your imagination — in your memory. The shore of Safaga at sunset.",
        },
      },
      {
        id: "beach-visualization__guide-1",
        at: 30,
        estimatedDuration: 30,
        text: {
          ar: "إنت واقف على الرمل. الرمل الأسود دافي تحت رجليك. البحر قدامك هادي.",
          en: "You're standing on the sand. The dark sand warm beneath your feet. The sea is calm before you.",
        },
      },
      {
        id: "beach-visualization__guide-2",
        at: 90,
        estimatedDuration: 35,
        text: {
          ar: "اسمع موجة جاية. بتقرب، بتبوس الشط، وبترجع. كل موجة بتاخد معاها شوية من اللي مضايقك.",
          en: "Listen — a wave approaching. It draws near, kisses the shore, and retreats. Each wave carries a little of what troubles you back with it.",
        },
      },
      {
        id: "beach-visualization__guide-3",
        at: 180,
        estimatedDuration: 30,
        text: {
          ar: "الشمس بتنزل. برتقالية، وردي، بنفسجي. النور ده شافي.",
          en: "The sun is descending. Orange, pink, violet. This light is healing.",
        },
      },
      {
        id: "beach-visualization__guide-4",
        at: 270,
        estimatedDuration: 40,
        text: {
          ar: "اتخيل النور البرتقالي بيدخل جسمك من فوق. بينزل في كتفيك، صدرك، بطنك. بيملأ كل خلية.",
          en: "Imagine the golden light entering your body from above. Flowing down through your shoulders, chest, belly. Filling every cell.",
        },
      },
      {
        id: "beach-visualization__guide-5",
        at: 390,
        estimatedDuration: 30,
        text: {
          ar: "الشط ده مش بعيد عنك. في أي لحظة ضغط، ارجع هنا.",
          en: "This shore is never far from you. In any moment of pressure, return here.",
        },
      },
      {
        id: "beach-visualization__outro",
        at: 540,
        estimatedDuration: 25,
        text: {
          ar: "الشمس بتغطّس. الموج بيهدا. ارجع معايا لما تكون جاهز.",
          en: "The sun is sinking. The waves are quieting. Come back with me when you're ready.",
        },
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
        text: {
          ar: "عشرين دقيقة من الصمت. مش صمت عادي — صمت الصحراء. بعيد عن كل صوت.",
          en: "Twenty minutes of silence. Not ordinary silence — the silence of the desert. Far from every sound.",
        },
      },
      {
        id: "desert-silence__guide-1",
        at: 60,
        estimatedDuration: 30,
        text: {
          ar: "قاعد على الرمل. السما فوقك مليانة نجوم. الصمت كامل.",
          en: "Seated on the sand. The sky above you full of stars. The silence is complete.",
        },
      },
      {
        id: "desert-silence__guide-2",
        at: 240,
        estimatedDuration: 30,
        text: {
          ar: "لو أفكار جت، خليها. الصحراء بتقبل كل حاجة. ما هتحاربهاش، بس هتلاحظها.",
          en: "If thoughts come, let them. The desert accepts everything. Don't fight them — just observe.",
        },
      },
      {
        id: "desert-silence__guide-3",
        at: 480,
        estimatedDuration: 15,
        text: {
          ar: "كمّل. إنت بخير.",
          en: "Keep going. You're doing well.",
        },
      },
      {
        id: "desert-silence__guide-4",
        at: 720,
        estimatedDuration: 30,
        text: {
          ar: "في الصحراء، مفيش حاجة عاجلة. إنت جزء من إيقاع قديم.",
          en: "In the desert, nothing is urgent. You are part of an ancient rhythm.",
        },
      },
      {
        id: "desert-silence__guide-5",
        at: 960,
        estimatedDuration: 20,
        text: {
          ar: "لحظة أخيرة. خليها تمتد. كأنها أبد.",
          en: "One last moment. Let it stretch. As if it were forever.",
        },
      },
      {
        id: "desert-silence__outro",
        at: 1140,
        estimatedDuration: 25,
        text: {
          ar: "ببطء شديد، ارجع. حرّك أصابعك. افتح عينيك. الصحراء هتفضل معاك.",
          en: "Very slowly, return. Move your fingers. Open your eyes. The desert will stay with you.",
        },
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
        text: {
          ar: "إنت على قمة جبل سيناء. الفجر. الدنيا كلها تحت رجليك، بتصحى.",
          en: "You're at the summit of Mount Sinai. Dawn. The whole world beneath your feet, waking.",
        },
      },
      {
        id: "mountain-focus__guide-1",
        at: 30,
        estimatedDuration: 30,
        text: {
          ar: "الهوا بارد. نقي. يملأ رئتيك ويصحّي كل خلية.",
          en: "The air is cold. Pure. It fills your lungs and awakens every cell.",
        },
      },
      {
        id: "mountain-focus__guide-2",
        at: 120,
        estimatedDuration: 35,
        text: {
          ar: "هنتنفس بالنمط المربع. 4 شهيق، 4 إمسك، 4 زفير، 4 إمسك. كل دورة بتشيل ضبابة.",
          en: "We'll breathe in the box pattern. Inhale 4, hold 4, exhale 4, hold 4. Each cycle lifts a layer of fog.",
        },
      },
      {
        id: "mountain-focus__guide-3",
        at: 300,
        estimatedDuration: 25,
        text: {
          ar: "إنت هنا. حاضر. واضح. زي الشمس لما بتطلع من وراء الجبل.",
          en: "You are here. Present. Clear. Like the sun rising from behind the mountain.",
        },
      },
      {
        id: "mountain-focus__guide-4",
        at: 480,
        estimatedDuration: 30,
        text: {
          ar: "اليوم الجاي فيه تحديات، بس إنت هتواجههم من مكان صفاء.",
          en: "The day ahead has challenges, but you'll face them from a place of clarity.",
        },
      },
      {
        id: "mountain-focus__guide-5",
        at: 660,
        estimatedDuration: 25,
        text: {
          ar: "الشمس طلعت. الضبابة راحت. إنت جاهز.",
          en: "The sun has risen. The fog has lifted. You are ready.",
        },
      },
      {
        id: "mountain-focus__outro",
        at: 840,
        estimatedDuration: 25,
        text: {
          ar: "ببطء، إرجع من الجبل. وإبدأ يومك من قمة.",
          en: "Slowly, descend from the mountain. And begin your day from its peak.",
        },
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
        text: {
          ar: "صباح جديد. ممكن يكون صعب، ممكن يكون عادي. بس، لسه صباح.",
          en: "A new morning. It might be hard, it might be ordinary. But it's still a morning.",
        },
      },
      {
        id: "gratitude__guide-1",
        at: 30,
        estimatedDuration: 25,
        text: {
          ar: "خد نفس عميق. وقول في سرّك: أنا ممتن. ما تكمّلش. سيبها مفتوحة.",
          en: "Take a deep breath. And say to yourself: I am grateful. Don't complete it. Leave it open.",
        },
      },
      {
        id: "gratitude__guide-2",
        at: 90,
        estimatedDuration: 30,
        text: {
          ar: "فكّر في 3 حاجات صغيرة. كوباية قهوة، ضحكة، سرير دافي.",
          en: "Think of 3 small things. A cup of coffee, a laugh, a warm bed.",
        },
      },
      {
        id: "gratitude__guide-3",
        at: 180,
        estimatedDuration: 30,
        text: {
          ar: "حسّ الامتنان. دفّي في صدرك؟ ده الجسم بيستقبل النعمة.",
          en: "Feel the gratitude. Warmth in your chest? That's the body receiving grace.",
        },
      },
      {
        id: "gratitude__guide-4",
        at: 270,
        estimatedDuration: 25,
        text: {
          ar: "الامتنان مش إنكار للصعب. ده اعتراف بإن فيه جمال موجود.",
          en: "Gratitude isn't denial of difficulty. It's an acknowledgment that beauty also exists.",
        },
      },
      {
        id: "gratitude__outro",
        at: 380,
        estimatedDuration: 20,
        text: {
          ar: "امشي في يومك، وإنت حاسس النعمة دي.",
          en: "Move through your day carrying this sense of grace.",
        },
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
        text: {
          ar: "إنت هنا. القلق ده إحساس، مش حقيقة. هييجي ويروح. خليني معاك.",
          en: "You are here. This anxiety is a feeling, not a fact. It will come and go. Let me be with you.",
        },
      },
      {
        id: "anxiety-release__guide-1",
        at: 30,
        estimatedDuration: 30,
        text: {
          ar: "أولاً، شكراً لجسمك. هو بيحاول يحميك. دلوقتي هنقوله: شكراً، بس أنا آمن.",
          en: "First, thank your body. It's trying to protect you. Now let's tell it: thank you, but I am safe.",
        },
      },
      {
        id: "anxiety-release__guide-2",
        at: 90,
        estimatedDuration: 30,
        text: {
          ar: "شهيق 4 ثواني، إمسك 7، زفير طويل 8. الزفير الطويل بيفعّل الراحة. علمياً.",
          en: "Inhale for 4 counts, hold for 7, long exhale for 8. The long exhale activates calm. Scientifically.",
        },
      },
      {
        id: "anxiety-release__guide-3",
        at: 180,
        estimatedDuration: 30,
        text: {
          ar: "ركّز في 5 حاجات بتشوفهم، 4 بتحسهم، 3 بتسمعهم، 2 ريحة، 1 طعم.",
          en: "Notice 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell, 1 you can taste.",
        },
      },
      {
        id: "anxiety-release__guide-4",
        at: 330,
        estimatedDuration: 25,
        text: {
          ar: "التمرين ده بيرجّع عقلك للحاضر. القلق بيعيش في المستقبل. إنت دلوقتي هنا.",
          en: "This exercise brings your mind back to the present. Anxiety lives in the future. You are here, now.",
        },
      },
      {
        id: "anxiety-release__guide-5",
        at: 420,
        estimatedDuration: 30,
        text: {
          ar: "إنت أقوى من القلق. شفت قلق قبل كده وعدّى. ده هيعدّي برضه.",
          en: "You are stronger than this anxiety. You've faced it before and it passed. This will pass too.",
        },
      },
      {
        id: "anxiety-release__outro",
        at: 560,
        estimatedDuration: 25,
        text: {
          ar: "افتكر، التنفس ده معاك. في أي لحظة تحتاجه، ارجع له. إنت مش لوحدك.",
          en: "Remember, this breath is with you always. Whenever you need it, return to it. You are not alone.",
        },
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
        text: {
          ar: "نص ساعة بالكامل ليك. مفيش حاجة أهم من اللحظة دي.",
          en: "A full half hour, entirely yours. Nothing is more important than this moment.",
        },
      },
      {
        id: "deep-relax__guide-1",
        at: 60,
        estimatedDuration: 30,
        text: {
          ar: "الجلسة دي مش سباق. لو سرح ذهنك، عادي. لو نمت، عادي. كل حاجة هتحصل هنا صح.",
          en: "This session is not a race. If your mind drifts, that's fine. If you fall asleep, that's fine. Everything that happens here is right.",
        },
      },
      {
        id: "deep-relax__guide-2",
        at: 240,
        estimatedDuration: 30,
        text: {
          ar: "جسمك بيحمل كل ضغط الأسبوع. دلوقتي بيسلمهم لك. خدهم، وخليهم يروحوا.",
          en: "Your body has been carrying the week's weight. Now it's handing it over to you. Receive it, and let it go.",
        },
      },
      {
        id: "deep-relax__guide-3",
        at: 480,
        estimatedDuration: 15,
        text: {
          ar: "استمر. إنت بتعمل حاجة عظيمة.",
          en: "Keep going. You're doing something remarkable.",
        },
      },
      {
        id: "deep-relax__guide-4",
        at: 840,
        estimatedDuration: 30,
        text: {
          ar: "ممكن تحس تحول داخلي صغير. مش لازم تعرفه بالظبط. بس لاحظه.",
          en: "You may feel a small inner shift. You don't need to understand it exactly. Just notice it.",
        },
      },
      {
        id: "deep-relax__guide-5",
        at: 1200,
        estimatedDuration: 25,
        text: {
          ar: "النفس بيكمل بدون مجهود. ذهنك أهدى. جسمك أخف. قلبك أوسع.",
          en: "The breath continues without effort. Your mind is quieter. Your body lighter. Your heart wider.",
        },
      },
      {
        id: "deep-relax__guide-6",
        at: 1560,
        estimatedDuration: 20,
        text: {
          ar: "لحظات كمان. مع الصمت. مع نفسك.",
          en: "A few more moments. With the silence. With yourself.",
        },
      },
      {
        id: "deep-relax__outro",
        at: 1740,
        estimatedDuration: 30,
        text: {
          ar: "ببطء شديد، ارجع. ادّي لنفسك لحظة قبل ما تقوم. إنت خلقت حاجة جميلة.",
          en: "Very slowly, return. Give yourself a moment before you rise. You created something beautiful.",
        },
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

/** Helper: the flat array of narration lines for the given locale. */
export function narrationLinesOf(session: Session, locale: "ar" | "en" = "ar"): string[] {
  return session.voClips.map((c) => c.text[locale]);
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
