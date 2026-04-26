/**
 * English copy for the four narrative chapters on /destinations.
 *
 * Mirrors `data/environmentChapters.ts`. Keyed by `chapter.key`. The
 * localizer falls back to Arabic if a field is missing here.
 */

export interface ChapterEnFields {
  name?: string;
  tagline?: string;
  intro?: string;
}

export const CHAPTERS_EN: Record<string, ChapterEnFields> = {
  sea: {
    name: "The Sea",
    tagline: "Where inflammation dissolves into the salt of the earth",
    intro:
      "Along the Red Sea coast flow some of the saltiest waters on the planet. The black sand stores the sun's heat and lifts inflammation out from beneath the skin, and the rays here reach deeper wavelengths than those over the Mediterranean — which is why Safaga has earned international recognition for the treatment of psoriasis. Salt, sun, and mineral, in a balance you'll find nowhere else.",
  },
  mountain: {
    name: "The Mountains",
    tagline: "At altitude, the air sheds its impurities",
    intro:
      "At two thousand metres, the respiratory system suddenly has nothing to fight — no pollen, no exhaust, no urban dust. Breathing deepens without effort, and the chest opens. The mountains of Sinai have been a refuge for prophets and the weary for thousands of years, not because they're remote but because they separate a person from their noise. Here, silence is medicine and altitude is a cure.",
  },
  oasis: {
    name: "The Oases",
    tagline: "Where life takes root in the most difficult places",
    intro:
      "In the heart of the desert, springs have flowed without interruption for millennia. Siwa, Fayoum, and Shagie Farms — three oases that share no single geography but speak a common language of sulfuric waters, fruit trees, and a slower pace of life. An oasis is a promise: that drought is not the end, and that rest can grow even when the land around you is desert.",
  },
  desert: {
    name: "The Deserts",
    tagline: "The deepest reset a human can know",
    intro:
      "The White Desert, the Black Desert, and the canyons on Cairo's outskirts — one place with one climate: nothing. No noise, no notifications, no one. Camping under a sky free of light pollution resets melatonin, and the millions of stars overhead remind the mind of its true scale. Sometimes, doing nothing is the most important thing you can do.",
  },
};
