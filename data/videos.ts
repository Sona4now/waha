/**
 * Video registry for Waaha.
 *
 * All videos are hosted on bunny.net (bunny.stream).
 * Embed URL format:
 *   https://iframe.mediadelivery.net/embed/{BUNNY_LIBRARY_ID}/{bunnyId}
 *
 * To add a video:
 *   1. Upload to bunny.net → copy the Video GUID
 *   2. Add an entry here with bunnyId = that GUID
 *   3. Push → auto-deployed
 *
 * bunnyId = "" means "coming soon" — card shows placeholder.
 */

export type VideoCategory =
  | "destination"   // رحلة / تغطية وجهة
  | "documentary"   // فيلم وثائقي
  | "report"        // تقرير صحفي
  | "interview"     // مقابلة
  | "about"         // عن واحة
  | "podcast";      // بودكاست

export interface Video {
  /** Stable slug — used as React key + URL hash */
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  category: VideoCategory;
  /** Links to a DestinationFull id — shows video on that destination page too */
  destination?: string;
  /** Video GUID from bunny.net — leave "" until uploaded */
  bunnyId: string;
  /** Bunny library ID — set once per account in BUNNY_LIBRARY_ID env var */
  bunnyLibraryId: string;
  /** Optional Cloudinary thumbnail override. Falls back to bunny auto-thumbnail */
  thumbnail?: string;
  /** Duration in seconds (approximate) */
  duration?: number;
  /** Show in homepage featured row */
  featured?: boolean;
}

/** Your bunny.net Library ID — set in .env.local as NEXT_PUBLIC_BUNNY_LIBRARY_ID */
const LIB = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID ?? "";

export const VIDEOS: Video[] = [

  // ── وثائقيات / تعريف ─────────────────────────────────────────────
  {
    id: "intro-eco-tourism",
    title: "التعريف بالسياحة البيئية الاستشفائية",
    titleEn: "Introduction to Eco-Healing Tourism",
    description: "نظرة شاملة على مفهوم السياحة البيئية الاستشفائية وأهميتها لصحة الإنسان وارتباطها بالطبيعة.",
    descriptionEn: "A comprehensive look at eco-healing tourism, its importance for human health, and its connection to nature.",
    category: "documentary",
    bunnyId: "",
    bunnyLibraryId: LIB,
    featured: true,
  },

  // ── الوجهات ──────────────────────────────────────────────────────
  {
    id: "trip-bahariya",
    title: "الواحات البحرية",
    titleEn: "Bahariya Oasis",
    description: "تجربة ميدانية كاملة في الواحات البحرية — الصحراء البيضاء، العيون الحارة، والتخييم تحت النجوم.",
    descriptionEn: "A full field experience in Bahariya — White Desert, hot springs, and camping under the stars.",
    category: "destination",
    destination: "bahariya",
    bunnyId: "",
    bunnyLibraryId: LIB,
    featured: true,
  },
  {
    id: "safari-siwa",
    title: "سياحة السفاري",
    titleEn: "Safari Tourism",
    description: "مغامرة السفاري في صحراء سيوة — كثبان رملية وغروب شمس لا يُنسى.",
    descriptionEn: "Safari adventure in Siwa's desert — sand dunes and an unforgettable sunset.",
    category: "destination",
    destination: "siwa",
    bunnyId: "",
    bunnyLibraryId: LIB,
  },
  {
    id: "safaga-video",
    title: "سفاجا",
    titleEn: "Safaga",
    description: "تغطية كاملة لسفاجا: الرمال السوداء، مياه البحر الأحمر العلاجية، والحياة الهادئة على الساحل.",
    descriptionEn: "Full coverage of Safaga: black sands, healing Red Sea waters, and quiet coastal life.",
    category: "destination",
    destination: "safaga",
    bunnyId: "",
    bunnyLibraryId: LIB,
    featured: true,
  },
  {
    id: "fayoum-video",
    title: "الفيوم",
    titleEn: "Fayoum",
    description: "رحلة إلى الفيوم: بحيرة قارون، وادي الحيتان، والطبيعة الساحرة على بعد ساعة من القاهرة.",
    descriptionEn: "A trip to Fayoum: Lake Qarun, Wadi Al-Hitan, and stunning nature just an hour from Cairo.",
    category: "destination",
    destination: "fayoum",
    bunnyId: "",
    bunnyLibraryId: LIB,
  },
  {
    id: "wadi-degla-video",
    title: "محمية وادي دجلة",
    titleEn: "Wadi Degla Reserve",
    description: "استكشاف محمية وادي دجلة — الكانيونات والمسارات والصمت الصحراوي على أطراف القاهرة.",
    descriptionEn: "Exploring Wadi Degla Reserve — canyons, trails, and desert silence at Cairo's edge.",
    category: "destination",
    destination: "wadi-degla",
    bunnyId: "",
    bunnyLibraryId: LIB,
  },
  {
    id: "shagie-farms-video",
    title: "مزرعة شجيع الإسماعيلية",
    titleEn: "Shagie Farms — Ismailia",
    description: "تجربة مزارع شجيع: قطف المانجو، الحياة الريفية، والعلاج البيئي في الإسماعيلية.",
    descriptionEn: "The Shagie Farms experience: mango picking, rural life, and eco-therapy in Ismailia.",
    category: "destination",
    destination: "shagie-farms",
    bunnyId: "",
    bunnyLibraryId: LIB,
  },

  // ── وثائقيات ─────────────────────────────────────────────────────
  {
    id: "documentary-siwa",
    title: "فيلم سيوة",
    titleEn: "Siwa — A Documentary",
    description: "فيلم وثائقي كامل عن سيوة: تاريخها، ثقافتها الأمازيغية، وطبيعتها الفريدة.",
    descriptionEn: "A full documentary about Siwa: its history, Amazigh culture, and unique nature.",
    category: "documentary",
    destination: "siwa",
    bunnyId: "",
    bunnyLibraryId: LIB,
    featured: true,
  },

  // ── تقارير ───────────────────────────────────────────────────────
  {
    id: "report-siwa",
    title: "تقرير سيوة",
    titleEn: "Siwa Report",
    description: "تقرير ميداني شامل من واحة سيوة — العيون الكبريتية، بحيرات الملح، والمعالم التاريخية.",
    descriptionEn: "A comprehensive field report from Siwa Oasis — sulfur springs, salt lakes, and historic landmarks.",
    category: "report",
    destination: "siwa",
    bunnyId: "",
    bunnyLibraryId: LIB,
  },
  {
    id: "report-salt-lakes",
    title: "بحيرات الملح",
    titleEn: "Salt Lakes",
    description: "تقرير عن بحيرات الملح العلاجية في سيوة وتأثيرها الصحي الفريد.",
    descriptionEn: "Report on Siwa's therapeutic salt lakes and their unique health benefits.",
    category: "report",
    destination: "siwa",
    bunnyId: "",
    bunnyLibraryId: LIB,
  },
  {
    id: "report-siwa-market",
    title: "السوق في سيوة",
    titleEn: "Siwa's Market",
    description: "تقرير من داخل سوق سيوة — الحرف اليدوية، التوابل، وحياة السكان الأصليين.",
    descriptionEn: "Report from inside Siwa's market — crafts, spices, and indigenous daily life.",
    category: "report",
    destination: "siwa",
    bunnyId: "",
    bunnyLibraryId: LIB,
  },
  {
    id: "report-amazigh",
    title: "اللغة الأمازيغية",
    titleEn: "The Amazigh Language",
    description: "تقرير عن اللغة الأمازيغية في سيوة: أصولها، متحدثوها، ومستقبلها.",
    descriptionEn: "Report on the Amazigh language in Siwa: its origins, speakers, and future.",
    category: "report",
    destination: "siwa",
    bunnyId: "",
    bunnyLibraryId: LIB,
  },
  {
    id: "report-palms",
    title: "النخل",
    titleEn: "The Palm Trees",
    description: "تقرير عن النخل الأمازيغي في سيوة ودوره في الاقتصاد والثقافة المحلية.",
    descriptionEn: "Report on Siwa's Amazigh palm trees and their role in local economy and culture.",
    category: "report",
    destination: "siwa",
    bunnyId: "",
    bunnyLibraryId: LIB,
  },
  {
    id: "report-prevention",
    title: "الوقاية خير من العلاج",
    titleEn: "Prevention Is Better Than Cure",
    description: "تقرير عام عن أهمية الوقاية الصحية وكيف تساعد السياحة العلاجية في الحفاظ على الصحة قبل المرض.",
    descriptionEn: "A general report on the importance of preventive health and how wellness tourism helps maintain health before illness strikes.",
    category: "report",
    bunnyId: "",
    bunnyLibraryId: LIB,
  },

  // ── مقابلات ──────────────────────────────────────────────────────
  {
    id: "interview-chinese",
    title: "مقابلة السائح الصيني",
    titleEn: "Interview with the Chinese Traveler",
    description: "مقابلة مع مسافر صيني يتحدث عن تجربته في سيوة ومصر ورأيه في السياحة العلاجية.",
    descriptionEn: "Interview with a Chinese traveler sharing his experience in Siwa, Egypt, and healing tourism.",
    category: "interview",
    destination: "siwa",
    bunnyId: "",
    bunnyLibraryId: LIB,
  },
  {
    id: "interview-sheikh-dhanain",
    title: "شيخ قبيلة الظناين",
    titleEn: "Sheikh of the Al-Dhanain Tribe",
    description: "مقابلة حصرية مع شيخ قبيلة الظناين — الموروث القبلي، الطبيعة، والحياة في الصحراء.",
    descriptionEn: "An exclusive interview with the Sheikh of the Al-Dhanain tribe — tribal heritage, nature, and life in the desert.",
    category: "interview",
    destination: "siwa",
    bunnyId: "",
    bunnyLibraryId: LIB,
  },

  // ── عن واحة ──────────────────────────────────────────────────────
  {
    id: "about-waaha",
    title: "القصة وراء الموقع",
    titleEn: "The Story Behind the Website",
    description: "فيديو يشرح فكرة منصة واحة وكيف بدأت والهدف منها.",
    descriptionEn: "A video explaining the Waaha platform concept, how it started, and its mission.",
    category: "about",
    bunnyId: "",
    bunnyLibraryId: LIB,
    featured: true,
  },

  // ── بودكاست ──────────────────────────────────────────────────────
  {
    id: "podcast-derbala",
    title: "بودكاست محمد درباله — خبير السياحة العلاجية",
    titleEn: "Podcast with Mohamed Derbala — Healing Tourism Expert",
    description: "جلسة بودكاست مع محمد درباله، خبير متخصص في السياحة العلاجية، يتحدث عن مستقبل القطاع في مصر.",
    descriptionEn: "Podcast session with Mohamed Derbala, a healing tourism expert, discussing the future of the sector in Egypt.",
    category: "podcast",
    bunnyId: "",
    bunnyLibraryId: LIB,
    featured: true,
  },
];

/** All videos for a given destination */
export function videosByDestination(destId: string): Video[] {
  return VIDEOS.filter((v) => v.destination === destId);
}

/** All videos in a category */
export function videosByCategory(cat: VideoCategory): Video[] {
  return VIDEOS.filter((v) => v.category === cat);
}

/** Featured videos (homepage row) */
export function featuredVideos(): Video[] {
  return VIDEOS.filter((v) => v.featured);
}

/** Bunny embed URL for a video */
export function bunnyEmbedUrl(video: Video): string {
  return `https://iframe.mediadelivery.net/embed/${video.bunnyLibraryId}/${video.bunnyId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`;
}

/** Bunny auto-thumbnail URL */
export function bunnyThumbnailUrl(video: Video): string {
  if (video.thumbnail) return video.thumbnail;
  return `https://vz-${video.bunnyLibraryId}.b-cdn.net/${video.bunnyId}/thumbnail.jpg`;
}

export const CATEGORY_LABELS: Record<VideoCategory, { ar: string; en: string }> = {
  destination: { ar: "وجهات", en: "Destinations" },
  documentary: { ar: "وثائقيات", en: "Documentaries" },
  report:      { ar: "تقارير", en: "Reports" },
  interview:   { ar: "مقابلات", en: "Interviews" },
  about:       { ar: "عن واحة", en: "About Waaha" },
  podcast:     { ar: "بودكاست", en: "Podcast" },
};
