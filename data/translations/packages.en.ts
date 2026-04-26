/**
 * English overlays for `data/pricingPackages.ts`. Indexed by
 * destinationId, then by tier so the localizer can pick the right
 * package without an array search.
 */

interface PackageEnFields {
  name?: string;
  duration?: string;
  highlight?: string;
  includes?: string[];
  notIncluded?: string[];
}

const baseExclusionsEn = [
  "International airfare (if needed)",
  "Lunch / dinner outside the programme",
  "Tips and personal expenses",
];

export interface DestinationPricingEn {
  packages: Record<string, PackageEnFields>;
  note?: string;
}

export const PRICING_EN: Record<string, DestinationPricingEn> = {
  safaga: {
    packages: {
      basic: {
        name: "Healing Starter",
        duration: "5 days / 4 nights",
        highlight: "The essentials of black-sand therapy",
        includes: [
          "Stay at a 3-star beachfront hotel",
          "Open daily breakfast",
          "5 black-sand burial sessions",
          "Airport transfers in and out",
          "Brief daily medical check-in",
        ],
        notIncluded: baseExclusionsEn,
      },
      standard: {
        name: "Recognised Programme",
        duration: "10 days / 9 nights",
        highlight: "International-style programme for psoriasis & rheumatic conditions",
        includes: [
          "Stay at a 4-star All-Inclusive hotel",
          "10 sand + sun therapy sessions",
          "5 guided Red Sea swim sessions",
          "Pre- and post-programme medical assessment",
          "Evening meditation & breathing workshop",
          "Transfers + a sightseeing trip to Qurna",
        ],
        notIncluded: baseExclusionsEn,
      },
      premium: {
        name: "Complete Programme",
        duration: "21 days / 20 nights",
        highlight: "Highest reported recovery rates for chronic psoriasis",
        includes: [
          "Luxury suite in a 5-star resort",
          "20 sand + 15 sea therapy sessions",
          "Daily medical follow-up + dermatology consultant",
          "Blood work + biomarker tracking pre/post",
          "Personalised therapeutic nutrition",
          "Yoga + therapeutic massage sessions",
          "Eastern Desert safari trip",
        ],
        notIncluded: baseExclusionsEn,
      },
    },
    note: "Prices are per person in a double room. Single supplement +30%. Groups of 4+ get 10% off.",
  },
  siwa: {
    packages: {
      basic: {
        name: "Crowd-Free Escape",
        duration: "3 days / 2 nights",
        highlight: "A quiet weekend in the oasis",
        includes: [
          "Stay at a local eco-lodge",
          "Breakfast + traditional Siwan dinner",
          "3 sulfuric-spring sessions",
          "Tour of Shali Fortress + Temple of Amun",
          "Transport from Cairo (VIP coach)",
        ],
        notIncluded: baseExclusionsEn,
      },
      standard: {
        name: "Full Experience",
        duration: "5 days / 4 nights",
        highlight: "Natural therapy + cultural discovery",
        includes: [
          "Stay at a premium eco-lodge",
          "All-Inclusive — authentic Siwan cuisine",
          "8 spring sessions across Cleopatra, Quraisht, and Tamusi",
          "One sand-burial + one salt-bath session",
          "Great Sand Sea safari + sunset",
          "Natural-essential-oil workshop",
        ],
        notIncluded: baseExclusionsEn,
      },
      premium: {
        name: "Complete Retreat",
        duration: "10 days / 9 nights",
        highlight: "Full body-and-mind detox in the heart of the desert",
        includes: [
          "Luxury tent on the salt lake",
          "All-Inclusive + organic nutrition",
          "15+ spring + salt-therapy sessions",
          "Daily yoga & meditation",
          "Daily medical supervision + therapeutic massage",
          "One night of camping in the Great Sand Sea",
          "Craft workshops with the local community",
        ],
        notIncluded: baseExclusionsEn,
      },
    },
    note: "December–February prices (high season). Summer (July–August) 25% off.",
  },
  sinai: {
    packages: {
      basic: {
        name: "Bedouin Taster",
        duration: "3 days / 2 nights",
        highlight: "A weekend in Dahab or Saint Catherine",
        includes: [
          "Stay at a beachfront Bedouin camp",
          "Breakfast + Bedouin dinner",
          "Two herbal-therapy sessions with a Bedouin practitioner",
          "Wadi Qenya guided walk",
          "Light snorkelling",
        ],
        notIncluded: baseExclusionsEn,
      },
      standard: {
        name: "Mountain Air",
        duration: "5 days / 4 nights",
        highlight: "Climate therapy + Bedouin herbs",
        includes: [
          "Stay at a 4-star eco-hotel",
          "All-Inclusive — Bedouin & Mediterranean cuisine",
          "Sunrise climb of Mount Moses",
          "5 herbal + meditation sessions",
          "Tour of Hammam Musa + Saint Catherine Monastery",
          "One night of camping under the stars",
        ],
        notIncluded: baseExclusionsEn,
      },
      premium: {
        name: "Respiratory Rehab",
        duration: "10 days / 9 nights",
        highlight: "For asthma, allergies, and chronic bronchitis",
        includes: [
          "Beachfront villa in Dahab",
          "All-Inclusive + anti-inflammatory nutrition",
          "Pulmonologist supervision + lung-function tracking",
          "Specialist breathwork + yoga",
          "Bedouin herbal therapy",
          "Advanced diving + guided swimming",
          "Pre- and post-programme blood work",
        ],
        notIncluded: baseExclusionsEn,
      },
    },
    note: "September–May prices. Summer 20% off.",
  },
  fayoum: {
    packages: {
      basic: {
        name: "Day Escape",
        duration: "1 day",
        highlight: "The fastest reset from Cairo",
        includes: [
          "Round-trip transport from Cairo",
          "Lunch at a Lake Qarun restaurant",
          "Visit to Wadi El-Rayan waterfalls",
          "Tour of Wadi El-Hitan (Whale Valley)",
        ],
        notIncluded: baseExclusionsEn,
      },
      standard: {
        name: "Rural Weekend",
        duration: "3 days / 2 nights",
        highlight: "Quiet stay + oasis discovery",
        includes: [
          "Stay at a mud-brick eco-lodge",
          "All-Inclusive — organic rural cuisine",
          "Visit Lake Qarun + the waterfalls + Whale Valley",
          "Horseback riding + boat trip",
          "Pottery workshop in Tunis Village",
        ],
        notIncluded: baseExclusionsEn,
      },
      premium: {
        name: "Long Retreat",
        duration: "7 days / 6 nights",
        highlight: "Deep space for reflection and writing",
        includes: [
          "Stay at a luxury lakeside eco-lodge",
          "All-Inclusive organic dining",
          "Daily yoga + meditation",
          "Daily art and craft workshops",
          "Visits to all historic sites",
          "Therapeutic massage + herbal therapy",
        ],
        notIncluded: baseExclusionsEn,
      },
    },
    note: "Per-person prices include transport from Cairo.",
  },
  bahariya: {
    packages: {
      basic: {
        name: "Desert Taster",
        duration: "3 days / 2 nights",
        highlight: "One night camping in the White Desert",
        includes: [
          "Transport from Cairo",
          "One night in a local hotel + one night camping",
          "All-Inclusive",
          "Safari through the White and Black Deserts",
          "Bishmu hot-spring session",
        ],
        notIncluded: baseExclusionsEn,
      },
      standard: {
        name: "Desert Therapy",
        duration: "5 days / 4 nights",
        highlight: "The core healing-safari programme",
        includes: [
          "Stay at a desert eco-lodge",
          "All-Inclusive",
          "5 hot sulfuric-spring sessions",
          "3 hot-sand burial sessions",
          "Two nights camping under the stars",
          "Visit every major geological site",
        ],
        notIncluded: baseExclusionsEn,
      },
      premium: {
        name: "Complete Safari",
        duration: "10 days / 9 nights",
        highlight: "Discover the White, Black, and Crystal Deserts",
        includes: [
          "Premium accommodation + VIP safari tents",
          "All-Inclusive organic dining",
          "10+ natural therapy sessions",
          "Multi-day safari into the deeper desert",
          "Daily medical supervision + massage",
          "Night-sky photography workshop",
        ],
        notIncluded: baseExclusionsEn,
      },
    },
    note: "October–March only. Summer is unsuitable for desert safari.",
  },
  "wadi-degla": {
    packages: {
      basic: {
        name: "Day Visit",
        duration: "Half day",
        highlight: "The cheapest option for Cairenes",
        includes: [
          "Reserve entry ticket",
          "Trail map",
          "Brief guidance from a local at the entrance",
        ],
        notIncluded: ["Transport", "Food and drinks", "Equipment rental"],
      },
      standard: {
        name: "Guided Hike",
        duration: "Full day",
        highlight: "Hike + lunch + guidance",
        includes: [
          "Round-trip transport from Maadi",
          "Certified hiking guide",
          "8–12 km hike",
          "Lunch + water + snacks",
          "Basic injury insurance",
        ],
      },
      premium: {
        name: "Overnight Camping",
        duration: "1 day + 1 night",
        highlight: "A night under the stars 15 minutes from Maadi",
        includes: [
          "Transport + full camping equipment",
          "Hike + sunset panorama",
          "Dinner + breakfast in the desert",
          "Stargazing meditation session",
          "Breakfast + return in the morning",
        ],
      },
    },
    note: "Per person. Confirm a camping permit with the reserve office in advance.",
  },
  "shagie-farms": {
    packages: {
      basic: {
        name: "Family Visit",
        duration: "1 day",
        highlight: "Family farm experience",
        includes: [
          "Farm entry",
          "Traditional rural lunch",
          "Tour of the orchards",
          "Seasonal fruit picking",
        ],
        notIncluded: ["Transport from Cairo"],
      },
      standard: {
        name: "Farming Weekend",
        duration: "2 days / 1 night",
        highlight: "Full experience + overnight stay",
        includes: [
          "Overnight in air-conditioned tents or chalets",
          "All-Inclusive — heritage cuisine",
          "Planting & cow-milking workshop",
          "Horseback riding",
          "Tour of seasonal farm activities",
        ],
      },
      premium: {
        name: "Harvest-Season Stay",
        duration: "5 days / 4 nights",
        highlight: "Complete experience during mango season (July–October)",
        includes: [
          "Stay in a private luxury chalet",
          "All-Inclusive organic dining",
          "Hands-on participation in the mango harvest",
          "Daily heritage cooking workshops",
          "Eco-therapy sessions among the trees",
          "Visits to neighbouring farms",
        ],
      },
    },
    note: "Harvest season (July–October) is the best time for the full experience.",
  },
};
