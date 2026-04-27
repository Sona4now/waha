/**
 * Audio asset registry for the cinematic intro experience (`/`).
 *
 * All VO clips and ambient tracks are listed here with their file paths
 * under /public/intro/. When a file isn't there yet, the helpers below
 * fall back gracefully — the user gets silence for VO and a CDN-hosted
 * placeholder for ambient — so the product keeps working while you record.
 *
 * Once the real MP3s are dropped into /public/intro/{vo/ar, vo/en, ambient}
 * the app uses them automatically. No code changes needed.
 */

const INTRO_ROOT = "/intro";

/** Fallback CDN URLs while you produce the real ambient tracks.
 *  Drop /public/intro/ambient/intro__<key>.mp3 to replace any of them. */
const FALLBACK_AMBIENT: Record<IntroAmbient, string> = {
  nature:
    "https://cdn.freesound.org/previews/462/462807_7799498-lq.mp3",
  wind: "https://cdn.freesound.org/previews/530/530679_8079834-lq.mp3",
  waves:
    "https://cdn.freesound.org/previews/467/467539_5765668-lq.mp3",
};

/* ─────────────────────────────────────────────────────────
   VO clip ids — matched 1:1 to filenames under
   /public/intro/vo/{locale}/{id}.mp3
   ───────────────────────────────────────────────────────── */

export type IntroVoId =
  | "hook-1"
  | "hook-2"
  | "discovery-sea"
  | "discovery-desert"
  | "discovery-mountains"
  | "discovery-oasis"
  | "q1"
  | "q2"
  | "q3"
  | "processing"
  | "reveal-safaga"
  | "reveal-siwa"
  | "reveal-sinai"
  | "reveal-fayoum"
  | "reveal-bahariya"
  | "reveal-wadi-degla"
  | "reveal-shagie-farms"
  | "transition";

/** Quick map from clip id to the spoken text in each locale.
 *  Used for documentation, accessibility subtitles, and to power the
 *  Web Speech fallback when no MP3 file is present. */
export const INTRO_VO_TEXT: Record<
  IntroVoId,
  { ar: string; en: string }
> = {
  "hook-1": {
    ar: "مش كل علاج بيبدأ من دواء",
    en: "Not every cure starts with medicine",
  },
  "hook-2": {
    ar: "أحياناً... يبدأ من مكان",
    en: "Sometimes… it starts with a place",
  },
  "discovery-sea": { ar: "البحر", en: "The sea" },
  "discovery-desert": { ar: "الصحراء", en: "The desert" },
  "discovery-mountains": { ar: "الجبال", en: "The mountains" },
  "discovery-oasis": { ar: "الواحات", en: "The oases" },
  q1: {
    ar: "ما الذي تبحث عنه؟",
    en: "What are you looking for?",
  },
  q2: {
    ar: "أين تجد راحتك؟",
    en: "Where do you find peace?",
  },
  q3: {
    ar: "كيف تتخيّل رحلتك؟",
    en: "How do you imagine your journey?",
  },
  processing: {
    ar: "نرسم لك رحلتك",
    en: "Mapping your journey",
  },
  "reveal-safaga": {
    ar: "سفاجا. حيث يبدأ الجسد في التذكّر.",
    en: "Safaga. Where the body begins to remember.",
  },
  "reveal-siwa": {
    ar: "سيوة. حيث الصمت يتكلّم.",
    en: "Siwa. Where silence speaks.",
  },
  "reveal-sinai": {
    ar: "سيناء. حيث تلمس السماء والأرض معاً.",
    en: "Sinai. Where sky and earth touch as one.",
  },
  "reveal-fayoum": {
    ar: "الفيوم. واحة الروح الهادئة.",
    en: "Fayoum. An oasis for a quiet soul.",
  },
  "reveal-bahariya": {
    ar: "الواحات البحرية. حيث الصحراء تحتضنك.",
    en: "Bahariya. Where the desert holds you close.",
  },
  "reveal-wadi-degla": {
    ar: "وادي دجلة. صمت الصحراء على أطراف المدينة.",
    en: "Wadi Degla. Desert silence at the edge of the city.",
  },
  "reveal-shagie-farms": {
    ar: "مزارع شجيع. حيث الشفاء يبدأ من الأرض.",
    en: "Shagie Farms. Where healing begins from the soil.",
  },
  transition: {
    ar: "رحلتك بدأت. تعالى نكمل.",
    en: "Your journey has begun. Let's continue.",
  },
};

/* ─────────────────────────────────────────────────────────
   Ambient music — three moods threaded through the intro.
   ───────────────────────────────────────────────────────── */

export type IntroAmbient = "nature" | "wind" | "waves";

/** Build the local URL for an intro ambient track. */
export function introAmbientUrl(track: IntroAmbient): string {
  return `${INTRO_ROOT}/ambient/intro__${track}.mp3`;
}

/** Build the local URL for an intro VO clip in the active locale. */
export function introVoUrl(id: IntroVoId, locale: "ar" | "en"): string {
  return `${INTRO_ROOT}/vo/${locale}/${id}.mp3`;
}

/* ─────────────────────────────────────────────────────────
   Availability probe with sessionStorage cache, mirroring the
   meditation room's strategy so we hit the network at most once
   per asset per session.
   ───────────────────────────────────────────────────────── */

const AVAILABILITY_CACHE = new Map<string, boolean>();

export async function isIntroAudioAvailable(url: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (AVAILABILITY_CACHE.has(url)) return AVAILABILITY_CACHE.get(url)!;

  const storageKey = `waaha_intro_avail_${url}`;
  try {
    const cached = sessionStorage.getItem(storageKey);
    if (cached !== null) {
      const v = cached === "1";
      AVAILABILITY_CACHE.set(url, v);
      return v;
    }
  } catch {
    /* private mode — skip cache */
  }

  try {
    const res = await fetch(url, { method: "HEAD" });
    const ok = res.ok;
    AVAILABILITY_CACHE.set(url, ok);
    try {
      sessionStorage.setItem(storageKey, ok ? "1" : "0");
    } catch {
      /* ignore */
    }
    return ok;
  } catch {
    AVAILABILITY_CACHE.set(url, false);
    return false;
  }
}

/** Prefer local file → CDN fallback → null. */
export async function resolveIntroAmbient(
  track: IntroAmbient,
): Promise<string | null> {
  const local = introAmbientUrl(track);
  if (await isIntroAudioAvailable(local)) return local;
  return FALLBACK_AMBIENT[track] ?? null;
}

/** Prefer local VO → null (caller decides whether to use Web Speech). */
export async function resolveIntroVo(
  id: IntroVoId,
  locale: "ar" | "en",
): Promise<string | null> {
  const url = introVoUrl(id, locale);
  return (await isIntroAudioAvailable(url)) ? url : null;
}
