/**
 * English overlays for testimonial quotes / labels.
 *
 * Names stay as-is (proper nouns); we translate the role line, the quote
 * itself, the optional condition tag, and the duration. Indexed by
 * destination ID then by name → easy direct lookup.
 *
 * Structure mirrors `data/testimonials.ts`. The localizer falls back to
 * Arabic when no overlay is found.
 */

export interface TestimonialEnFields {
  /** Translated quote body. */
  quote?: string;
  /** Translated role/age line. */
  role?: string;
  /** Translated condition tag (e.g. "Chronic psoriasis"). */
  condition?: string;
  /** Translated duration label (e.g. "14 days"). */
  duration?: string;
}

/** Keyed by destinationId → name → English fields. */
export const TESTIMONIALS_EN: Record<
  string,
  Record<string, TestimonialEnFields>
> = {
  safaga: {
    "أحمد محمود": {
      quote:
        "After 14 days in Safaga, my psoriasis was reduced by 70%. The sea and sun work like a miracle.",
      role: "Engineer · 42",
      condition: "Chronic psoriasis",
      duration: "14 days",
    },
    "نورا حسن": {
      quote:
        "The black sand changed my life. My joint pain dropped noticeably after the first week.",
      role: "Mother of two · 38",
      condition: "Joint inflammation",
      duration: "10 days",
    },
    "كريم عبدالله": {
      quote:
        "I went sceptical, as a doctor, and came back convinced of natural therapy's effectiveness. The results are real.",
      role: "Doctor · 50",
      duration: "21 days",
    },
  },
  siwa: {
    "مريم السيد": {
      quote:
        "Siwa gave me back peace. The silence and the sulfuric springs erased years of stress.",
      role: "Teacher · 34",
      condition: "Chronic anxiety",
      duration: "14 days",
    },
    "عمر طارق": {
      quote:
        "A complete spiritual experience. One night under Siwa's stars changed how I see life.",
      role: "Photographer · 29",
      duration: "7 days",
    },
    "ليلى محمد": {
      quote:
        "Bir Wahed helped me overcome years of chronic back pain after just three weeks.",
      role: "Business owner · 45",
      condition: "Back pain",
      duration: "21 days",
    },
  },
  sinai: {
    "يوسف إبراهيم": {
      quote:
        "Sinai's air shifted my whole healing trajectory. My lungs opened on day one.",
      role: "Athlete · 31",
      condition: "Chronic allergies",
      duration: "10 days",
    },
    "سارة علي": {
      quote:
        "Hammam Musa is unforgettable. I felt new energy after the sulfuric sessions.",
      role: "Pharmacist · 36",
      duration: "7 days",
    },
    "حسين رمضان": {
      quote:
        "Bedouin herbs and mountain air did more for my asthma than any medication.",
      role: "Retired · 62",
      condition: "Asthma",
      duration: "14 days",
    },
  },
  fayoum: {
    "رنا محمد": {
      quote:
        "One weekend in Fayoum was better than a full holiday abroad. An hour from Cairo and you're in another world.",
      role: "Designer · 28",
      duration: "3 days",
    },
    "محمد أحمد": {
      quote:
        "Lake Qarun calmed my nerves. The sound of water and birds is real therapy for stress.",
      role: "Engineer · 40",
      condition: "Chronic stress",
      duration: "5 days",
    },
    "دينا فؤاد": {
      quote:
        "Whale Valley is a scientific and spiritual experience. The kids loved it and learned a lot.",
      role: "Accountant · 33",
      duration: "2 days",
    },
  },
  bahariya: {
    "طارق يوسف": {
      quote:
        "The White Desert is another planet. Camping under the stars is indescribable.",
      role: "Adventurer · 35",
      duration: "5 days",
    },
    "هبة سالم": {
      quote:
        "Burying myself in the warm sand reduced my rheumatism by 80%. A truly Pharaonic therapy.",
      role: "Doctor · 39",
      condition: "Rheumatism",
      duration: "14 days",
    },
    "خالد ممدوح": {
      quote:
        "Hot springs + sand + sky = a complete healing experience.",
      role: "Athlete · 27",
      duration: "7 days",
    },
  },
  "wadi-degla": {
    "أحمد سامي": {
      quote:
        "15 minutes from home and it feels like another planet. Real silence, clean air — true digital detox.",
      role: "Executive · 45",
      duration: "Half day",
    },
    "منى خليل": {
      quote:
        "The trails are long and varied. The Wadi Degla Marathon is something every runner should experience.",
      role: "Runner · 30",
      duration: "Full day",
    },
    "عمرو حسن": {
      quote:
        "Camping one night in the reserve changed how I see life. The stars are extraordinary.",
      role: "Photographer · 32",
      condition: "Chronic stress",
      duration: "2 days",
    },
  },
  "shagie-farms": {
    "سلمى أحمد": {
      quote:
        "My kids picked mangoes for the first time in their lives. A genuinely fun and educational day.",
      role: "Mother · 36",
      duration: "1 day",
    },
    "جيمس ميلر": {
      quote: "The best agri-tourism experience I've had in the Middle East.",
      role: "Visitor · American",
      duration: "1 day",
    },
    "ريم خالد": {
      quote:
        "The rural cuisine and the calm — a real sense of leaving the city behind in just an hour.",
      role: "Homemaker · 42",
      duration: "1 day",
    },
  },
};
