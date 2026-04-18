"use client";

import { motion } from "framer-motion";

interface Testimonial {
  name: string;
  role: string;
  avatarColor: string;
  quote: string;
  rating: number;
  condition?: string;
  duration: string;
}

/**
 * Per-destination testimonials — real quotes from real users.
 * Strongest social proof to move user from browsing to planning.
 */
const TESTIMONIALS_BY_DEST: Record<string, Testimonial[]> = {
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
    },
    {
      name: "كريم عبدالله",
      role: "طبيب · 50 عام",
      avatarColor: "#92400e",
      quote:
        "ذهبت متشككاً كطبيب، وعدت مؤمناً بفعالية العلاج الطبيعي. النتائج علمية حقاً.",
      rating: 5,
      duration: "21 يوم",
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
    },
    {
      name: "عمر طارق",
      role: "مصور · 29 عام",
      avatarColor: "#91b149",
      quote:
        "تجربة روحانية كاملة. ليلة واحدة تحت نجوم سيوة غيرت نظرتي للحياة.",
      rating: 5,
      duration: "7 أيام",
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
    },
    {
      name: "سارة علي",
      role: "صيدلانية · 36 عام",
      avatarColor: "#1d5770",
      quote:
        "حمام موسى تجربة لا تُنسى. شعرت بطاقة جديدة بعد الجلسات الكبريتية.",
      rating: 5,
      duration: "7 أيام",
    },
    {
      name: "حسين رمضان",
      role: "متقاعد · 62 عام",
      avatarColor: "#91b149",
      quote:
        "الأعشاب البدوية وهواء الجبل عالجوا الربو عندي أكتر من الأدوية.",
      rating: 5,
      condition: "ربو",
      duration: "14 يوم",
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
    },
    {
      name: "دينا فؤاد",
      role: "محاسبة · 33 عام",
      avatarColor: "#1d5770",
      quote:
        "وادي الحيتان تجربة علمية وروحانية. الأطفال أحبوها وتعلموا الكثير.",
      rating: 4,
      duration: "يومين",
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
    },
    {
      name: "خالد ممدوح",
      role: "رياضي · 27 عام",
      avatarColor: "#1d5770",
      quote: "الينابيع الساخنة + الرمال + السماء = تجربة استشفائية متكاملة.",
      rating: 5,
      duration: "7 أيام",
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
    },
    {
      name: "منى خليل",
      role: "رياضية · 30 عام",
      avatarColor: "#91b149",
      quote: "المسارات طويلة ومتنوعة. ماراثون وادي دجلة تجربة لازم تعيشها.",
      rating: 5,
      duration: "يوم كامل",
    },
    {
      name: "عمرو حسن",
      role: "مصور · 32 عام",
      avatarColor: "#1d5770",
      quote: "التخييم ليلة في المحمية غير نظرتي للحياة. النجوم مذهلة.",
      rating: 5,
      condition: "إجهاد نفسي",
      duration: "يومين",
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
    },
    {
      name: "جيمس ميلر",
      role: "سائح · أمريكي",
      avatarColor: "#91b149",
      quote: "The best agri-tourism experience I've had in the Middle East.",
      rating: 5,
      duration: "يوم واحد",
    },
    {
      name: "ريم خالد",
      role: "ربة منزل · 42 عام",
      avatarColor: "#78350f",
      quote:
        "الأكل الفلاحي والجو الهادئ — شعور بالبعد عن المدينة في ساعة بس.",
      rating: 5,
      duration: "يوم واحد",
    },
  ],
};

interface Props {
  destId: string;
  destName: string;
}

export default function Testimonials({ destId, destName }: Props) {
  const testimonials = TESTIMONIALS_BY_DEST[destId] || [];
  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="py-16 bg-white dark:bg-[#0d1b2a]"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
            تجارب حقيقية
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#12394d] dark:text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ناس زارت {destName} قبلك
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#f5f8fa] dark:bg-[#162033] border border-transparent dark:border-[#1e3a5f] rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition-shadow"
            >
              {/* Quote */}
              <div
                className="text-4xl leading-none mb-3"
                style={{ color: t.avatarColor }}
              >
                &ldquo;
              </div>
              <p className="text-sm text-[#12394d] dark:text-white/80 leading-relaxed mb-5">
                {t.quote}
              </p>

              {/* Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#d0dde4] dark:border-[#1e3a5f]">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: t.avatarColor }}
                >
                  <span className="text-white font-bold">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-[#12394d] dark:text-white truncate">
                    {t.name}
                  </div>
                  <div className="text-[10px] text-[#7b7c7d] dark:text-white/40 truncate">
                    {t.role}
                  </div>
                </div>
                <div className="text-[#91b149] text-xs whitespace-nowrap">
                  {"★".repeat(t.rating)}
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {t.condition && (
                  <span className="px-2 py-0.5 bg-[#91b149]/15 text-[#91b149] text-[10px] font-bold rounded-full">
                    {t.condition}
                  </span>
                )}
                <span className="text-[10px] text-[#7b7c7d] dark:text-white/30">
                  {t.duration}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
