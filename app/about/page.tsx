"use client";

import Link from "next/link";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/site/Reveal";
import { useTranslations } from "@/components/site/LocaleProvider";

const AWARENESS_GOALS = [
  {
    icon: "🌿",
    title: "رفع الوعي بمفهوم الاستشفاء من الطبيعة",
    description:
      "تعريف الجمهور بكيفية تأثير البيئات الطبيعية المصرية على الصحة النفسية والجسدية",
  },
  {
    icon: "🔬",
    title: "تصحيح الفهم الخاطئ حول العلاج البيئي",
    description:
      "تقديم محتوى علمي مبسّط يفسر كيف ولماذا تعمل هذه الموارد الطبيعية",
  },
  {
    icon: "💎",
    title: "إبراز قيمة الموارد الطبيعية العلاجية في مصر",
    description: "توثيق الكنوز الطبيعية المصرية في إطار بيئي وثقافي",
  },
];

const ENV_GOALS = [
  {
    icon: "♻️",
    title: "تشجيع السياحة المستدامة",
    description: "نموذج سياحة صديق للبيئة يحترم الموارد الطبيعية",
  },
  {
    icon: "🏞️",
    title: "دعم الحفاظ على البيئات الطبيعية",
    description: "التركيز على حماية المحميات والمواقع الطبيعية",
  },
  {
    icon: "🤝",
    title: "احترام المجتمعات المحلية",
    description: "إبراز دور السكان المحليين في الحفاظ على هذه البيئات",
  },
];

const SITE_SECTIONS = [
  {
    icon: "🏠",
    title: "الصفحة الرئيسية",
    description: "تعريف بالمنصة ورؤيتها",
  },
  {
    icon: "🗺️",
    title: "الوجهات البيئية",
    description: "محتوى منظم عن الوجهات الاستشفائية في مصر",
  },
  {
    icon: "🎥",
    title: "جولات 360° تفاعلية",
    description: "استكشف المواقع الطبيعية كأنك موجود هناك",
  },
  {
    icon: "📰",
    title: "المدونة والمقالات",
    description: "محتوى توعوي عن السياحة البيئية والاستشفاء",
  },
  {
    icon: "🤖",
    title: "المساعد الذكي",
    description: "اكتشف وجهتك المثالية بناءً على حالتك واحتياجاتك",
  },
  {
    icon: "🌊",
    title: "الاستشفاء من الطبيعة",
    description: "مقالات توعوية حول الرمال والمياه والبيئات الطبيعية",
  },
];

const HEALTH_FOCUS = [
  {
    icon: "🦴",
    condition: "الروماتيزم وآلام المفاصل",
    source: "الرمال العلاجية — سفاجا، سيوة",
  },
  {
    icon: "✨",
    condition: "الصدفية وبعض الأمراض الجلدية",
    source: "المياه المعدنية والبحرية",
  },
  {
    icon: "🧘",
    condition: "الإجهاد والتوتر المزمن",
    source: "العزلة الطبيعية — الصحراء والجبال",
  },
  {
    icon: "😴",
    condition: "الإرهاق الذهني واضطرابات النوم",
    source: "البيئات الهادئة",
  },
];

export default function AboutPage() {
  const { t } = useTranslations();
  return (
    <SiteLayout>
      <PageHero
        title={t("aboutPage.title")}
        subtitle={t("aboutPage.subtitle")}
        breadcrumb={[
          { label: "الرئيسية", href: "/home" },
          { label: "من نحن" },
        ]}
      />

      {/* Intro — Hero Statement */}
      <section className="py-20 bg-white dark:bg-[#0d1b2a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#91b149]/10 text-[#91b149] text-[10px] font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-[#91b149] animate-pulse" />
              منصة محتوى رقمية
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-display text-[#12394d] dark:text-white leading-tight mb-6">
              <span className="text-[#91b149]">واحة</span> — WAHA
            </h1>
            <p className="text-xl md:text-2xl font-display text-[#1d5770] dark:text-white/90 font-bold mb-4">
              شفاؤك من الطبيعة
            </p>
            <p className="text-base md:text-lg text-[#7b7c7d] dark:text-white/60 leading-relaxed max-w-3xl mx-auto">
              منصة محتوى رقمية تختص بالتوعية حول السياحة البيئية المستدامة في
              مصر، والاستشفاء من الطبيعة كنهج داعم للصحة، والعلاقة بين البيئة
              والإنسان والثقافة المحلية — من خلال محتوى بصري وتجريبي يهدف إلى
              رفع الوعي والتوثيق وإعادة تقديم الموارد الطبيعية المصرية في إطار
              غير تجاري ومسؤول بيئياً.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Vision / Why Section */}
      <section className="py-20 bg-[#f5f8fa] dark:bg-[#0a151f]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                <span className="w-6 h-px bg-[#91b149]" />
                رؤيتنا
                <span className="w-6 h-px bg-[#91b149]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#12394d] dark:text-white mb-4">
                لماذا واحة؟
              </h2>
              <p className="text-[#7b7c7d] max-w-2xl mx-auto">
                تتمتع مصر بموارد طبيعية ذات قيمة علاجية معترف بها تاريخياً،
                لكن لا يوجد طرح إعلامي متخصص يقدّم هذه الموارد في إطار بيئي
                مستدام.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: "🌊",
                title: "مياه كبريتية ومعدنية",
                description: "موارد مائية فريدة بخصائص علاجية مثبتة",
              },
              {
                icon: "🏖️",
                title: "رمال غنية بالمعادن",
                description: "خاصة الرمال السوداء في سفاجا وسيوة",
              },
              {
                icon: "🏜️",
                title: "بيئات صحراوية وبحرية",
                description: "ذات تأثير إيجابي على الصحة النفسية والجسدية",
              },
              {
                icon: "🔗",
                title: "ربط الإنسان بالطبيعة",
                description:
                  "فهم العلاقة بين البيئة والثقافة المحلية والصحة",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="bg-white dark:bg-[#162033] rounded-2xl p-6 border border-[#d0dde4] dark:border-[#1e3a5f] hover:border-[#91b149]/40 transition-all hover:-translate-y-1 h-full">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold font-display text-lg text-[#12394d] dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#7b7c7d] dark:text-white/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Awareness Goals */}
      <section className="py-20 bg-white dark:bg-[#0d1b2a]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                <span className="w-6 h-px bg-[#91b149]" />
                أهدافنا التوعوية
                <span className="w-6 h-px bg-[#91b149]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#12394d] dark:text-white">
                ما نسعى إليه
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {AWARENESS_GOALS.map((goal, i) => (
              <Reveal key={goal.title} delay={i * 0.1}>
                <div className="relative bg-gradient-to-br from-[#f5f8fa] to-white dark:from-[#162033] dark:to-[#0a151f] rounded-2xl p-6 border border-[#d0dde4] dark:border-[#1e3a5f] h-full overflow-hidden group">
                  <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-[#91b149]/10 blur-2xl group-hover:scale-125 transition-transform duration-500" />
                  <div className="relative">
                    <div className="text-4xl mb-4">{goal.icon}</div>
                    <h3 className="font-bold font-display text-lg text-[#12394d] dark:text-white mb-2">
                      {goal.title}
                    </h3>
                    <p className="text-sm text-[#7b7c7d] dark:text-white/60 leading-relaxed">
                      {goal.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Environmental Goals */}
      <section className="py-20 bg-gradient-to-br from-[#12394d] via-[#1d5770] to-[#0d2a39] text-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#91b149]/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#91b149]/5 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                <span className="w-6 h-px bg-[#91b149]" />
                أهدافنا البيئية
                <span className="w-6 h-px bg-[#91b149]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                سياحة مستدامة ومسؤولة
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                نؤمن أن السياحة الحقيقية هي التي تحترم الموارد والمجتمعات
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ENV_GOALS.map((goal, i) => (
              <Reveal key={goal.title} delay={i * 0.1}>
                <div className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.1] transition-all hover:-translate-y-1 h-full">
                  <div className="text-4xl mb-3">{goal.icon}</div>
                  <h3 className="font-bold font-display text-lg mb-2">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {goal.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Health Conditions Focus */}
      <section className="py-20 bg-[#f5f8fa] dark:bg-[#0a151f]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                <span className="w-6 h-px bg-[#91b149]" />
                المحتوى العلاجي
                <span className="w-6 h-px bg-[#91b149]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#12394d] dark:text-white mb-4">
                نركّز على التوعية بحالات صحية محددة
              </h2>
              <p className="text-[#7b7c7d] dark:text-white/60 max-w-2xl mx-auto text-sm">
                المحتوى توعوي وتجريبي ولا يُقدَّم كبديل طبي
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HEALTH_FOCUS.map((item, i) => (
              <Reveal key={item.condition} delay={i * 0.1}>
                <div className="flex items-start gap-4 bg-white dark:bg-[#162033] rounded-2xl p-5 border border-[#d0dde4] dark:border-[#1e3a5f] hover:border-[#91b149]/40 transition-all group">
                  <div className="w-14 h-14 rounded-full bg-[#91b149]/10 dark:bg-[#91b149]/20 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold font-display text-lg text-[#12394d] dark:text-white mb-1">
                      {item.condition}
                    </h3>
                    <p className="text-xs text-[#7b7c7d] dark:text-white/50">
                      {item.source}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Platform Identity */}
      <section className="py-20 bg-white dark:bg-[#0d1b2a]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                <span className="w-6 h-px bg-[#91b149]" />
                المنصة الرقمية
                <span className="w-6 h-px bg-[#91b149]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#12394d] dark:text-white mb-4">
                مرجع معرفي بصري — لا منصة تجارية
              </h2>
              <p className="text-[#7b7c7d] dark:text-white/60 max-w-3xl mx-auto">
                تعتمد واحة على السرد البصري والتجريبي، دون تقديم ادعاءات طبية
                مباشرة. هدفنا توثيق المحتوى بشكل منظم، دعم المصداقية، وتسهيل
                الوصول لجمهور محلي ودولي.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SITE_SECTIONS.map((section, i) => (
              <Reveal key={section.title} delay={i * 0.08}>
                <div className="group bg-[#f5f8fa] dark:bg-[#162033] rounded-xl p-5 border border-[#d0dde4] dark:border-[#1e3a5f] hover:border-[#91b149]/40 hover:bg-white dark:hover:bg-[#0a151f] transition-all h-full">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">
                    {section.icon}
                  </div>
                  <h3 className="font-bold font-display text-base text-[#12394d] dark:text-white mb-1">
                    {section.title}
                  </h3>
                  <p className="text-xs text-[#7b7c7d] dark:text-white/60 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {[
                "محتوى غير دعائي",
                "تجربة تفاعلية 360° VT",
                "سرد بصري وتجريبي",
                "توثيق منظم وقابل للأرشفة",
              ].map((badge) => (
                <span
                  key={badge}
                  className="px-4 py-2 rounded-full bg-gradient-to-l from-[#1d5770]/10 to-[#91b149]/10 dark:from-[#1d5770]/20 dark:to-[#91b149]/20 border border-[#1d5770]/20 dark:border-[#91b149]/20 text-[#1d5770] dark:text-[#91b149] text-xs font-semibold"
                >
                  {badge}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* What WAHA doesn't do */}
      <section className="py-20 bg-[#f5f8fa] dark:bg-[#0a151f]">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="bg-white dark:bg-[#162033] rounded-2xl p-8 md:p-10 border-r-4 border-[#91b149]">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-[#91b149]/10 flex items-center justify-center flex-shrink-0 text-2xl">
                  ℹ️
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-[#12394d] dark:text-white mb-1">
                    واحة منصة توعية — لا وكالة سياحة
                  </h3>
                  <p className="text-xs text-[#7b7c7d]">
                    من المهم توضيح طبيعة المنصة
                  </p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-[#12394d]/80 dark:text-white/70">
                {[
                  "لا نقوم بتنظيم رحلات سياحية",
                  "لا نقوم بحجز فنادق أو طيران",
                  "لا نقدّم استشارات طبية مباشرة",
                  "لا نبيع أي منتجات أو خدمات",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold mt-0.5">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-5 border-t border-[#d0dde4] dark:border-[#1e3a5f]">
                <p className="text-sm text-[#12394d] dark:text-white leading-relaxed">
                  <span className="font-bold text-[#91b149]">بدلاً من ذلك:</span>{" "}
                  نقدّم محتوى موثّق، صور، فيديوهات، جولات 360°، ومعلومات
                  شاملة عن الوجهات الاستشفائية الطبيعية في مصر — مع إرشادك
                  للمراكز المعتمدة للتواصل المباشر.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact + Final CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0d2a39] via-[#12394d] to-[#1d5770] text-white relative overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#91b149]/10 blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
              <span className="w-6 h-px bg-[#91b149]" />
              تواصل معنا
              <span className="w-6 h-px bg-[#91b149]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              نسعد بتعاونك معنا
            </h2>
            <p className="text-white/70 mb-10 leading-relaxed max-w-xl mx-auto">
              تمثّل واحة مبادرة إعلامية معاصرة لإعادة تسليط الضوء على قيمة
              الموارد الطبيعية والبيئية في مصر، من خلال طرح توعوي يربط بين
              الإنسان والطبيعة والاستدامة.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
              <a
                href="mailto:info@wahaeg.com"
                className="group bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 hover:bg-white/[0.12] transition-all flex items-center gap-3 no-underline"
              >
                <div className="w-10 h-10 rounded-full bg-[#91b149]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#91b149"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="text-right flex-1 min-w-0">
                  <div className="text-[10px] text-white/50 uppercase tracking-wider">
                    البريد الإلكتروني
                  </div>
                  <div className="text-sm font-semibold truncate">
                    info@wahaeg.com
                  </div>
                </div>
              </a>
              <a
                href="tel:+201015871193"
                dir="ltr"
                className="group bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 hover:bg-white/[0.12] transition-all flex items-center gap-3 no-underline"
              >
                <div className="w-10 h-10 rounded-full bg-[#91b149]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#91b149"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-[10px] text-white/50 uppercase tracking-wider">
                    Phone
                  </div>
                  <div className="text-sm font-semibold">
                    +20 101 587 1193
                  </div>
                </div>
              </a>
            </div>

            <Link
              href="/home"
              className="inline-block px-8 py-3.5 bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold rounded-full transition-all duration-300 no-underline text-sm shadow-[0_8px_24px_-8px_rgba(145,177,73,0.6)] hover:shadow-[0_12px_32px_-8px_rgba(145,177,73,0.8)] hover:scale-[1.03]"
            >
              ابدأ استكشاف المنصة
            </Link>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
