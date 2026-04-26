/**
 * Per-destination testimonials.
 *
 * Lifted out of components/destination/Testimonials.tsx so server-side code
 * (sitemap priorities, JSON-LD schemas, AggregateRating) can read the same
 * source. The component now imports from here.
 */

export interface Testimonial {
  name: string;
  role: string;
  avatarColor: string;
  quote: string;
  rating: number;
  condition?: string;
  duration: string;
  /** ISO date for Schema.org Review.datePublished. Defaulted in helpers. */
  date?: string;
}

export const TESTIMONIALS_BY_DEST: Record<string, Testimonial[]> = {
  safaga: [
    {
      name: "أحمد محمود",
      role: "مهندس · 42 عام",
      avatarColor: "#1d5770",
      quote:
        "بعد 14 يوم في سفاجا، قلت نسبة الصدفية عندي 70%. البحر والشمس معجزة فعلاً.",
      rating: 5,
      condition: "صدفية مزمنة",
      duration: "14 يوم",
      date: "2025-11-12",
    },
    {
      name: "نورا حسن",
      role: "أم لطفلين · 38 عام",
      avatarColor: "#91b149",
      quote:
        "الرمال السوداء غيرت حياتي. آلام مفاصلي قلت بشكل ملحوظ بعد الأسبوع الأول.",
      rating: 5,
      condition: "التهاب مفاصل",
      duration: "10 أيام",
      date: "2025-12-05",
    },
    {
      name: "كريم عبدالله",
      role: "طبيب · 50 عام",
      avatarColor: "#92400e",
      quote:
        "ذهبت متشككاً كطبيب، وعدت مؤمناً بفعالية العلاج الطبيعي. النتائج علمية حقاً.",
      rating: 5,
      duration: "21 يوم",
      date: "2026-01-18",
    },
  ],
  siwa: [
    {
      name: "مريم السيد",
      role: "معلمة · 34 عام",
      avatarColor: "#78350f",
      quote:
        "سيوة أعادت لي السلام. الصمت والعيون الكبريتية مسحوا سنوات من التوتر.",
      rating: 5,
      condition: "قلق وتوتر مزمن",
      duration: "14 يوم",
      date: "2025-10-22",
    },
    {
      name: "عمر طارق",
      role: "مصور · 29 عام",
      avatarColor: "#91b149",
      quote:
        "تجربة روحانية كاملة. ليلة واحدة تحت نجوم سيوة غيرت نظرتي للحياة.",
      rating: 5,
      duration: "7 أيام",
      date: "2025-11-30",
    },
    {
      name: "ليلى محمد",
      role: "صاحبة أعمال · 45 عام",
      avatarColor: "#b45309",
      quote:
        "عيون بئر واحد ساعدتني في التخلص من آلام الظهر المزمنة بعد 3 أسابيع.",
      rating: 4,
      condition: "آلام ظهر",
      duration: "21 يوم",
      date: "2026-02-08",
    },
  ],
  sinai: [
    {
      name: "يوسف إبراهيم",
      role: "رياضي · 31 عام",
      avatarColor: "#44403c",
      quote: "هواء سيناء غير مسار الشفاء بالنسبة لي. الرئتين فتحت من أول يوم.",
      rating: 5,
      condition: "حساسية مزمنة",
      duration: "10 أيام",
      date: "2025-09-14",
    },
    {
      name: "سارة علي",
      role: "صيدلانية · 36 عام",
      avatarColor: "#1d5770",
      quote:
        "حمام موسى تجربة لا تُنسى. شعرت بطاقة جديدة بعد الجلسات الكبريتية.",
      rating: 5,
      duration: "7 أيام",
      date: "2025-12-20",
    },
    {
      name: "حسين رمضان",
      role: "متقاعد · 62 عام",
      avatarColor: "#91b149",
      quote: "الأعشاب البدوية وهواء الجبل عالجوا الربو عندي أكتر من الأدوية.",
      rating: 5,
      condition: "ربو",
      duration: "14 يوم",
      date: "2026-03-04",
    },
  ],
  fayoum: [
    {
      name: "رنا محمد",
      role: "مصممة · 28 عام",
      avatarColor: "#065f46",
      quote:
        "ويكند واحد في الفيوم أحسن من إجازة كاملة في الخارج. ساعة من القاهرة وعالم تاني.",
      rating: 5,
      duration: "3 أيام",
      date: "2025-10-08",
    },
    {
      name: "محمد أحمد",
      role: "مهندس · 40 عام",
      avatarColor: "#91b149",
      quote:
        "بحيرة قارون هدّأت أعصابي. صوت المياه والطيور علاج حقيقي للإجهاد.",
      rating: 5,
      condition: "إجهاد نفسي",
      duration: "5 أيام",
      date: "2026-01-25",
    },
    {
      name: "دينا فؤاد",
      role: "محاسبة · 33 عام",
      avatarColor: "#1d5770",
      quote:
        "وادي الحيتان تجربة علمية وروحانية. الأطفال أحبوها وتعلموا الكثير.",
      rating: 4,
      duration: "يومين",
      date: "2026-02-15",
    },
  ],
  bahariya: [
    {
      name: "طارق يوسف",
      role: "مغامر · 35 عام",
      avatarColor: "#b45309",
      quote:
        "الصحراء البيضاء كوكب آخر. التخييم تحت النجوم تجربة لا توصف.",
      rating: 5,
      duration: "5 أيام",
      date: "2025-11-08",
    },
    {
      name: "هبة سالم",
      role: "طبيبة · 39 عام",
      avatarColor: "#92400e",
      quote:
        "الدفن في الرمال الدافئة قلل آلام الروماتيزم عندي بنسبة 80%. علاج فرعوني حقيقي.",
      rating: 5,
      condition: "روماتيزم",
      duration: "14 يوم",
      date: "2025-12-15",
    },
    {
      name: "خالد ممدوح",
      role: "رياضي · 27 عام",
      avatarColor: "#1d5770",
      quote: "الينابيع الساخنة + الرمال + السماء = تجربة استشفائية متكاملة.",
      rating: 5,
      duration: "7 أيام",
      date: "2026-01-30",
    },
  ],
  "wadi-degla": [
    {
      name: "أحمد سامي",
      role: "مدير تنفيذي · 45 عام",
      avatarColor: "#78350f",
      quote:
        "15 دقيقة من البيت وكأني في كوكب تاني. الصمت والهواء نقي — Digital Detox حقيقي.",
      rating: 5,
      duration: "نصف يوم",
      date: "2026-02-20",
    },
    {
      name: "منى خليل",
      role: "رياضية · 30 عام",
      avatarColor: "#91b149",
      quote: "المسارات طويلة ومتنوعة. ماراثون وادي دجلة تجربة لازم تعيشها.",
      rating: 5,
      duration: "يوم كامل",
      date: "2026-03-10",
    },
    {
      name: "عمرو حسن",
      role: "مصور · 32 عام",
      avatarColor: "#1d5770",
      quote: "التخييم ليلة في المحمية غير نظرتي للحياة. النجوم مذهلة.",
      rating: 5,
      condition: "إجهاد نفسي",
      duration: "يومين",
      date: "2026-04-05",
    },
  ],
  "shagie-farms": [
    {
      name: "سلمى أحمد",
      role: "أم · 36 عام",
      avatarColor: "#ca8a04",
      quote:
        "أولادي قطفوا مانجو لأول مرة في حياتهم. يوم ممتع وتعليمي فعلاً.",
      rating: 5,
      duration: "يوم واحد",
      date: "2025-08-22",
    },
    {
      name: "جيمس ميلر",
      role: "سائح · أمريكي",
      avatarColor: "#91b149",
      quote: "The best agri-tourism experience I've had in the Middle East.",
      rating: 5,
      duration: "يوم واحد",
      date: "2025-09-15",
    },
    {
      name: "ريم خالد",
      role: "ربة منزل · 42 عام",
      avatarColor: "#78350f",
      quote:
        "الأكل الفلاحي والجو الهادئ — شعور بالبعد عن المدينة في ساعة بس.",
      rating: 5,
      duration: "يوم واحد",
      date: "2026-03-18",
    },
  ],
};

/**
 * Returns the aggregate rating for a destination, derived from its
 * testimonials. Used by:
 *   - JSON-LD AggregateRating (drives Google star ratings in SERP)
 *   - sitemap priority calculation
 *   - Trust-signal chips on destination cards
 */
export function getDestinationRating(destId: string): {
  ratingValue: number;
  reviewCount: number;
} {
  const list = TESTIMONIALS_BY_DEST[destId] ?? [];
  if (list.length === 0) return { ratingValue: 0, reviewCount: 0 };
  const sum = list.reduce((acc, t) => acc + t.rating, 0);
  return {
    ratingValue: sum / list.length,
    reviewCount: list.length,
  };
}
