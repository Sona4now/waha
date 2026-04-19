/**
 * Audio asset registry for the meditation room.
 *
 * All VO clips, ambient tracks, and chimes are listed here with their
 * file paths under /public/meditation/.  When a file doesn't exist yet,
 * the app gracefully falls back to Web Speech narration for VO and to
 * silence for ambient — so the product keeps working while the user
 * produces recordings.
 *
 * Once the user drops the real MP3 files into /public/meditation/{vo,ambient,chimes},
 * the app uses them automatically — no code changes needed.
 */

/** Root path for all meditation audio assets served from /public */
const MEDITATION_ROOT = "/meditation";

/* ─────────────────────────────────────────────────────────
   Signature clips — reused across every session
   ───────────────────────────────────────────────────────── */

export const SIGNATURE_CLIPS = {
  welcome: {
    id: "signature__welcome",
    url: `${MEDITATION_ROOT}/vo/signature__welcome.mp3`,
    fallbackText: "أهلاً بيك. إنت في واحة دلوقتي. خد نفس. اللحظة دي ليك.",
    estimatedDuration: 14,
  },
  breatheIn: {
    id: "signature__breathe-in",
    url: `${MEDITATION_ROOT}/vo/signature__breathe-in.mp3`,
    fallbackText: "شهيق",
    estimatedDuration: 3,
  },
  breatheHold: {
    id: "signature__breathe-hold",
    url: `${MEDITATION_ROOT}/vo/signature__breathe-hold.mp3`,
    fallbackText: "إمسك",
    estimatedDuration: 2,
  },
  breatheOut: {
    id: "signature__breathe-out",
    url: `${MEDITATION_ROOT}/vo/signature__breathe-out.mp3`,
    fallbackText: "زفير",
    estimatedDuration: 3,
  },
  closing: {
    id: "signature__closing",
    url: `${MEDITATION_ROOT}/vo/signature__closing.mp3`,
    fallbackText:
      "خلصنا. افتح عينيك لما تكون جاهز. وافتكر... اللحظة دي هتفضل معاك.",
    estimatedDuration: 10,
  },
  thankYou: {
    id: "signature__thank-you",
    url: `${MEDITATION_ROOT}/vo/signature__thank-you.mp3`,
    fallbackText: "شكراً إنك أخدت من يومك الوقت ده. جسمك هيشكرك.",
    estimatedDuration: 6,
  },
} as const;

/* ─────────────────────────────────────────────────────────
   Ambient tracks — long loopable environmental audio
   ───────────────────────────────────────────────────────── */

export const AMBIENT_TRACKS = {
  sea: {
    id: "ambient__sea",
    url: `${MEDITATION_ROOT}/ambient/ambient__sea__loop.mp3`,
    // Temporary CDN-hosted preview while the user sources the real track.
    // Remove the fallback line once ambient__sea__loop.mp3 is added.
    fallbackUrl:
      "https://cdn.freesound.org/previews/527/527415_2485975-lq.mp3",
    loop: true,
  },
  seaNight: {
    id: "ambient__sea__night",
    url: `${MEDITATION_ROOT}/ambient/ambient__sea__night.mp3`,
    fallbackUrl:
      "https://cdn.freesound.org/previews/527/527415_2485975-lq.mp3",
    loop: true,
  },
  desert: {
    id: "ambient__desert",
    url: `${MEDITATION_ROOT}/ambient/ambient__desert__loop.mp3`,
    fallbackUrl:
      "https://cdn.freesound.org/previews/370/370293_4397472-lq.mp3",
    loop: true,
  },
  mountain: {
    id: "ambient__mountain",
    url: `${MEDITATION_ROOT}/ambient/ambient__mountain__loop.mp3`,
    fallbackUrl:
      "https://cdn.freesound.org/previews/398/398632_1648170-lq.mp3",
    loop: true,
  },
  oasis: {
    id: "ambient__oasis",
    url: `${MEDITATION_ROOT}/ambient/ambient__oasis__loop.mp3`,
    fallbackUrl:
      "https://cdn.freesound.org/previews/531/531952_10600515-lq.mp3",
    loop: true,
  },
} as const;

export type AmbientKey = keyof typeof AMBIENT_TRACKS;

/* ─────────────────────────────────────────────────────────
   Chimes — short bells/bowls played at transitions
   ───────────────────────────────────────────────────────── */

export const CHIMES = {
  sessionStart: {
    id: "chime__session-start",
    url: `${MEDITATION_ROOT}/chimes/chime__session-start.mp3`,
  },
  sessionEnd: {
    id: "chime__session-end",
    url: `${MEDITATION_ROOT}/chimes/chime__session-end.mp3`,
  },
  breathIn: {
    id: "chime__breath-in",
    url: `${MEDITATION_ROOT}/chimes/chime__breath-in.mp3`,
  },
  breathOut: {
    id: "chime__breath-out",
    url: `${MEDITATION_ROOT}/chimes/chime__breath-out.mp3`,
  },
  milestone: {
    id: "chime__milestone",
    url: `${MEDITATION_ROOT}/chimes/chime__milestone.mp3`,
  },
} as const;

export type ChimeKey = keyof typeof CHIMES;

/* ─────────────────────────────────────────────────────────
   Runtime availability check — probes a single HEAD request
   so the app knows if a real file is there. Result is cached
   in sessionStorage to avoid repeat network hits.
   ───────────────────────────────────────────────────────── */

const AVAILABILITY_CACHE = new Map<string, boolean>();

export async function isAudioAvailable(url: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (AVAILABILITY_CACHE.has(url)) return AVAILABILITY_CACHE.get(url)!;

  // Cheap cache key per URL
  const storageKey = `waaha_audio_avail_${url}`;
  try {
    const cached = sessionStorage.getItem(storageKey);
    if (cached !== null) {
      const v = cached === "1";
      AVAILABILITY_CACHE.set(url, v);
      return v;
    }
  } catch {
    /* private mode — ignore */
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

/** Resolve which URL to use for a VO clip, preferring the real file
 *  when available and falling back to `null` (signals: use Web Speech). */
export async function resolveVoUrl(url: string): Promise<string | null> {
  const ok = await isAudioAvailable(url);
  return ok ? url : null;
}

/** Resolve ambient — prefer real file, then fallback URL, then null. */
export async function resolveAmbientUrl(
  track: (typeof AMBIENT_TRACKS)[AmbientKey],
): Promise<string | null> {
  if (await isAudioAvailable(track.url)) return track.url;
  return track.fallbackUrl ?? null;
}
