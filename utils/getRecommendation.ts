import { destinations, Destination } from "@/data/destinations";

export type Answers = {
  need: string;
  environment: string;
  journeyStyle: string;
};

const MAPPING: Record<string, string> = {
  body_sea: "safaga",
  body_desert: "siwa",
  body_mountains: "sinai",
  body_oasis: "fayoum",
  mind_sea: "safaga",
  mind_desert: "siwa",
  mind_mountains: "sinai",
  mind_oasis: "siwa",
  relax_sea: "safaga",
  relax_desert: "bahariya",
  relax_mountains: "sinai",
  relax_oasis: "fayoum",
};

const ENV_FALLBACK: Record<string, string> = {
  sea: "safaga",
  desert: "siwa",
  mountains: "sinai",
  oasis: "fayoum",
};

export function getRecommendation(answers: Partial<Answers>): Destination {
  const { need, environment } = answers;

  if (need && environment) {
    const key = `${need}_${environment}`;
    const id = MAPPING[key];
    if (id && destinations[id]) return destinations[id];
  }

  if (environment) {
    const id = ENV_FALLBACK[environment];
    if (id && destinations[id]) return destinations[id];
  }

  return destinations.fayoum;
}
