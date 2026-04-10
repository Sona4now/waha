"use client";

import { motion } from "framer-motion";

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
  return (
    <div className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] p-6 md:p-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
          <span className="w-6 h-px bg-[#91b149]" />
          يوم من حياتك هنا
          <span className="w-6 h-px bg-[#91b149]" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold font-display text-[#12394d] dark:text-white mb-2">
          تخيل يومك في {destinationName}
        </h3>
        <p className="text-sm text-[#7b7c7d] max-w-md mx-auto">
          إحساس حقيقي بالتجربة — من شروق الشمس لحد غروبها
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

// Per-destination day schedules
export function getDayForDestination(destId: string): TimelineStep[] {
  const schedules: Record<string, TimelineStep[]> = {
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

  return schedules[destId] || schedules.safaga;
}
