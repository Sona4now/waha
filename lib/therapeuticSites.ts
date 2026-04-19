/**
 * Therapeutic sub-sites inside each destination.
 * Coordinates are real lat/lng for the actual locations — when a user
 * zooms into a destination on the map they see the specific healing
 * spots, not just the town center.
 */

export type TreatmentTag = "مفاصل" | "جلد" | "تنفس" | "توتر" | "استرخاء";

export interface TherapeuticSite {
  id: string;
  destinationId: string;
  name: string;
  subtitle: string;
  icon: string;
  lat: number;
  lng: number;
  treatments: TreatmentTag[];
  /** Short one-liner shown in the map popup */
  pitch: string;
}

export const THERAPEUTIC_SITES: TherapeuticSite[] = [
  // ── سفاجا (Safaga) ──
  {
    id: "mena-ville",
    destinationId: "safaga",
    name: "مينا فيل",
    subtitle: "المنتجع العلاجي الأساسي",
    icon: "🏖️",
    lat: 26.7453,
    lng: 33.9347,
    treatments: ["جلد", "مفاصل"],
    pitch: "مياه البحر الأحمر + رمال سوداء — العلاج الكلاسيكي",
  },
  {
    id: "abu-soma",
    destinationId: "safaga",
    name: "خليج أبو سوما",
    subtitle: "شعاب مرجانية وشمس علاجية",
    icon: "🐠",
    lat: 26.8546,
    lng: 33.9846,
    treatments: ["جلد", "تنفس"],
    pitch: "هواء جاف + أشعة UVA/UVB مثالية للصدفية",
  },
  {
    id: "lotus-bay",
    destinationId: "safaga",
    name: "لوتس باي",
    subtitle: "خليج هادئ للعلاج بالدفن",
    icon: "🏝️",
    lat: 26.6612,
    lng: 33.95,
    treatments: ["مفاصل", "استرخاء"],
    pitch: "الدفن بالرمال السوداء 15-30 دقيقة للروماتيزم",
  },

  // ── سيوة (Siwa) ──
  {
    id: "ain-brezi",
    destinationId: "siwa",
    name: "عين بريزي",
    subtitle: "كبريتية دافئة + طمي معدني",
    icon: "♨️",
    lat: 29.203,
    lng: 25.52,
    treatments: ["جلد", "مفاصل"],
    pitch: "طمي غني بالحديد — معالج قوي للبشرة",
  },
  {
    id: "bir-wahid",
    destinationId: "siwa",
    name: "بئر واحد",
    subtitle: "ساخنة 70°م + باردة",
    icon: "🔥",
    lat: 29.1333,
    lng: 25.4667,
    treatments: ["مفاصل", "استرخاء"],
    pitch: "صدمة حرارية تنشّط الدورة الدموية",
  },
  {
    id: "cleopatra-spring",
    destinationId: "siwa",
    name: "عين كليوباترا",
    subtitle: "قرب معبد آمون",
    icon: "💧",
    lat: 29.2034,
    lng: 25.5455,
    treatments: ["استرخاء", "جلد"],
    pitch: "معدنية + كبريتية — تاريخ يمتد لآلاف السنين",
  },
  {
    id: "salt-lakes",
    destinationId: "siwa",
    name: "بحيرات الملح",
    subtitle: "ملوحة 99% — طفو طبيعي",
    icon: "🧂",
    lat: 29.24,
    lng: 25.58,
    treatments: ["جلد", "استرخاء"],
    pitch: "84 عنصر معدني — تعالج الصدفية والإكزيما",
  },
  {
    id: "salt-cave",
    destinationId: "siwa",
    name: "كهف الملح",
    subtitle: "علاج تنفسي 45 دقيقة",
    icon: "🕳️",
    lat: 29.205,
    lng: 25.55,
    treatments: ["تنفس", "استرخاء"],
    pitch: "Halotherapy للربو والجيوب الأنفية",
  },
  {
    id: "jabal-dakrour",
    destinationId: "siwa",
    name: "جبل الدكرور",
    subtitle: "دفن بالرمال الساخنة",
    icon: "⛰️",
    lat: 29.18,
    lng: 25.54,
    treatments: ["مفاصل"],
    pitch: "دفن 10-15 دقيقة للروماتويد وآلام الظهر",
  },

  // ── سيناء (Sinai) ──
  {
    id: "wadi-asal",
    destinationId: "sinai",
    name: "وادي عسل (رأس سدر)",
    subtitle: "بحيرة كبريتية 200°م عند المنبع",
    icon: "🌋",
    lat: 29.5962,
    lng: 32.6667,
    treatments: ["مفاصل", "جلد"],
    pitch: "150 م² — أقوى بحيرة كبريتية في سيناء",
  },
  {
    id: "serabit-el-khadim",
    destinationId: "sinai",
    name: "سرابيط الخادم",
    subtitle: "هضبة 1200م — فيروز وكوارتز",
    icon: "💎",
    lat: 29.0583,
    lng: 33.4667,
    treatments: ["تنفس", "توتر"],
    pitch: "معبد حتحور + أقدم أبجدية في التاريخ",
  },
  {
    id: "hammam-musa",
    destinationId: "sinai",
    name: "حمام موسى (الطور)",
    subtitle: "5 عيون كبريتية 37°م",
    icon: "♨️",
    lat: 28.2333,
    lng: 33.6167,
    treatments: ["جلد", "مفاصل"],
    pitch: "للصدفية والإكزيما والروماتيزم",
  },
  {
    id: "oyoun-musa",
    destinationId: "sinai",
    name: "عيون موسى",
    subtitle: "12 عين ذُكرت في التوراة",
    icon: "🌿",
    lat: 29.8333,
    lng: 32.7,
    treatments: ["استرخاء", "تنفس"],
    pitch: "70 نخلة + مياه معدنية — افتُتحت 2018",
  },

  // ── الفيوم (Fayoum) ──
  {
    id: "whale-valley",
    destinationId: "fayoum",
    name: "وادي الحيتان",
    subtitle: "تراث يونسكو 2005 — 400+ حفرية",
    icon: "🐋",
    lat: 29.2667,
    lng: 30.0333,
    treatments: ["تنفس", "مفاصل", "توتر"],
    pitch: "هواء صحراوي جاف — مثالي لمرضى الحساسية",
  },
  {
    id: "rayan-springs",
    destinationId: "fayoum",
    name: "عيون الريان",
    subtitle: "4 ينابيع كبريتية دافئة",
    icon: "💧",
    lat: 29.2,
    lng: 30.4,
    treatments: ["مفاصل", "جلد"],
    pitch: "كبريتيد هيدروجين + مغنسيوم — للروماتيزم",
  },
  {
    id: "magic-lake",
    destinationId: "fayoum",
    name: "البحيرة المسحورة",
    subtitle: "عمق 35م — تتغير ألوانها كل ساعة",
    icon: "🏞️",
    lat: 29.55,
    lng: 30.1833,
    treatments: ["توتر", "استرخاء"],
    pitch: "استشفاء نفسي + هدوء تام",
  },
  {
    id: "tunis-village",
    destinationId: "fayoum",
    name: "قرية تونس",
    subtitle: "قرية فنية — ورش فخار",
    icon: "🏺",
    lat: 29.4633,
    lng: 30.6733,
    treatments: ["توتر", "استرخاء"],
    pitch: "تدليك طبيعي + حجامة + فن يدوي",
  },

  // ── الواحات البحرية (Bahariya) ──
  {
    id: "white-desert",
    destinationId: "bahariya",
    name: "الصحراء البيضاء",
    subtitle: "تكوينات جيرية فريدة",
    icon: "❄️",
    lat: 27.55,
    lng: 28.5833,
    treatments: ["توتر", "استرخاء"],
    pitch: "استشفاء نفسي — Sense of Awe العلمي",
  },
  {
    id: "black-desert",
    destinationId: "bahariya",
    name: "الصحراء السوداء",
    subtitle: "بازلت وكوارتز",
    icon: "🏔️",
    lat: 28.0,
    lng: 28.8,
    treatments: ["توتر"],
    pitch: "مشهد بركاني يقلل التوتر بشكل ملحوظ",
  },
  {
    id: "crystal-mountain",
    destinationId: "bahariya",
    name: "جبل الكريستال",
    subtitle: "بلورات كوارتز طبيعية",
    icon: "💎",
    lat: 27.83,
    lng: 28.7,
    treatments: ["توتر", "استرخاء"],
    pitch: "نقطة تأمل وتوازن نفسي",
  },
  {
    id: "bir-sigam",
    destinationId: "bahariya",
    name: "بئر سيجام",
    subtitle: "كبريتية ساخنة 45°م",
    icon: "♨️",
    lat: 28.3356,
    lng: 28.865,
    treatments: ["مفاصل", "استرخاء"],
    pitch: "للروماتيزم ومشاكل الجهاز الهضمي",
  },

  // ── وادي دجلة (Wadi Degla) ──
  {
    id: "wadi-degla-main",
    destinationId: "wadi-degla",
    name: "المحمية — المدخل الرئيسي",
    subtitle: "طريق القطامية-العين السخنة",
    icon: "🥾",
    lat: 29.9333,
    lng: 31.4,
    treatments: ["تنفس", "توتر", "استرخاء"],
    pitch: "100+ كم مسارات هايكنج + كانيونات جيرية",
  },

  // ── مزارع شجيع (Shagie Farms) ──
  {
    id: "shagie-main",
    destinationId: "shagie-farms",
    name: "المزرعة الرئيسية",
    subtitle: "ك15 طريق الإسماعيلية-فايد",
    icon: "🥭",
    lat: 30.5965,
    lng: 32.2715,
    treatments: ["توتر", "استرخاء"],
    pitch: "Eco-therapy + سياحة المانجو التفاعلية",
  },
];

export function getSitesForDestination(destinationId: string): TherapeuticSite[] {
  return THERAPEUTIC_SITES.filter((s) => s.destinationId === destinationId);
}

export function getAllSites(): TherapeuticSite[] {
  return THERAPEUTIC_SITES;
}
