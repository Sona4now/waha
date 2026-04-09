"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SiteLayout from "@/components/site/SiteLayout";
import Link from "next/link";

/* ─── Data from PDF ─── */

interface Site {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  heroImage: string;
  location: string;
  coords: string;
  sections: {
    title: string;
    icon: string;
    content: string[];
  }[];
  warnings?: string[];
  quickFacts: { label: string; value: string; icon: string }[];
}

const SITES: Site[] = [
  {
    id: "wadi-asal",
    name: "وادي عسل",
    subtitle: "البحيرة الكبريتية — رأس سدر",
    icon: "♨️",
    color: "#0e7490",
    heroImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    location: "جنوب مدينة رأس سدر، جنوب سيناء",
    coords: "10 كم جنوب رأس سدر",
    sections: [
      {
        title: "النطاق الجغرافي",
        icon: "🗺️",
        content: [
          "موجود جنوب مدينة رأس سدر في جنوب سيناء، حوالي 10 كيلومتر من المدينة، في منطقة صحراوية ساحلية قريبة من خليج السويس.",
          "المكان في مستوى منخفض بسبب الصدوع الجيولوجية اللي حصلت مع انفتاح خليج السويس، واللي خلت المياه السخنة تطلع من باطن الأرض.",
          "البيئة حواليه صحراوية مكشوفة، اتزرع سور شجري حوالين العين عشان يهدّي الهوا ويوفر جو مناسب للاستشفاء.",
        ],
      },
      {
        title: "المياه الكبريتية",
        icon: "💧",
        content: [
          "المياه طالعة من خزان جوفي عميق جداً، بتوصل حرارتها لحوالي 200 درجة مئوية.",
          "حفرت لنفسها مجرى طبيعي طوله حوالي 100 متر، وبتتجمع في منخفض عامل زي حمام سباحة طبيعي مساحته 150 متر مربع وعمقه حوالي مترين.",
          "الحرارة بتكون أعلى عند المنبع وبتقل في البحيرة، وده اللي بيخلي الاستحمام ممكن.",
        ],
      },
      {
        title: "القيمة العلاجية",
        icon: "🏥",
        content: [
          "الحرارة بتساعد على إرخاء العضلات، تخفيف الشد، تحسين الدورة الدموية، وبتفيد في آلام المفاصل والروماتيزم.",
          "الكبريت بيتم امتصاصه عن طريق الجلد، وبيساعد في علاج الصدفية والإكزيما.",
          "استنشاق البخار بيفيد الجهاز التنفسي، خصوصاً في حالات الربو والجيوب الأنفية.",
          "بتستخدم في التخفيف من الروماتيزم، النقرس، آلام المفاصل، أمراض الجلد، ومشاكل الجهاز التنفسي.",
        ],
      },
      {
        title: "النطاق البيئي",
        icon: "🌿",
        content: [
          "وادي عسل مكان حساس جداً. كمية المياه اللي بتطلع يومياً حوالي 20 متر مكعب، وده مورد محدود.",
          "المكان تابع لمحافظة جنوب سيناء، وفيه محاولات لتحسين البنية التحتية والنظافة لتحويله لمكان استشفاء بيئي منظم.",
        ],
      },
    ],
    warnings: [
      "الحرارة العالية ممكن تبقى خطر على الحوامل",
      "غير مناسب لمرضى الضغط العالي",
      "غير مناسب لمرضى الفشل الكلوي",
    ],
    quickFacts: [
      { label: "حرارة المنبع", value: "200°م", icon: "🌡️" },
      { label: "مساحة البحيرة", value: "150 م²", icon: "🏊" },
      { label: "العمق", value: "2 متر", icon: "📏" },
      { label: "التدفق اليومي", value: "20 م³", icon: "💧" },
    ],
  },
  {
    id: "serabit",
    name: "سرابيط الخادم",
    subtitle: "الهضبة الجبلية — جنوب سيناء",
    icon: "⛰️",
    color: "#92400e",
    heroImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
    location: "قلب جبال جنوب سيناء، شمال الطور",
    coords: "40 كم شرق أبو زنيمة",
    sections: [
      {
        title: "النطاق الجغرافي",
        icon: "🗺️",
        content: [
          "موجودة في قلب جبال جنوب سيناء، على ارتفاع من 1100 لـ 1200 متر فوق سطح البحر.",
          "المناخ جبلي: برد في الشتا، حرارة معتدلة في الصيف، مع فرق واضح بين الليل والنهار.",
          "الهضبة مكونة من حجر رملي، وصخور كوارتز وبعض الصخور البركانية القديمة. المنطقة غنية بخامات الفيروز والنحاس.",
        ],
      },
      {
        title: "البيئة الاستشفائية",
        icon: "🧘",
        content: [
          "استشفاء غير مباشر — الناس بتستفيد من العزلة، الهدوء، والبيئة الجبلية.",
          "في الأودية حواليها فيه علاج بالرمال في الصيف، لأن الرمال بتمسك حرارة الشمس وبتخفف آلام الروماتيزم.",
          "بعض المخيمات البيئية عاملة غرف ملح مبنية من ملح صخري لتحسين التنفس.",
          "فيه معتقدات عند البدو عن طاقة أحجار الكوارتز والفيروز وإنها بتدي إحساس بالراحة والطاقة الإيجابية.",
        ],
      },
      {
        title: "القيمة التاريخية",
        icon: "🏛️",
        content: [
          "مركز مهم لتعدين الفيروز من أيام الأسرة الرابعة في مصر القديمة.",
          "المعبد مكرس للإلهة حتحور \"سيدة الفيروز\" — تصميمه يجمع بين مغارات منحوتة ومنشآت عليها نقوش.",
          "فيه النقوش المعروفة باسم الأبجدية السينائية الأولية — أقدم محاولة معروفة لعمل نظام كتابة أبجدي، وتعتبر أصل كل الأبجديات.",
        ],
      },
      {
        title: "النطاق البيئي",
        icon: "🌿",
        content: [
          "منطقة شديدة الحساسية، داخلة ضمن نطاق المحميات الطبيعية في جنوب سيناء.",
          "خاضعة لحماية الآثار، والحماية الفعلية معتمدة على تعاون القبائل البدوية.",
        ],
      },
    ],
    quickFacts: [
      { label: "الارتفاع", value: "1,200 م", icon: "🏔️" },
      { label: "الصخور", value: "كوارتز + فيروز", icon: "💎" },
      { label: "التاريخ", value: "الأسرة الرابعة", icon: "🏛️" },
      { label: "أهم اكتشاف", value: "أقدم أبجدية", icon: "✍️" },
    ],
  },
  {
    id: "hammam-musa",
    name: "حمام موسى",
    subtitle: "شمال محافظة جنوب سيناء",
    icon: "♨️",
    color: "#065f46",
    heroImage:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80",
    location: "مدينة الطور، على ساحل خليج السويس",
    coords: "بين الجبل والواحة والخليج",
    sections: [
      {
        title: "النطاق الجغرافي",
        icon: "🗺️",
        content: [
          "حمام موسى موجود في مدينة الطور، شمال محافظة جنوب سيناء على ساحل خليج السويس.",
          "عبارة عن ينابيع مياه كبريتية طبيعية تنبع من تحت الجبل وتصب في أحواض.",
          "يعتبر نقطة جذب رئيسية للسياحة العلاجية في المنطقة.",
        ],
      },
      {
        title: "الخصائص العلاجية",
        icon: "🏥",
        content: [
          "ينابيع مياه كبريتية دافئة (37 درجة مئوية) متجددة تتدفق طول العام، غنية بالكبريت والصوديوم والمغنيسيوم والكالسيوم.",
          "علاج الأمراض الجلدية (الصدفية، الإكزيما)، الروماتيزم، تنشيط الدورة الدموية، والاسترخاء.",
          "المنطقة غنية بالطحالب المفيدة للبشرة والشعر.",
          "المياه تنبع من خمس عيون رئيسية تصب في أحواض مجهزة للاستحمام.",
        ],
      },
      {
        title: "القيمة التاريخية",
        icon: "📜",
        content: [
          "يرتبط المكان بالنبي موسى عليه السلام — تشير الروايات إلى أنه مرّ بهذا الموقع خلال خروجه من مصر مع بني إسرائيل.",
          "تقول الروايات إن قومه أصيبوا بأمراض جلدية، فأرشدهم الله إلى هذه العيون للاستشفاء، فاغتسلوا فيها وشُفوا.",
        ],
      },
      {
        title: "النطاق البيئي",
        icon: "🌴",
        content: [
          "المنطقة محاطة بأشجار النخيل التي توفر الظل وتشكل جزءاً جمالياً.",
          "أشجار النخيل من نوع نخلة البلح التي تنمو في الصحراء، وتجعل المكان مثالياً للعلاج والاستجمام.",
        ],
      },
    ],
    quickFacts: [
      { label: "حرارة المياه", value: "37°م", icon: "🌡️" },
      { label: "عدد العيون", value: "5 عيون", icon: "💧" },
      { label: "المعادن", value: "كبريت + صوديوم", icon: "⚗️" },
      { label: "التدفق", value: "طول العام", icon: "♾️" },
    ],
  },
  {
    id: "uyun-musa",
    name: "عيون موسى",
    subtitle: "ساحل خليج السويس",
    icon: "🌊",
    color: "#1d5770",
    heroImage:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80",
    location: "ساحل خليج السويس، جنوب سيناء",
    coords: "35 كم من نفق الشهيد أحمد حمدي",
    sections: [
      {
        title: "النطاق الجغرافي",
        icon: "🗺️",
        content: [
          "منطقة سياحية وأثرية مهمة تقع على ساحل خليج السويس، على بعد 35 كم من نفق الشهيد أحمد حمدي.",
          "قريبة من مدينة السويس، وتعتبر أول محطة سياحية يراها المسافرون إلى شرم الشيخ.",
        ],
      },
      {
        title: "القيمة التاريخية",
        icon: "📜",
        content: [
          "بعد نجاتهم من فرعون، قاد موسى وبنو إسرائيل رحلة في صحراء سيناء، وعانوا من العطش الشديد.",
          "ضرب موسى الحجر بعصاه، فانفجرت منه اثنتا عشرة عيناً بعدد أسباط بني إسرائيل.",
          "في التوراة ذُكر 12 عين و70 نخلة — ومازالت الـ 70 نخلة موجودة حتى اليوم.",
          "كتابات المؤرخين تقول إن الطريق من السويس لعيون موسى منطقة قاحلة جداً.",
        ],
      },
      {
        title: "جهود الدولة",
        icon: "🏗️",
        content: [
          "بعد جفاف العيون بسبب الرمال، تم تطهير الـ 7 عيون وتحليل المياه وتنقيتها.",
          "تم افتتاحها في 10 فبراير 2018 والوصول للمياه العذبة عن طريق المجلس الأعلى للآثار.",
          "تحليل المياه أثبت أنها عذبة، وهذا يثبت أنها عيون سيدنا موسى.",
        ],
      },
      {
        title: "عيون موسى اليوم",
        icon: "🌴",
        content: [
          "منطقة طبيعية فيها ينابيع مياه، وتعتبر مزاراً دينياً وسياحياً هاماً.",
          "تتكون من ينابيع ومغارات وأشجار نخيل، وما زالت بعض العيون موجودة، وتتميز بمياهها العذبة.",
        ],
      },
    ],
    quickFacts: [
      { label: "عدد العيون", value: "12 عين", icon: "💧" },
      { label: "النخيل", value: "70 نخلة", icon: "🌴" },
      { label: "الافتتاح", value: "2018", icon: "📅" },
      { label: "المسافة", value: "35 كم", icon: "🛣️" },
    ],
  },
];

/* ─── Components ─── */

function SiteCard({
  site,
  isActive,
  onClick,
}: {
  site: Site;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-right p-4 rounded-2xl border-2 transition-all duration-300 group ${
        isActive
          ? "border-current shadow-lg scale-[1.02]"
          : "border-transparent bg-white shadow-sm hover:shadow-md hover:scale-[1.01]"
      }`}
      style={{
        borderColor: isActive ? site.color : undefined,
        background: isActive ? `${site.color}08` : undefined,
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{site.icon}</span>
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold font-display text-lg"
            style={{ color: isActive ? site.color : "#12394d" }}
          >
            {site.name}
          </h3>
          <p className="text-xs text-[#7b7c7d] truncate">{site.subtitle}</p>
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isActive ? "rotate-90" : ""}`}
          style={{ color: isActive ? site.color : "#d0dde4" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </div>
    </button>
  );
}

function QuickFact({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-[#d0dde4] hover:shadow-md transition-shadow">
      <span className="text-2xl block mb-1">{icon}</span>
      <div className="text-lg font-bold text-[#12394d]">{value}</div>
      <div className="text-[11px] text-[#7b7c7d]">{label}</div>
    </div>
  );
}

function SectionBlock({
  section,
  color,
  index,
}: {
  section: Site["sections"][0];
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-[#d0dde4]"
    >
      <h3
        className="font-bold font-display text-lg mb-4 flex items-center gap-2"
        style={{ color }}
      >
        <span className="text-xl">{section.icon}</span>
        {section.title}
      </h3>
      <div className="space-y-3">
        {section.content.map((text, i) => (
          <div key={i} className="flex gap-3">
            <span
              className="mt-2 w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: `${color}40` }}
            />
            <p className="text-[0.9rem] text-[#12394d]/80 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */

export default function SinaiSitesPage() {
  const [activeSiteId, setActiveSiteId] = useState(SITES[0].id);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeSite = SITES.find((s) => s.id === activeSiteId)!;

  const handleSelect = (id: string) => {
    setActiveSiteId(id);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[320px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSite.id}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${activeSite.heroImage}')` }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2a39] via-[#0d2a39]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-[1280px] mx-auto">
            <Link
              href="/destination/sinai"
              className="inline-flex items-center gap-1.5 text-white/50 text-xs hover:text-white/80 transition-colors no-underline mb-3"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              العودة لصفحة سيناء
            </Link>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSite.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{activeSite.icon}</span>
                  <h1 className="text-3xl md:text-5xl font-bold text-white font-display">
                    {activeSite.name}
                  </h1>
                </div>
                <p className="text-white/60 text-sm md:text-base">
                  {activeSite.subtitle} · {activeSite.coords}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar — Site Selector */}
          <div>
            <h2 className="text-sm font-bold text-[#7b7c7d] mb-3 px-1">
              المواقع الاستشفائية في سيناء
            </h2>
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {SITES.map((site) => (
                <div key={site.id} className="min-w-[240px] lg:min-w-0">
                  <SiteCard
                    site={site}
                    isActive={activeSiteId === site.id}
                    onClick={() => handleSelect(site.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div ref={contentRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSite.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Quick Facts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {activeSite.quickFacts.map((fact) => (
                    <QuickFact key={fact.label} {...fact} />
                  ))}
                </div>

                {/* Sections */}
                <div className="space-y-5">
                  {activeSite.sections.map((section, i) => (
                    <SectionBlock
                      key={section.title}
                      section={section}
                      color={activeSite.color}
                      index={i}
                    />
                  ))}
                </div>

                {/* Warnings */}
                {activeSite.warnings && activeSite.warnings.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-6"
                  >
                    <h3 className="font-bold text-red-700 font-display flex items-center gap-2 mb-3">
                      <span>⚠️</span> تحذيرات مهمة
                    </h3>
                    <ul className="space-y-2">
                      {activeSite.warnings.map((w, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-red-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* CTA */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/destination/sinai"
                    className="px-6 py-3 bg-[#1d5770] hover:bg-[#174860] text-white font-bold text-sm rounded-full transition-all duration-300 no-underline"
                  >
                    اكتشف سيناء
                  </Link>
                  <Link
                    href="/map"
                    className="px-6 py-3 border border-[#d0dde4] hover:border-[#1d5770] text-[#12394d] font-bold text-sm rounded-full transition-all duration-300 no-underline"
                  >
                    عرض على الخريطة
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
