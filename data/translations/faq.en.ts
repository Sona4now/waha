/**
 * English FAQ entries that mirror the Arabic FAQ data inside
 * `components/site/FAQ.tsx`. Two sets:
 *   - `COMMON` — general questions appended to every destination
 *   - `BY_DEST` — destination-specific questions
 *
 * The component (FAQ.tsx) calls into here when locale === "en"; it falls
 * back to the Arabic source if no English entry exists.
 */

export interface FAQEnItem {
  question: string;
  answer: string;
}

export const COMMON_EN: FAQEnItem[] = [
  {
    question: "Can older travellers benefit from the therapy here?",
    answer:
      "Yes, but it's best to consult a doctor before travelling, especially if you have high blood pressure, heart disease, or diabetes. Some treatments — like hot-sand burial or very-warm baths — may not suit every condition.",
  },
  {
    question: "What does a healing trip roughly cost?",
    answer:
      "Cost varies with the resort, length of stay, treatment type, and services. Check our packages on each destination page for live pricing, and contact us via WhatsApp for a tailored quote. A typical wellness stay runs two to four weeks.",
  },
  {
    question: "Do I need a visa or special permit?",
    answer:
      "Egyptian citizens need no permits. Foreign visitors need a regular Egypt entry visa — wellness tourism inside Egypt requires no extra permit beyond that.",
  },
];

export const BY_DEST_EN: Record<string, FAQEnItem[]> = {
  safaga: [
    {
      question: "What's the ideal length for a Safaga programme?",
      answer:
        "Studies suggest two to four weeks delivers the best results. Patients with psoriasis usually see noticeable improvement after two weeks of daily sun + sea sessions, with around 50% improvement after a month.",
    },
    {
      question: "Is sun therapy safe for the skin?",
      answer:
        "Yes — under medical supervision. The best windows are sunrise and sunset (longer-wavelength rays). Start with short sessions (around 10 minutes) and build up gradually. Sunscreen on the nose and eyelids is essential.",
    },
    {
      question: "Can I bathe in the black sand directly?",
      answer:
        "Yes, but only with supervision. Sessions are typically 15–30 minutes, with plenty of water before and after. Safaga's black sand is safe — its natural radioactivity is at very low and safe levels.",
    },
  ],
  siwa: [
    {
      question: "How do I get to Siwa?",
      answer:
        "Siwa is about 820 km from Cairo. The closest airport is Marsa Matrouh (≈2 hours by car); from there you can rent a car or take a microbus. There are also direct intercity buses from Cairo.",
    },
    {
      question: "Are the sulfuric springs safe for everyone?",
      answer:
        "The mild-temperature springs (30–40°C) are safe for most. Very hot ones (like Bir Wahed at ≈70°C) aren't recommended for pregnant women or anyone with high blood pressure or heart disease. Always start with a cool spring and warm up gradually.",
    },
    {
      question: "What are the accommodation options in Siwa?",
      answer:
        "Siwa has eco-lodges built from kershef (salt and clay) — Adrère Amellal and Taghouzit are the famous ones — alongside regular hotels and guest houses. Eco-lodges offer the most complete healing-stay experience.",
    },
  ],
  sinai: [
    {
      question: "Is Sinai cold in winter?",
      answer:
        "Yes, especially in the higher mountain areas like Saint Catherine, where temperatures can drop below freezing at night. Coastal areas like Dahab and Nuweiba stay mild year-round (15–25°C in winter).",
    },
    {
      question: "When's the best time to visit Hammam Musa?",
      answer:
        "October to April is the sweet spot — moderate temperatures and ideal heat for therapy sessions. Summer can be too hot, especially when daytime temperatures exceed 38°C.",
    },
    {
      question: "Is Serabit El-Khadem open to visitors?",
      answer:
        "Yes, but it requires special arrangements as it's a protected archaeological site. Coordinate with the Ministry of Antiquities or local guides before visiting, and go in a group.",
    },
  ],
  fayoum: [
    {
      question: "How far is Fayoum from Cairo?",
      answer:
        "Fayoum is just 100 km from Cairo — about 1.5 hours by car. That makes it Egypt's nearest and easiest healing destination from the capital, perfect for a weekend trip.",
    },
    {
      question: "What's the best activity at Wadi El-Hitan?",
      answer:
        "At Whale Valley you can see 400+ ancient whale fossils (a UNESCO heritage site), join a desert safari, do birdwatching and night-sky viewing, and benefit from the dry, clean desert air that helps allergy sufferers.",
    },
    {
      question: "Is the Magic Lake safe to swim in?",
      answer:
        "The lake is very deep (35 m) and swimming is forbidden for safety reasons. The surrounding area is perfect for meditation, walking, photography, and rest — that's what makes it a wellness destination for the mind.",
    },
  ],
  bahariya: [
    {
      question: "What's the best way to see the White Desert?",
      answer:
        "A guided 4×4 safari with a local guide. Camping overnight is highly recommended so you can see the clear sky and the stars — that adds a powerful psychological-wellness dimension to the trip.",
    },
    {
      question: "Is Bir Sigam safe to bathe in?",
      answer:
        "Yes — Bir Sigam (45°C) suits most people and helps with rheumatism and joint inflammation. It isn't recommended for pregnant women or anyone with high blood pressure. 15–20-minute sessions with plenty of water before and after are best.",
    },
    {
      question: "How much does a White Desert camping trip cost?",
      answer:
        "Camping in the White Desert can range from a simple guided trip to a VIP service with full catering, music, and a campfire. Contact us via WhatsApp for current pricing from our certified partner guides.",
    },
  ],
  "wadi-degla": [
    {
      question: "Do I need a permit to enter the reserve?",
      answer:
        "No — entry is open during daylight hours with a small ticket fee at the gate. Camping requires advance permission from the EEAA reserve office.",
    },
    {
      question: "Is mobile signal available in the wadi?",
      answer:
        "Coverage is patchy in much of the wadi, which is part of the appeal — natural digital detox. Tell someone your route and expected return time before you go in.",
    },
    {
      question: "Are there guided hikes available?",
      answer:
        "Yes — several local outfitters and our partner programmes run guided hikes ranging from a half-day taster to overnight camping. The Standard package on this page covers a guided full-day hike with transport from Maadi.",
    },
  ],
  "shagie-farms": [
    {
      question: "When is the best time to visit Shagie Farms?",
      answer:
        "The full experience is best during mango harvest season (July–October). Outside the harvest you'll still enjoy the orchards, organic cuisine, and farm activities, but won't be able to pick fruit.",
    },
    {
      question: "Is the farm suitable for children?",
      answer:
        "Absolutely — it's one of the most family-friendly destinations on the platform. Hands-on activities (cow milking, horse riding, fruit picking, fishing) are designed for all ages.",
    },
    {
      question: "How do I get to Shagie Farms?",
      answer:
        "The farm is at km 15 of the Ismailia–Fayed desert road, about 1 hour (125 km) from Cairo. Our packages include round-trip transport; you can also drive yourself or take a private taxi.",
    },
  ],
};
