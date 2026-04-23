import { destinations, type Destination } from "@/data/destinations";

export type Answers = {
  need: string;
  environment: string;
  journeyStyle: string;
};

/**
 * Primary mapping: (need × environment × journeyStyle?) → destination id.
 *
 * The first 12 entries are the original need×environment table kept for
 * backward compatibility (so anyone mid-quiz still lands somewhere
 * reasonable even if they skip journeyStyle).
 *
 * The `*_calm` entries below route specifically to the "close/accessible"
 * options — wadi-degla (an hour from Cairo, gentle canyons) and
 * shagie-farms (eco-farm therapy, forest bathing). This was bug H3: those
 * two destinations existed in the main site but were unreachable from the
 * cinematic intro.
 */
const MAPPING: Record<string, string> = {
  // need × environment (fallback when journeyStyle isn't captured)
  body_sea: "safaga",
  body_desert: "siwa",
  body_mountains: "sinai",
  body_oasis: "fayoum",
  mind_sea: "safaga",
  mind_desert: "siwa",
  mind_mountains: "sinai",
  mind_oasis: "shagie-farms", // was "siwa" — accidental duplicate; shagie-farms
  //                            fits "mind + oasis" better (quiet eco-farm).
  relax_sea: "safaga",
  relax_desert: "bahariya",
  relax_mountains: "sinai",
  relax_oasis: "fayoum",

  // need × environment × journeyStyle — specific overrides.
  // "calm" (هادئة) + mountains → wadi-degla: gentle walks, quick escape,
  // doesn't require a multi-day trip like sinai.
  body_mountains_calm: "wadi-degla",
  mind_mountains_calm: "wadi-degla",
  relax_mountains_calm: "wadi-degla",

  // "calm" (هادئة) + oasis → shagie-farms: slower, more contained than fayoum.
  body_oasis_calm: "shagie-farms",
  relax_oasis_calm: "shagie-farms",
};

const ENV_FALLBACK: Record<string, string> = {
  sea: "safaga",
  desert: "siwa",
  mountains: "sinai",
  oasis: "fayoum",
};

export function getRecommendation(answers: Partial<Answers>): Destination {
  const { need, environment, journeyStyle } = answers;

  // Best match: all three answered → look for the specific override first.
  if (need && environment && journeyStyle) {
    const specificKey = `${need}_${environment}_${journeyStyle}`;
    const specificId = MAPPING[specificKey];
    if (specificId && destinations[specificId]) return destinations[specificId];
  }

  // Next: two answers → use the standard need×environment map.
  if (need && environment) {
    const key = `${need}_${environment}`;
    const id = MAPPING[key];
    if (id && destinations[id]) return destinations[id];
  }

  // Fallback: only environment answered.
  if (environment) {
    const id = ENV_FALLBACK[environment];
    if (id && destinations[id]) return destinations[id];
  }

  return destinations.fayoum;
}
