/**
 * English translations for the destination data in `data/siteData.ts`.
 *
 * Keyed by destination ID. Any field that's omitted falls back to the
 * Arabic original via `lib/localize.ts`. We translate the *visible*
 * fields here and let the long-form `longDescription` come back in
 * English in a later pass; the short `description` and `pitch` carry
 * most of the user-facing weight.
 */

export interface DestinationEnFields {
  name?: string;
  environment?: string;
  treatments?: string[];
  description?: string;
  longDescription?: string;
  benefits?: { icon: string; text: string }[];
  reasons?: string[];
  trustSignal?: string;
  features?: string[];
  duration?: string;
  costFrom?: string;
  difficulty?: string;
  audience?: string;
  pitch?: string;
}

export const DESTINATIONS_EN: Record<string, DestinationEnFields> = {
  safaga: {
    name: "Safaga",
    environment: "Sea",
    treatments: ["Joints", "Skin", "Respiratory"],
    description:
      "A coastal town on the Red Sea with internationally recognised black-sand and mineral-water therapy.",
    longDescription:
      "Safaga is a small Red Sea coastal town 60 km south of Hurghada with a globally recognised reputation for natural therapy. Scientific studies show its waters carry exceptional concentrations of minerals and trace elements, and its black sand contains naturally low-level radioactive minerals at safe concentrations that support the treatment of psoriasis and rheumatic conditions.",
    benefits: [
      { icon: "💧", text: "Mineral-rich Red Sea waters ease joint pain" },
      { icon: "🏖️", text: "Black sand therapy for psoriasis and skin conditions" },
      { icon: "🌬️", text: "Dry, low-humidity air supports respiratory health" },
      { icon: "☀️", text: "Mild sunshine boosts vitamin D absorption" },
    ],
    reasons: [
      "Documented in international wellness-tourism literature",
      "Egyptian and German academic studies confirm its therapeutic value",
      "Among the highest published recovery rates for psoriasis worldwide",
      "Calm experience away from crowded resort areas",
    ],
    trustSignal: "Published in international wellness-tourism research",
    features: [
      "Therapeutic black sand",
      "Mineral-rich seawater",
      "Mild sunshine",
      "Dry, clean air",
    ],
    duration: "14 days",
    costFrom: "from 8,500 EGP",
    difficulty: "Easy",
    audience: "Families · Older travellers · Recovery",
    pitch:
      "World-renowned for psoriasis healing — backed by international wellness research",
  },
  siwa: {
    name: "Siwa",
    environment: "Oasis",
    treatments: ["Joints", "Skin", "Relaxation"],
    description:
      "A remote oasis in Egypt's Western Desert known for its natural sulfuric springs and untouched landscape.",
    longDescription:
      "Siwa is a striking oasis in the heart of the Western Desert, 50 km from the Libyan border. It is famous for hot sulfuric springs that flow naturally from the earth, and its people maintain a unique Amazigh heritage. Siwa's sulfuric waters have been used for natural therapy for thousands of years.",
    benefits: [
      {
        icon: "♨️",
        text: "Natural hot sulfuric springs to relieve joint inflammation",
      },
      { icon: "🧂", text: "Salt lakes for buoyancy therapy and deep rest" },
      { icon: "🌙", text: "Desert silence supports meditation and clarity" },
      { icon: "🌿", text: "Local organic olive oil for skincare" },
    ],
    reasons: [
      "Hot natural springs flowing year-round",
      "Pristine desert environment, free of pollution",
      "Unique Amazigh cultural heritage adds depth to the experience",
      "Ideal for solitude and emotional renewal",
    ],
    trustSignal: "Recognised natural heritage area",
    features: [
      "Hot sulfuric springs",
      "Natural salt lake",
      "Traditional kershef architecture",
      "Profound desert calm",
    ],
    duration: "21 days",
    costFrom: "from 12,000 EGP",
    difficulty: "Moderate",
    audience: "Seekers of calm · Nature lovers",
    pitch:
      "Sulfuric springs that have flowed for millennia + an authentic Amazigh culture",
  },
  sinai: {
    name: "Sinai",
    environment: "Mountain",
    treatments: ["Stress", "Respiratory", "Relaxation"],
    description:
      "Towering mountains and authentic Bedouin nature with crisp mountain air that renews body and spirit.",
    longDescription:
      "The Sinai Peninsula offers a unique therapeutic experience that combines towering mountains with the sea. Saint Catherine and Dahab provide an ideal setting for natural healing. Pure mountain air and traditional Bedouin herbs have been used for centuries in folk medicine.",
    benefits: [
      { icon: "🏔️", text: "Pure mountain air at high altitude improves breathing" },
      {
        icon: "🌿",
        text: "Bedouin medicinal herbs gathered from the mountains",
      },
      {
        icon: "🧘",
        text: "Quiet environment for meditation and stress relief",
      },
      { icon: "⭐", text: "Clear skies and brilliant stars deepen rest" },
    ],
    reasons: [
      "Some of Egypt's cleanest air, far from city pollution",
      "Long-standing Bedouin tradition of plant-based folk medicine",
      "A spiritual experience among historic, sacred mountains",
      "Perfect for those who need real silence",
    ],
    trustSignal: "Internationally recognised nature reserve",
    features: [
      "Natural hot baths",
      "Mountains for meditation",
      "Medicinal herbs",
      "Pure mountain air",
    ],
    duration: "10 days",
    costFrom: "from 7,500 EGP",
    difficulty: "Moderate",
    audience: "Adventurers · Strength seekers",
    pitch: "Pure mountain air + Hammam Musa + Bedouin medicinal herbs",
  },
  fayoum: {
    name: "Fayoum",
    environment: "Oasis",
    treatments: ["Relaxation", "Stress", "Skin"],
    description:
      "A green oasis just outside Cairo, defined by its lakes and quiet, restful nature.",
    longDescription:
      "Fayoum is a beautiful natural oasis only 100 km from Cairo, famous for Lake Qarun and the Wadi El-Rayan lakes. Its calm environment and stunning landscapes make it an ideal place to slow down and recharge.",
    benefits: [
      { icon: "🏞️", text: "Natural lakes and waterfalls bring instant calm" },
      { icon: "🌾", text: "Lush agricultural views relax the mind and body" },
      { icon: "🦅", text: "Wadi El-Rayan reserve for birdwatching and meditation" },
      { icon: "🧘‍♀️", text: "Close to Cairo — a quick reset without long travel" },
    ],
    reasons: [
      "Egypt's closest natural healing escape to Cairo (1.5 hours away)",
      "Diverse ecosystems — lakes, desert, and farmland in one area",
      "Wadi El-Rayan, one of Egypt's most beautiful reserves",
      "Excellent value compared with longer trips",
    ],
    trustSignal: "Protected natural reserve under Egypt's Ministry of Environment",
    features: [
      "Lake Qarun",
      "Wadi El-Hitan (Whale Valley)",
      "Dry desert air",
      "Close to Cairo",
    ],
    duration: "7 days",
    costFrom: "from 4,500 EGP",
    difficulty: "Easy",
    audience: "Families · Weekend travellers",
    pitch:
      "1.5 hours from Cairo — green oasis + the UNESCO Whale Valley",
  },
  bahariya: {
    name: "Bahariya",
    environment: "Desert",
    treatments: ["Joints", "Relaxation", "Stress"],
    description:
      "An oasis in the heart of the Western Desert, famous for hot springs and the surreal White Desert.",
    longDescription:
      "Bahariya lies in the Western Desert, 370 km from Cairo. It is known for the otherworldly White Desert with its dramatic rock formations and natural hot springs. The hot mineral waters are used to ease joint and muscle pain.",
    benefits: [
      { icon: "♨️", text: "Natural hot springs ease muscle and joint pain" },
      {
        icon: "🏜️",
        text: "The White Desert — a visual experience that calms the mind",
      },
      { icon: "🌌", text: "Clear nights and bright stars for deep rest" },
      { icon: "🫖", text: "Desert herbal teas and traditional Bedouin food" },
    ],
    reasons: [
      "Hot natural springs flowing year-round",
      "The White Desert — among the most striking landscapes on earth",
      "Camping under the stars for deep, lasting calm",
      "Authentic Bedouin culture and warm hospitality",
    ],
    trustSignal: "One of Egypt's oldest inhabited oases",
    features: [
      "The unique White Desert",
      "Hot springs",
      "Sand-burial therapy",
      "Healing safari trips",
    ],
    duration: "14 days",
    costFrom: "from 9,000 EGP",
    difficulty: "Moderate",
    audience: "Adventurers · Healing-safari travellers",
    pitch:
      "The White Desert + ancient Egyptian sand-burial therapy",
  },
  "wadi-degla": {
    name: "Wadi Degla",
    environment: "Desert",
    treatments: ["Stress", "Relaxation", "Respiratory"],
    description:
      "An official protected area on Cairo's edge: limestone canyons, deep desert silence, and rare marine fossils.",
    longDescription:
      "Wadi Degla is a 60 km² officially protected reserve on the edge of Zahraa El-Maadi, less than 15 km from central Cairo. The wadi runs through Eocene-era limestone (60 million years old) with canyons and rock walls reaching 50 m high, plus rare marine fossils visible to the naked eye. Part of Egypt's national ECO Egypt initiative supported by UNDP, it is one of the country's most important eco-tourism destinations.",
    benefits: [
      { icon: "🌬️", text: "Noticeably cleaner air than central Cairo" },
      {
        icon: "🧘",
        text: "Complete desert silence — release from digital pressure",
      },
      { icon: "🏃", text: "100+ km of hiking and running trails to lower cortisol" },
      { icon: "🌡️", text: "Several degrees cooler than the city" },
    ],
    reasons: [
      "Less than 15 minutes from Maadi — Cairo's nearest natural escape",
      "Officially protected under EEAA (Egypt's Environmental Affairs Agency)",
      "Hosted Wadi Degla Marathon and the African Mountain-Bike Championship",
      "Part of the national ECO Egypt initiative with UNDP",
      "Patchy mobile coverage in much of the wadi — natural digital detox",
    ],
    trustSignal: "EEAA protected reserve · ECO Egypt initiative",
    features: [
      "50 m limestone canyons",
      "60-million-year marine fossils",
      "100+ km of hiking trails",
      "Camping under the stars",
    ],
    duration: "1 day",
    costFrom: "minimal",
    difficulty: "Moderate",
    audience: "Athletes · Digital detox · Cairo residents",
    pitch:
      "15 minutes from Maadi — protected reserve + 100 km of trails",
  },
  "shagie-farms": {
    name: "Shagie Farms",
    environment: "Oasis",
    treatments: ["Stress", "Relaxation"],
    description:
      "Egypt's first farm to launch mango-tourism — interactive agricultural experiences and rural eco-therapy in Ismailia.",
    longDescription:
      "Shagie Farms was founded in 1985 by the Shagie family at km 15 of the Ismailia–Fayed desert road. It is a pioneer of agricultural eco-tourism in Africa and the Middle East and the first Egyptian farm to launch a 'mango tourism' concept. Just one hour (125 km) from Cairo, the farm offers a complete experience that combines interactive farming activities, traditional cooking, and eco-therapy. Shagie hosted the 2025 Ismailia International Mango Festival with delegations from 25 countries.",
    benefits: [
      { icon: "🥭", text: "Hand-pick sukkari mangoes — 10+ varieties on site" },
      { icon: "🌿", text: "Organic produce, no industrial chemicals" },
      { icon: "🧠", text: "Eco-therapy clinically linked to better mood and lower anxiety" },
      { icon: "🐴", text: "Hands-on activities — horse riding, milking cows, fishing" },
    ],
    reasons: [
      "A pioneer of agricultural eco-tourism in Africa and the Middle East",
      "The international Mango Festival drew 25 country delegations",
      "Featured by Associated Press and NPR in 2025",
      "Aligned with Egypt's 2030 Sustainable Tourism Strategy and the UN's NEAT programme",
      "One hour from Cairo — perfect for a day trip",
    ],
    trustSignal: "Featured by Associated Press and NPR · TripAdvisor Travellers' Choice",
    features: [
      "Interactive mango tourism",
      "Traditional cooking — eish falaahi and feteer",
      "Farm activities and animals",
      "Air-conditioned tents and chalets",
    ],
    duration: "1 day",
    costFrom: "from 600 EGP",
    difficulty: "Easy",
    audience: "Families · Children · International visitors",
    pitch:
      "Africa's mango-tourism pioneer — a complete rural farm experience",
  },
};
