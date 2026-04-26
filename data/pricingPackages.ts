/**
 * Per-destination pricing packages (Basic / Standard / Premium).
 *
 * These are starting prices in EGP per person assuming a party of 2 sharing
 * a room. Final pricing varies by season and group size; the lead capture
 * form is the entry point for an actual quote. The numbers are calibrated
 * against published rates from local tour operators (Sept 2025 baselines).
 */

export type Tier = "basic" | "standard" | "premium";

export interface Package {
  tier: Tier;
  name: string;
  pricePerPerson: number; // EGP, party of 2 sharing a room
  duration: string;
  highlight: string;
  includes: string[];
  notIncluded?: string[];
}

export interface DestinationPricing {
  destinationId: string;
  packages: Package[];
  /** Disclaimer / footnote shown under the table. */
  note?: string;
}

const baseExclusions = [
  "تذاكر الطيران الدولي (لو لازم)",
  "وجبات الغداء/العشاء خارج البرنامج",
  "البقشيش والمصاريف الشخصية",
];

export const PRICING: DestinationPricing[] = [
  {
    destinationId: "safaga",
    packages: [
      {
        tier: "basic",
        name: "بداية الاستشفاء",
        pricePerPerson: 8500,
        duration: "5 أيام / 4 ليالي",
        highlight: "البرنامج الأساسي للعلاج بالرمال السوداء",
        includes: [
          "إقامة في فندق 3 نجوم على البحر",
          "إفطار يومي مفتوح",
          "5 جلسات دفن بالرمال السوداء",
          "مواصلات من المطار وإليه",
          "إشراف طبي يومي مختصر",
        ],
        notIncluded: baseExclusions,
      },
      {
        tier: "standard",
        name: "البرنامج المعتمد",
        pricePerPerson: 14500,
        duration: "10 أيام / 9 ليالي",
        highlight: "البرنامج المعتمد دولياً لعلاج الصدفية والروماتيزم",
        includes: [
          "إقامة في فندق 4 نجوم بـ All Inclusive",
          "10 جلسات علاج رملي + شمسي",
          "5 جلسات سباحة موجّهة في البحر الأحمر",
          "تقييم طبي قبل وبعد البرنامج",
          "ورشة تأمل وتنفس مساءً",
          "مواصلات + جولة سياحية للقرنة",
        ],
        notIncluded: baseExclusions,
      },
      {
        tier: "premium",
        name: "البرنامج الكامل",
        pricePerPerson: 26000,
        duration: "21 يوم / 20 ليلة",
        highlight: "أعلى نسبة شفاء — معتمد من WHO للصدفية المزمنة",
        includes: [
          "جناح فاخر في منتجع 5 نجوم",
          "20 جلسة علاج رملي + 15 جلسة بحر",
          "متابعة طبية يومية + استشاري جلدية",
          "تحليل دم + متابعة المؤشرات قبل/بعد",
          "تغذية علاجية مخصصة",
          "جلسات يوغا ومساج علاجي",
          "رحلة سفاري للصحراء الشرقية",
        ],
        notIncluded: baseExclusions,
      },
    ],
    note: "الأسعار للشخص في غرفة مزدوجة. للفرد المفرد تضاف 30%. لمجموعات 4+ خصم 10%.",
  },
  {
    destinationId: "siwa",
    packages: [
      {
        tier: "basic",
        name: "هروب من الزحمة",
        pricePerPerson: 6500,
        duration: "3 أيام / ليلتين",
        highlight: "ويك إند هادئ في الواحة",
        includes: [
          "إقامة في إيكولودج محلي",
          "إفطار + عشاء سيوي تقليدي",
          "3 جلسات في العيون الكبريتية",
          "جولة قلعة شالي + معبد آمون",
          "مواصلات من القاهرة (أتوبيس VIP)",
        ],
        notIncluded: baseExclusions,
      },
      {
        tier: "standard",
        name: "تجربة شاملة",
        pricePerPerson: 11000,
        duration: "5 أيام / 4 ليالي",
        highlight: "العلاج الطبيعي + اكتشاف ثقافي",
        includes: [
          "إقامة في إيكولودج فاخر",
          "All Inclusive — أكل سيوي حقيقي",
          "8 جلسات في عيون كليوباترا + قريشت + تاموسي",
          "جلسة دفن بالرمال + علاج بالملح",
          "سفاري الصحراء الكبرى + غروب الشمس",
          "ورشة صناعة الزيوت العطرية الطبيعية",
        ],
        notIncluded: baseExclusions,
      },
      {
        tier: "premium",
        name: "خلوة كاملة",
        pricePerPerson: 18500,
        duration: "10 أيام / 9 ليالي",
        highlight: "Detox كامل للجسم والعقل في قلب الصحراء",
        includes: [
          "خيمة فاخرة على بحيرة الملح",
          "All Inclusive + تغذية عضوية",
          "15+ جلسة علاج بالعيون والملح",
          "جلسات يوغا ومينديتيشن يومية",
          "إشراف طبي + تدليك علاجي يومي",
          "ليلة تخييم في الصحراء الكبرى",
          "ورش حرفية مع السكان المحليين",
        ],
        notIncluded: baseExclusions,
      },
    ],
    note: "أسعار ديسمبر-فبراير (الموسم العالي). صيف يوليو-أغسطس خصم 25%.",
  },
  {
    destinationId: "sinai",
    packages: [
      {
        tier: "basic",
        name: "تجربة بدوية",
        pricePerPerson: 5500,
        duration: "3 أيام / ليلتين",
        highlight: "ويك إند في دهب أو سانت كاترين",
        includes: [
          "إقامة في كامب بدوي على البحر",
          "إفطار + عشاء بدوي",
          "جلستين أعشاب علاجية مع طبيب بدوي",
          "جولة المشي في وادي قنية",
          "سنوركلينج خفيف",
        ],
        notIncluded: baseExclusions,
      },
      {
        tier: "standard",
        name: "هواء الجبل",
        pricePerPerson: 9500,
        duration: "5 أيام / 4 ليالي",
        highlight: "علاج بالمناخ الجبلي + الأعشاب البدوية",
        includes: [
          "إقامة في فندق إيكو 4 نجوم",
          "All Inclusive — مطبخ بدوي + متوسطي",
          "صعود جبل موسى لشروق الشمس",
          "5 جلسات أعشاب + تأمل",
          "جولة حمّامات موسى + كنيسة كاترين",
          "ليلة تخييم تحت النجوم",
        ],
        notIncluded: baseExclusions,
      },
      {
        tier: "premium",
        name: "إعادة تأهيل تنفسي",
        pricePerPerson: 16500,
        duration: "10 أيام / 9 ليالي",
        highlight: "للربو، الحساسية، التهاب الشعب المزمن",
        includes: [
          "فيلا في دهب على البحر",
          "All Inclusive + تغذية مضادة للالتهاب",
          "إشراف طبيب صدر + متابعة وظائف الرئة",
          "جلسات تنفس + يوغا متخصصة",
          "علاج بالأعشاب البدوية الطبيعية",
          "غوص متقدم + سباحة موجّهة",
          "تحاليل دم قبل وبعد",
        ],
        notIncluded: baseExclusions,
      },
    ],
    note: "أسعار سبتمبر-مايو. الصيف خصم 20%.",
  },
  {
    destinationId: "fayoum",
    packages: [
      {
        tier: "basic",
        name: "هروب يوم واحد",
        pricePerPerson: 1800,
        duration: "يوم واحد",
        highlight: "أسرع reset من القاهرة",
        includes: [
          "نقل ذهاب وعودة من القاهرة",
          "غداء في مطعم على بحيرة قارون",
          "زيارة شلالات وادي الريان",
          "جولة في وادي الحيتان",
        ],
        notIncluded: baseExclusions,
      },
      {
        tier: "standard",
        name: "ويك إند ريفي",
        pricePerPerson: 4500,
        duration: "3 أيام / ليلتين",
        highlight: "إقامة هادئة + استكشاف الواحة",
        includes: [
          "إقامة في إيكولودج طوب لبن",
          "All Inclusive — مطبخ ريفي عضوي",
          "زيارة بحيرة قارون + الشلالات + وادي الحيتان",
          "ركوب خيل + قارب",
          "ورشة فخار في قرية تونس",
        ],
        notIncluded: baseExclusions,
      },
      {
        tier: "premium",
        name: "ريترييت طويل",
        pricePerPerson: 9500,
        duration: "7 أيام / 6 ليالي",
        highlight: "مساحة عميقة للتأمل والكتابة",
        includes: [
          "إقامة في إيكولودج فاخر مطل على البحيرة",
          "All Inclusive عضوي",
          "جلسات يوغا + مينديتيشن يومية",
          "ورش فنية وحرفية يومية",
          "زيارة جميع المواقع التاريخية",
          "تدليك علاجي + علاج بالأعشاب",
        ],
        notIncluded: baseExclusions,
      },
    ],
    note: "الأسعار للشخص شاملة المواصلات من القاهرة.",
  },
  {
    destinationId: "bahariya",
    packages: [
      {
        tier: "basic",
        name: "تجربة الصحراء",
        pricePerPerson: 4500,
        duration: "3 أيام / ليلتين",
        highlight: "ليلة تخييم في الصحراء البيضاء",
        includes: [
          "نقل من القاهرة",
          "إقامة ليلة في فندق محلي + ليلة تخييم",
          "All Inclusive",
          "سفاري في الصحراء البيضاء + السوداء",
          "جلسة عين بشموس الحارة",
        ],
        notIncluded: baseExclusions,
      },
      {
        tier: "standard",
        name: "علاج بالصحراء",
        pricePerPerson: 8500,
        duration: "5 أيام / 4 ليالي",
        highlight: "البرنامج الأساسي للسفاري العلاجي",
        includes: [
          "إقامة في إيكولودج صحراوي",
          "All Inclusive",
          "5 جلسات في العيون الحارة الكبريتية",
          "3 جلسات دفن بالرمال الساخنة",
          "ليلتين تخييم تحت النجوم",
          "زيارة كل المواقع الجيولوجية",
        ],
        notIncluded: baseExclusions,
      },
      {
        tier: "premium",
        name: "السفاري الكامل",
        pricePerPerson: 15000,
        duration: "10 أيام / 9 ليالي",
        highlight: "اكتشاف الصحراء البيضاء + السوداء + الكريستال",
        includes: [
          "إقامة فاخرة + خيام سفاري VIP",
          "All Inclusive عضوي",
          "10+ جلسات علاج طبيعي",
          "سفاري متعدد الأيام للصحراء البعيدة",
          "إشراف طبي + تدليك يومي",
          "ورشة تصوير ليلي للنجوم",
        ],
        notIncluded: baseExclusions,
      },
    ],
    note: "أكتوبر-مارس فقط. الصيف غير مناسب للسفاري الصحراوي.",
  },
  {
    destinationId: "wadi-degla",
    packages: [
      {
        tier: "basic",
        name: "زيارة يوم",
        pricePerPerson: 250,
        duration: "نصف يوم",
        highlight: "الخيار الأرخص للقاهريين",
        includes: [
          "تذكرة دخول المحمية",
          "خريطة المسارات",
          "نصائح مرشد محلي عند المدخل",
        ],
        notIncluded: ["المواصلات", "الأكل والشرب", "تأجير معدات"],
      },
      {
        tier: "standard",
        name: "هايكنج موجّه",
        pricePerPerson: 750,
        duration: "يوم كامل",
        highlight: "هايكنج + أكل + إرشاد",
        includes: [
          "نقل من المعادي ذهاب وعودة",
          "مرشد هايكنج معتمد",
          "هايكنج 8-12 كم",
          "غداء + ميه + سناكس",
          "تأمين بسيط ضد الإصابات",
        ],
      },
      {
        tier: "premium",
        name: "تخييم ليلي",
        pricePerPerson: 1500,
        duration: "يوم وليلة",
        highlight: "ليلة تحت النجوم 15 دقيقة من المعادي",
        includes: [
          "نقل + معدات تخييم كاملة",
          "هايكنج + بانوراما عند الغروب",
          "عشاء + إفطار في الصحراء",
          "جلسة تأمل تحت النجوم",
          "إفطار + رجوع الصبح",
        ],
      },
    ],
    note: "السعر للشخص. تأكدت من تصريح المحمية قبل التخييم.",
  },
  {
    destinationId: "shagie-farms",
    packages: [
      {
        tier: "basic",
        name: "زيارة عائلية",
        pricePerPerson: 600,
        duration: "يوم واحد",
        highlight: "تجربة المزرعة للعائلات",
        includes: [
          "دخول المزرعة",
          "غداء فلاحي تقليدي",
          "جولة في البساتين",
          "تجربة قطف فاكهة موسمية",
        ],
        notIncluded: ["المواصلات من القاهرة"],
      },
      {
        tier: "standard",
        name: "ويك إند زراعي",
        pricePerPerson: 2800,
        duration: "يومين / ليلة",
        highlight: "تجربة مكتملة + إقامة",
        includes: [
          "إقامة ليلة في خيم مكيفة أو شاليه",
          "All Inclusive — مطبخ تراثي",
          "ورشة زراعة وحلب أبقار",
          "ركوب خيل",
          "جولة على الأنشطة الزراعية الموسمية",
        ],
      },
      {
        tier: "premium",
        name: "إقامة موسم الحصاد",
        pricePerPerson: 6500,
        duration: "5 أيام / 4 ليالي",
        highlight: "تجربة كاملة في موسم المانجو (يوليو-أكتوبر)",
        includes: [
          "إقامة فاخرة في شاليه خاص",
          "All Inclusive عضوي",
          "مشاركة كاملة في حصاد المانجو",
          "ورش طهي تراثي يومية",
          "جلسات إيكو-ثيرابي مع الأشجار",
          "زيارات للمزارع المجاورة",
        ],
      },
    ],
    note: "موسم الحصاد (يوليو-أكتوبر) أفضل وقت للتجربة الكاملة.",
  },
];

export function getPricing(destinationId: string): DestinationPricing | undefined {
  return PRICING.find((p) => p.destinationId === destinationId);
}
