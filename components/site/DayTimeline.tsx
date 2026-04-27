"use client";

import { motion } from "framer-motion";
import { useTranslations } from "@/components/site/LocaleProvider";

export interface TimelineStep {
  time: string;
  icon: string;
  title: string;
  description: string;
}

interface Props {
  steps: TimelineStep[];
  destinationName: string;
}

export default function DayTimeline({ steps, destinationName }: Props) {
  const { locale } = useTranslations();
  return (
    <div className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] p-6 md:p-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
          <span className="w-6 h-px bg-[#91b149]" />
          {locale === "en" ? "A day in your life here" : "يوم من حياتك هنا"}
          <span className="w-6 h-px bg-[#91b149]" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold font-display text-[#12394d] dark:text-white mb-2">
          {locale === "en"
            ? `Imagine your day in ${destinationName}`
            : `تخيل يومك في ${destinationName}`}
        </h3>
        <p className="text-sm text-[#7b7c7d] max-w-md mx-auto">
          {locale === "en"
            ? "A real feel for the experience — from sunrise to sunset"
            : "إحساس حقيقي بالتجربة — من شروق الشمس لحد غروبها"}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#91b149]/30 via-[#1d5770]/20 to-[#91b149]/30 md:right-1/2 md:-translate-x-1/2" />

        <div className="space-y-8">
          {steps.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative flex items-center gap-4 md:gap-8 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content (Mobile: always right of timeline. Desktop: alternating) */}
                <div
                  className={`flex-1 pr-16 md:pr-0 ${
                    isEven ? "md:text-left md:pl-12" : "md:text-right md:pr-12"
                  }`}
                >
                  <div
                    className={`inline-block bg-[#f5f8fa] dark:bg-[#0a151f] rounded-2xl p-4 md:p-5 border border-[#d0dde4] dark:border-[#1e3a5f] hover:border-[#91b149]/50 dark:hover:border-[#91b149]/50 transition-all duration-300 hover:shadow-lg max-w-md ${
                      isEven ? "" : "md:text-right"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 mb-2 ${
                        isEven ? "md:justify-start" : "md:justify-end"
                      }`}
                    >
                      <span className="text-[11px] font-bold text-[#91b149] uppercase tracking-wider bg-[#91b149]/10 px-2 py-0.5 rounded-full">
                        {step.time}
                      </span>
                    </div>
                    <h4 className="text-base md:text-lg font-bold text-[#12394d] dark:text-white font-display mb-1">
                      {step.title}
                    </h4>
                    <p className="text-xs md:text-sm text-[#7b7c7d] dark:text-white/60 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Icon dot on timeline */}
                <div className="absolute right-4 md:right-1/2 md:translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#91b149] to-[#6a8435] flex items-center justify-center text-2xl shadow-lg ring-4 ring-white dark:ring-[#162033] z-10">
                  {step.icon}
                </div>

                {/* Empty space for alternating desktop layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Per-destination day schedules — Arabic
const SCHEDULES_AR: Record<string, TimelineStep[]> = {
  safaga: [
    {
      time: "6:00 ص",
      icon: "🌅",
      title: "شروق الشمس على البحر الأحمر",
      description:
        "ابدأ يومك بمشهد الشروق الذهبي على الأفق — تأمل على الشاطئ مع نسمات البحر الأولى.",
    },
    {
      time: "8:00 ص",
      icon: "🥗",
      title: "فطار صحي",
      description:
        "إفطار طبيعي بمنتجات محلية: زيت زيتون، عسل، فول مدمس، جبنة بيضاء، وعصير برتقال طازج.",
    },
    {
      time: "10:00 ص",
      icon: "🌊",
      title: "حمام البحر (Thalassotherapy)",
      description:
        "30 دقيقة في مياه البحر الأحمر الغنية بالمعادن — تنشط الدورة الدموية وتعالج الجلد.",
    },
    {
      time: "12:00 م",
      icon: "☀️",
      title: "جلسة شمس (Heliotherapy)",
      description:
        "15-20 دقيقة من الأشعة المباشرة تحت إشراف طبي — علاج الصدفية وتكوين فيتامين D3.",
    },
    {
      time: "2:00 م",
      icon: "🍽️",
      title: "غداء مصري أصيل",
      description:
        "سمك مشوي طازج من البحر مع سلطة خضراء، أرز بالخلطة، وليمون.",
    },
    {
      time: "4:00 م",
      icon: "🏖️",
      title: "علاج بالرمال السوداء",
      description:
        "جلسة دفن في الرمال المعدنية (15-30 دقيقة) — علاج الروماتيزم والتهاب المفاصل.",
    },
    {
      time: "6:30 م",
      icon: "🌅",
      title: "غروب الشمس",
      description:
        "استرخاء على الشاطئ وتأمل الغروب الخلاب — لحظات السكينة والهدوء النفسي.",
    },
    {
      time: "8:00 م",
      icon: "🌟",
      title: "عشاء تحت النجوم",
      description:
        "عشاء خفيف في مطعم على البحر مع السماء الصافية — ختام يوم علاجي مثالي.",
    },
  ],
  siwa: [
    {
      time: "6:00 ص",
      icon: "🌅",
      title: "شروق الصحراء",
      description:
        "استيقظ على هدوء الواحة وشاهد الشمس تُشرق على بحيرات الملح — لحظات لا تُنسى.",
    },
    {
      time: "7:30 ص",
      icon: "🍯",
      title: "فطار سيوي تقليدي",
      description:
        "تمر سيوي، زيت زيتون، عسل نخل، وخبز تنور — طاقة طبيعية لبداية يومك.",
    },
    {
      time: "9:00 ص",
      icon: "♨️",
      title: "عين كليوباترا",
      description:
        "استحمام في مياه العين المعدنية الدافئة — مثالية للجلد وللاسترخاء.",
    },
    {
      time: "11:00 ص",
      icon: "🏛️",
      title: "زيارة قلعة شالي",
      description:
        "تجول في القلعة التاريخية المبنية من الكرشيف — رحلة في الزمن.",
    },
    {
      time: "1:00 م",
      icon: "🧂",
      title: "الطفو في بحيرات الملح",
      description:
        "جلسة طفو في بحيرات الملح (99% ملوحة) — يخفف آلام الظهر والمفاصل.",
    },
    {
      time: "3:00 م",
      icon: "🌴",
      title: "استراحة تحت النخيل",
      description:
        "غداء خفيف في بساتين النخيل وقيلولة في الهواء النقي.",
    },
    {
      time: "5:00 م",
      icon: "🏜️",
      title: "جبل الدكرور",
      description:
        "جلسة دفن في الرمال الساخنة — علاج الروماتيزم والتهاب المفاصل.",
    },
    {
      time: "7:00 م",
      icon: "⭐",
      title: "نجوم الصحراء",
      description:
        "عشاء بدوي تحت سماء صافية مذهلة — لا تلوث ضوئي، فقط النجوم والقمر.",
    },
  ],
  sinai: [
    {
      time: "5:30 ص",
      icon: "⛰️",
      title: "شروق جبل موسى",
      description:
        "رحلة تسلق مبكرة لرؤية شروق الشمس من قمة الجبل — مشهد روحاني خالد.",
    },
    {
      time: "8:00 ص",
      icon: "🍵",
      title: "فطار بدوي",
      description:
        "شاي بدوي بالنعناع، خبز التنور، جبنة فيتا، وعسل جبلي.",
    },
    {
      time: "10:00 ص",
      icon: "♨️",
      title: "حمام موسى",
      description:
        "استحمام في العيون الكبريتية الدافئة (37°م) — يعالج الجلد والمفاصل.",
    },
    {
      time: "12:30 م",
      icon: "🌿",
      title: "جمع الأعشاب الطبية",
      description:
        "تعرّف على الأعشاب البدوية (الشيح، الزعتر، المرميّة) مع مرشد محلي.",
    },
    {
      time: "2:00 م",
      icon: "🥙",
      title: "غداء في خيمة بدوية",
      description:
        "وجبة تقليدية: خراف مشوي، أرز بدوي، وشاي بالأعشاب الجبلية.",
    },
    {
      time: "4:00 م",
      icon: "🚶",
      title: "مسار وادي الأشعة",
      description:
        "مشي هادئ بين الجبال — الهواء النقي يعالج الجهاز التنفسي.",
    },
    {
      time: "6:00 م",
      icon: "🌄",
      title: "غروب الجبال",
      description:
        "شاهد غروب الشمس يلوّن الجبال بألوان الذهب والوردي — لحظات تأمل.",
    },
    {
      time: "8:00 م",
      icon: "🔥",
      title: "حول النار",
      description:
        "جلسة استرخاء حول نار المخيم مع البدو — قصص وأغاني تحت السماء.",
    },
  ],
  fayoum: [
    {
      time: "6:30 ص",
      icon: "🌅",
      title: "شروق بحيرة قارون",
      description:
        "استمتع بمشهد شروق الشمس على أقدم بحيرة في العالم — سكينة لا توصف.",
    },
    {
      time: "8:00 ص",
      icon: "🥖",
      title: "فطار ريفي",
      description:
        "خبز بلدي، فول، طعمية، جبنة قريش، وشاي بالنعناع.",
    },
    {
      time: "10:00 ص",
      icon: "🐋",
      title: "رحلة وادي الحيتان",
      description:
        "استكشاف المتحف الطبيعي المفتوح — حفريات يونسكو وهواء صحراوي نقي.",
    },
    {
      time: "12:30 م",
      icon: "🏺",
      title: "ورش فخار قرية تونس",
      description:
        "زيارة ورش الفخار التقليدية وتجربة صناعة قطعة بيدك.",
    },
    {
      time: "2:00 م",
      icon: "🍲",
      title: "غداء فيومي",
      description:
        "سمك بلطي من بحيرة قارون، أرز بالشعرية، وسلطة خضراء.",
    },
    {
      time: "4:00 م",
      icon: "💧",
      title: "شلالات وادي الريان",
      description:
        "استرخاء بجانب الشلالات — صوت الماء علاج طبيعي للتوتر.",
    },
    {
      time: "6:00 م",
      icon: "🌈",
      title: "البحيرة المسحورة",
      description:
        "شاهد تغير ألوان البحيرة مع الغروب — تجربة استشفاء نفسي فريدة.",
    },
    {
      time: "8:00 م",
      icon: "🦆",
      title: "عشاء ومراقبة الطيور",
      description:
        "عشاء في أحد لودجات البحيرة مع مشاهدة الطيور المهاجرة.",
    },
  ],
  bahariya: [
    {
      time: "6:00 ص",
      icon: "🏜️",
      title: "شروق الصحراء البيضاء",
      description:
        "استيقظ داخل مخيم الصحراء البيضاء — الشمس تكشف تكوينات الحجر الجيري الفريدة.",
    },
    {
      time: "8:00 ص",
      icon: "☕",
      title: "فطار بدوي تحت الشمس",
      description:
        "قهوة عربية، خبز التنور، وتمر صحراوي على ضوء الصباح الذهبي.",
    },
    {
      time: "10:00 ص",
      icon: "♨️",
      title: "بئر سيجام",
      description:
        "استحمام في المياه الكبريتية الحارة (45°م) — يعالج الروماتيزم والجهاز الهضمي.",
    },
    {
      time: "12:00 م",
      icon: "💎",
      title: "جبل الكريستال",
      description:
        "زيارة الجبل المغطى بالبلورات الشفافة — تجربة بصرية وتأملية.",
    },
    {
      time: "2:00 م",
      icon: "🥘",
      title: "غداء في الصحراء",
      description:
        "طعام بدوي تقليدي مع شاي الأعشاب الصحراوية.",
    },
    {
      time: "4:00 م",
      icon: "🌑",
      title: "الصحراء السوداء",
      description:
        "استكشاف التضاريس البركانية — تباين مذهل مع الصحراء البيضاء.",
    },
    {
      time: "6:30 م",
      icon: "🌅",
      title: "غروب أبو الهول الصخري",
      description:
        "شاهد الغروب عند الصخرة الأسطورية — لحظة تأمل وإعادة شحن.",
    },
    {
      time: "9:00 م",
      icon: "✨",
      title: "نجوم الصحراء",
      description:
        "نوم تحت أحد أصفى سماوات العالم — ملايين النجوم بلا تلوث ضوئي.",
    },
  ],
};

// Per-destination day schedules — English
const SCHEDULES_EN: Record<string, TimelineStep[]> = {
  safaga: [
    {
      time: "6:00 AM",
      icon: "🌅",
      title: "Sunrise over the Red Sea",
      description:
        "Start your day with the golden sunrise on the horizon — meditate on the beach with the first sea breezes.",
    },
    {
      time: "8:00 AM",
      icon: "🥗",
      title: "Healthy breakfast",
      description:
        "A natural breakfast of local produce: olive oil, honey, ful medames, white cheese, and fresh orange juice.",
    },
    {
      time: "10:00 AM",
      icon: "🌊",
      title: "Sea bath (Thalassotherapy)",
      description:
        "30 minutes in the mineral-rich Red Sea waters — boosts circulation and treats the skin.",
    },
    {
      time: "12:00 PM",
      icon: "☀️",
      title: "Sun session (Heliotherapy)",
      description:
        "15-20 minutes of direct sunlight under medical supervision — treats psoriasis and produces vitamin D3.",
    },
    {
      time: "2:00 PM",
      icon: "🍽️",
      title: "Authentic Egyptian lunch",
      description:
        "Freshly grilled sea fish with green salad, seasoned rice, and lemon.",
    },
    {
      time: "4:00 PM",
      icon: "🏖️",
      title: "Black sand therapy",
      description:
        "A burial session in mineral sands (15-30 minutes) — treats rheumatism and joint inflammation.",
    },
    {
      time: "6:30 PM",
      icon: "🌅",
      title: "Sunset",
      description:
        "Relax on the beach and contemplate the breathtaking sunset — moments of peace and mental calm.",
    },
    {
      time: "8:00 PM",
      icon: "🌟",
      title: "Dinner under the stars",
      description:
        "A light dinner at a seaside restaurant under a clear sky — the perfect end to a healing day.",
    },
  ],
  siwa: [
    {
      time: "6:00 AM",
      icon: "🌅",
      title: "Desert sunrise",
      description:
        "Wake up to the calm of the oasis and watch the sun rise over the salt lakes — unforgettable moments.",
    },
    {
      time: "7:30 AM",
      icon: "🍯",
      title: "Traditional Siwan breakfast",
      description:
        "Siwan dates, olive oil, palm honey, and tannour bread — natural energy to start your day.",
    },
    {
      time: "9:00 AM",
      icon: "♨️",
      title: "Cleopatra's Spring",
      description:
        "Bathe in the warm mineral spring waters — ideal for the skin and for relaxation.",
    },
    {
      time: "11:00 AM",
      icon: "🏛️",
      title: "Visit Shali Fortress",
      description:
        "Explore the historic fortress built from karshif — a journey through time.",
    },
    {
      time: "1:00 PM",
      icon: "🧂",
      title: "Floating in the salt lakes",
      description:
        "A floating session in the salt lakes (99% salinity) — eases back and joint pain.",
    },
    {
      time: "3:00 PM",
      icon: "🌴",
      title: "Rest under the palms",
      description:
        "A light lunch in the palm groves and a nap in the fresh air.",
    },
    {
      time: "5:00 PM",
      icon: "🏜️",
      title: "Mount Dakrour",
      description:
        "A burial session in the hot sands — treats rheumatism and joint inflammation.",
    },
    {
      time: "7:00 PM",
      icon: "⭐",
      title: "Desert stars",
      description:
        "Bedouin dinner under a stunning clear sky — no light pollution, only stars and moon.",
    },
  ],
  sinai: [
    {
      time: "5:30 AM",
      icon: "⛰️",
      title: "Sunrise on Mount Moses",
      description:
        "An early climb to see the sunrise from the mountain summit — a timeless spiritual scene.",
    },
    {
      time: "8:00 AM",
      icon: "🍵",
      title: "Bedouin breakfast",
      description:
        "Bedouin mint tea, tannour bread, feta cheese, and mountain honey.",
    },
    {
      time: "10:00 AM",
      icon: "♨️",
      title: "Moses' Bath",
      description:
        "Bathe in the warm sulfuric springs (37°C) — heals the skin and joints.",
    },
    {
      time: "12:30 PM",
      icon: "🌿",
      title: "Gathering medicinal herbs",
      description:
        "Learn about Bedouin herbs (wormwood, thyme, sage) with a local guide.",
    },
    {
      time: "2:00 PM",
      icon: "🥙",
      title: "Lunch in a Bedouin tent",
      description:
        "A traditional meal: grilled lamb, Bedouin rice, and mountain herbal tea.",
    },
    {
      time: "4:00 PM",
      icon: "🚶",
      title: "Wadi Al-Ash'a trail",
      description:
        "A quiet walk between the mountains — the fresh air heals the respiratory system.",
    },
    {
      time: "6:00 PM",
      icon: "🌄",
      title: "Mountain sunset",
      description:
        "Watch the sunset paint the mountains in gold and pink — moments of contemplation.",
    },
    {
      time: "8:00 PM",
      icon: "🔥",
      title: "Around the fire",
      description:
        "A relaxing session around the camp fire with the Bedouins — stories and songs under the sky.",
    },
  ],
  fayoum: [
    {
      time: "6:30 AM",
      icon: "🌅",
      title: "Sunrise on Lake Qarun",
      description:
        "Enjoy the sunrise view over the world's oldest lake — indescribable peace.",
    },
    {
      time: "8:00 AM",
      icon: "🥖",
      title: "Rural breakfast",
      description:
        "Local bread, ful, ta'meya, qarish cheese, and mint tea.",
    },
    {
      time: "10:00 AM",
      icon: "🐋",
      title: "Wadi Al-Hitan trip",
      description:
        "Explore the natural open-air museum — UNESCO fossils and pure desert air.",
    },
    {
      time: "12:30 PM",
      icon: "🏺",
      title: "Tunis Village pottery workshops",
      description:
        "Visit the traditional pottery workshops and try crafting a piece by hand.",
    },
    {
      time: "2:00 PM",
      icon: "🍲",
      title: "Fayoumi lunch",
      description:
        "Tilapia from Lake Qarun, vermicelli rice, and green salad.",
    },
    {
      time: "4:00 PM",
      icon: "💧",
      title: "Wadi El Rayan waterfalls",
      description:
        "Relax beside the waterfalls — the sound of water is a natural cure for stress.",
    },
    {
      time: "6:00 PM",
      icon: "🌈",
      title: "The Magic Lake",
      description:
        "Watch the lake change colors with the sunset — a unique psychological healing experience.",
    },
    {
      time: "8:00 PM",
      icon: "🦆",
      title: "Dinner and bird watching",
      description:
        "Dinner at one of the lake lodges while watching migratory birds.",
    },
  ],
  bahariya: [
    {
      time: "6:00 AM",
      icon: "🏜️",
      title: "White Desert sunrise",
      description:
        "Wake up inside the White Desert camp — the sun reveals the unique limestone formations.",
    },
    {
      time: "8:00 AM",
      icon: "☕",
      title: "Bedouin breakfast in the sun",
      description:
        "Arabic coffee, tannour bread, and desert dates in the golden morning light.",
    },
    {
      time: "10:00 AM",
      icon: "♨️",
      title: "Sigam Spring",
      description:
        "Bathe in the hot sulfuric waters (45°C) — treats rheumatism and the digestive system.",
    },
    {
      time: "12:00 PM",
      icon: "💎",
      title: "Crystal Mountain",
      description:
        "Visit the mountain covered with transparent crystals — a visual and meditative experience.",
    },
    {
      time: "2:00 PM",
      icon: "🥘",
      title: "Lunch in the desert",
      description:
        "Traditional Bedouin food with desert herbal tea.",
    },
    {
      time: "4:00 PM",
      icon: "🌑",
      title: "Black Desert",
      description:
        "Explore the volcanic terrain — a stunning contrast to the White Desert.",
    },
    {
      time: "6:30 PM",
      icon: "🌅",
      title: "Sunset at the Sphinx Rock",
      description:
        "Watch the sunset at the legendary rock — a moment of contemplation and recharge.",
    },
    {
      time: "9:00 PM",
      icon: "✨",
      title: "Desert stars",
      description:
        "Sleep under one of the world's clearest skies — millions of stars with no light pollution.",
    },
  ],
};

// Per-destination day schedules
export function getDayForDestination(
  destId: string,
  locale: "en" | "ar" = "ar",
): TimelineStep[] {
  const schedules = locale === "en" ? SCHEDULES_EN : SCHEDULES_AR;
  return schedules[destId] || schedules.safaga;
}
