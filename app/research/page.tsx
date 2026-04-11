"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/site/Reveal";

interface ResearchSource {
  id: string;
  title: string;
  category: "وجهة" | "بحث علمي" | "مصدر إعلامي";
  description: string;
  url?: string;
  destId?: string;
  icon: string;
}

const SOURCES: ResearchSource[] = [
  // Destination research
  {
    id: "safaga",
    title: "سفاجا — العلاج بالرمال السوداء",
    category: "وجهة",
    description:
      "بحث متكامل عن الموقع الجغرافي، الشمس، مياه البحر، والرمال السوداء. يشمل أنظمة العلاج للصدفية (50% تحسن) والروماتويد (70-75%).",
    destId: "safaga",
    icon: "🌊",
  },
  {
    id: "siwa",
    title: "سيوة — الواحة المعدنية",
    category: "وجهة",
    description:
      "توثيق لـ 200 عين طبيعية + 1000 بئر + 190,000 م³ إنتاج يومي. يشمل 6 مواقع استشفائية: العين بريزي، بئر واحد، عين كليوباترا، بحيرات الملح، كهف الملح، جبل الدكرور.",
    destId: "siwa",
    icon: "🌴",
  },
  {
    id: "sinai",
    title: "سيناء — 4 مواقع استشفائية",
    category: "وجهة",
    description:
      "بحث شامل عن وادي عسل (بحيرة كبريتية 200°م)، سرابيط الخادم (أقدم أبجدية)، حمام موسى (5 عيون)، وعيون موسى (12 عين ذُكرت في التوراة).",
    destId: "sinai",
    icon: "⛰️",
  },
  {
    id: "fayoum",
    title: "الفيوم — التراث والعلاج الطبيعي",
    category: "وجهة",
    description:
      "توثيق وادي الحيتان (تراث يونسكو 2005)، عيون الريان (4 ينابيع كبريتية)، البحيرة المسحورة، وقرية تونس.",
    destId: "fayoum",
    icon: "🏞️",
  },
  {
    id: "bahariya",
    title: "الواحات البحرية — 8 مواقع",
    category: "وجهة",
    description:
      "بحث عن الصحراء البيضاء، الصحراء السوداء، جبل الكريستال، كهف الجارة، بئر سيجام (45°م)، صخرة أبو الهول، مزارع النخيل، ووادي الحيز.",
    destId: "bahariya",
    icon: "🏜️",
  },
];

const METHODOLOGY = [
  {
    step: "1",
    title: "جمع البيانات الأولية",
    description:
      "جمع المصادر البحثية من وزارة البيئة المصرية، وزارة السياحة والآثار، ودراسات أكاديمية حول السياحة العلاجية.",
    icon: "📚",
  },
  {
    step: "2",
    title: "التحقق والتوثيق",
    description:
      "التحقق من المعلومات العلمية عبر مصادر متعددة، وتوثيق كل معلومة بمصدرها الأكاديمي قبل النشر.",
    icon: "🔍",
  },
  {
    step: "3",
    title: "التبسيط الإعلامي",
    description:
      "تحويل المعلومات العلمية إلى محتوى قابل للفهم من الجمهور العام دون فقدان الدقة العلمية.",
    icon: "✍️",
  },
  {
    step: "4",
    title: "المراجعة الأكاديمية",
    description:
      "مراجعة المحتوى من قبل المشرفين الأكاديميين بقسم الإعلام الرقمي — جامعة القاهرة.",
    icon: "🎓",
  },
];

const DATA_SOURCES = [
  {
    category: "مصادر حكومية",
    icon: "🏛️",
    items: [
      "وزارة السياحة والآثار المصرية",
      "وزارة البيئة (EEAA)",
      "المجلس الأعلى للآثار",
      "محافظة جنوب سيناء",
    ],
  },
  {
    category: "مصادر علمية",
    icon: "🔬",
    items: [
      "دراسات منظمة الصحة العالمية",
      "أبحاث كلية الطب — جامعة القاهرة",
      "المجلات العلمية المحكّمة",
      "دراسات ميدانية أكاديمية",
    ],
  },
  {
    category: "مصادر إعلامية",
    icon: "📰",
    items: [
      "البوابة الرسمية لليونسكو",
      "Egyptian Geographic",
      "البلد نيوز",
      "الوطن المصرية",
    ],
  },
  {
    category: "تراث شفوي",
    icon: "👥",
    items: [
      "روايات السكان المحليين",
      "تقاليد البدو في سيناء",
      "الموروث الأمازيغي في سيوة",
      "الطب الشعبي المصري",
    ],
  },
];

const PROJECT_STATS = [
  { number: "5", label: "وجهات رئيسية", icon: "🗺️" },
  { number: "22+", label: "موقع فرعي موثّق", icon: "📍" },
  { number: "8", label: "جولات 360° تفاعلية", icon: "🎥" },
  { number: "23", label: "عضو في الفريق", icon: "👥" },
  { number: "4", label: "مصرفين أكاديميين", icon: "🎓" },
  { number: "100%", label: "محتوى بحثي موثّق", icon: "✓" },
];

export default function ResearchPage() {
  return (
    <SiteLayout>
      <PageHero
        title="الأرشيف البحثي"
        subtitle="توثيق شامل للمصادر والمنهجية العلمية للمشروع"
        breadcrumb={[
          { label: "الرئيسية", href: "/home" },
          { label: "الأرشيف البحثي" },
        ]}
      />

      {/* Stats */}
      <section className="py-16 bg-white dark:bg-[#0d1b2a]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                <span className="w-6 h-px bg-[#91b149]" />
                أرقام المشروع
                <span className="w-6 h-px bg-[#91b149]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#12394d] dark:text-white">
                جهد بحثي موثّق
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PROJECT_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-gradient-to-br from-[#f5f8fa] to-white dark:from-[#162033] dark:to-[#0a151f] rounded-2xl p-6 border border-[#d0dde4] dark:border-[#1e3a5f] text-center group hover:border-[#91b149]/40 transition-all"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-black text-[#1d5770] dark:text-[#91b149] mb-1">
                  {stat.number}
                </div>
                <div className="text-xs text-[#7b7c7d] dark:text-white/60">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-20 bg-[#f5f8fa] dark:bg-[#0a151f]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                <span className="w-6 h-px bg-[#91b149]" />
                المنهجية البحثية
                <span className="w-6 h-px bg-[#91b149]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#12394d] dark:text-white mb-3">
                كيف جمعنا المحتوى؟
              </h2>
              <p className="text-sm text-[#7b7c7d] dark:text-white/60 max-w-2xl mx-auto">
                منهجية علمية صارمة لضمان دقة ومصداقية كل معلومة في المنصة
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {METHODOLOGY.map((item, i) => (
              <Reveal key={item.step} delay={i * 0.1}>
                <div className="bg-white dark:bg-[#162033] rounded-2xl p-6 border border-[#d0dde4] dark:border-[#1e3a5f] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#91b149]/5 rounded-bl-full" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#91b149] to-[#6a8435] text-white font-black text-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{item.icon}</span>
                        <h3 className="font-bold font-display text-lg text-[#12394d] dark:text-white">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-[#7b7c7d] dark:text-white/60 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Research Sources */}
      <section className="py-20 bg-white dark:bg-[#0d1b2a]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                <span className="w-6 h-px bg-[#91b149]" />
                مصادر البحث
                <span className="w-6 h-px bg-[#91b149]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#12394d] dark:text-white">
                التوثيق لكل وجهة
              </h2>
            </div>
          </Reveal>

          <div className="space-y-4">
            {SOURCES.map((source, i) => (
              <Reveal key={source.id} delay={i * 0.08}>
                <div className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] p-5 md:p-6 flex items-start gap-4 hover:border-[#91b149]/40 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-[#f5f8fa] dark:bg-[#0a151f] flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {source.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-bold font-display text-lg text-[#12394d] dark:text-white">
                        {source.title}
                      </h3>
                      <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#91b149]/10 text-[#91b149]">
                        {source.category}
                      </span>
                    </div>
                    <p className="text-sm text-[#7b7c7d] dark:text-white/60 leading-relaxed mb-3">
                      {source.description}
                    </p>
                    {source.destId && (
                      <Link
                        href={`/destination/${source.destId}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d5770] dark:text-[#91b149] hover:gap-2 transition-all no-underline"
                      >
                        تصفح الوجهة الكاملة
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 19l-7-7 7-7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-20 bg-[#f5f8fa] dark:bg-[#0a151f]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                <span className="w-6 h-px bg-[#91b149]" />
                المصادر
                <span className="w-6 h-px bg-[#91b149]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#12394d] dark:text-white mb-3">
                مصادر البيانات
              </h2>
              <p className="text-sm text-[#7b7c7d] dark:text-white/60 max-w-2xl mx-auto">
                جميع المعلومات على المنصة مستمدة من مصادر موثّقة ومتنوعة
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DATA_SOURCES.map((group, i) => (
              <Reveal key={group.category} delay={i * 0.1}>
                <div className="bg-white dark:bg-[#162033] rounded-2xl p-6 border border-[#d0dde4] dark:border-[#1e3a5f] h-full">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#d0dde4] dark:border-[#1e3a5f]">
                    <span className="text-3xl">{group.icon}</span>
                    <h3 className="font-bold font-display text-lg text-[#12394d] dark:text-white">
                      {group.category}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-[#12394d]/80 dark:text-white/70"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#91b149] mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Disclaimer */}
      <section className="py-16 bg-white dark:bg-[#0d1b2a]">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="bg-gradient-to-br from-[#e4edf2] to-[#eef3e0] dark:from-[#162033] dark:to-[#0a151f] rounded-2xl p-8 border-r-4 border-[#91b149] text-center">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold font-display text-[#12394d] dark:text-white mb-3">
                تنويه أكاديمي
              </h3>
              <p className="text-sm text-[#12394d]/80 dark:text-white/70 leading-relaxed mb-4">
                جميع المعلومات المقدمة في هذا المشروع هي لأغراض{" "}
                <strong>توعوية وتعليمية وتجريبية فقط</strong> ولا تُقدَّم
                كبديل للاستشارة الطبية المتخصصة. يُنصح دائماً بمراجعة الطبيب
                قبل بدء أي برنامج علاجي طبيعي.
              </p>
              <p className="text-xs text-[#7b7c7d]">
                مشروع تخرج — قسم الإعلام الرقمي، جامعة القاهرة · 2026
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
