"use client";

import Link from "next/link";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/site/Reveal";
import { useTranslations } from "@/components/site/LocaleProvider";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/siteMeta";

interface BilingualEntry {
  icon: string;
  ar: { title: string; description: string };
  en: { title: string; description: string };
}

const AWARENESS_GOALS: BilingualEntry[] = [
  {
    icon: "🌿",
    ar: {
      title: "رفع الوعي بمفهوم الاستشفاء من الطبيعة",
      description:
        "تعريف الجمهور بكيفية تأثير البيئات الطبيعية المصرية على الصحة النفسية والجسدية",
    },
    en: {
      title: "Raising awareness about natural healing",
      description:
        "Helping audiences understand how Egypt's natural environments affect physical and mental health",
    },
  },
  {
    icon: "🔬",
    ar: {
      title: "تصحيح الفهم الخاطئ حول العلاج البيئي",
      description:
        "تقديم محتوى علمي مبسّط يفسر كيف ولماذا تعمل هذه الموارد الطبيعية",
    },
    en: {
      title: "Correcting common misconceptions about natural therapy",
      description:
        "Simplified, science-backed content explaining how and why these natural resources work",
    },
  },
  {
    icon: "💎",
    ar: {
      title: "إبراز قيمة الموارد الطبيعية العلاجية في مصر",
      description: "توثيق الكنوز الطبيعية المصرية في إطار بيئي وثقافي",
    },
    en: {
      title: "Highlighting Egypt's therapeutic natural assets",
      description:
        "Documenting Egypt's natural treasures in an environmental and cultural frame",
    },
  },
];

const ENV_GOALS: BilingualEntry[] = [
  {
    icon: "♻️",
    ar: {
      title: "تشجيع السياحة المستدامة",
      description: "نموذج سياحة صديق للبيئة يحترم الموارد الطبيعية",
    },
    en: {
      title: "Promoting sustainable tourism",
      description: "An eco-friendly model of travel that respects natural resources",
    },
  },
  {
    icon: "🏞️",
    ar: {
      title: "دعم الحفاظ على البيئات الطبيعية",
      description: "التركيز على حماية المحميات والمواقع الطبيعية",
    },
    en: {
      title: "Supporting the protection of natural sites",
      description: "Focused on conserving reserves and natural landscapes",
    },
  },
  {
    icon: "🤝",
    ar: {
      title: "احترام المجتمعات المحلية",
      description: "إبراز دور السكان المحليين في الحفاظ على هذه البيئات",
    },
    en: {
      title: "Respecting local communities",
      description: "Highlighting the role of local people in protecting these environments",
    },
  },
];

const SITE_SECTIONS: BilingualEntry[] = [
  {
    icon: "🏠",
    ar: { title: "الصفحة الرئيسية", description: "تعريف بالمنصة ورؤيتها" },
    en: { title: "Home", description: "Introduction to the platform and its mission" },
  },
  {
    icon: "🗺️",
    ar: {
      title: "الوجهات البيئية",
      description: "محتوى منظم عن الوجهات الاستشفائية في مصر",
    },
    en: {
      title: "Wellness Destinations",
      description: "Curated content on Egypt's healing destinations",
    },
  },
  {
    icon: "🎥",
    ar: {
      title: "جولات 360° تفاعلية",
      description: "استكشف المواقع الطبيعية كأنك موجود هناك",
    },
    en: {
      title: "Interactive 360° Tours",
      description: "Explore natural sites as if you were there",
    },
  },
  {
    icon: "📰",
    ar: {
      title: "المدونة والمقالات",
      description: "محتوى توعوي عن السياحة البيئية والاستشفاء",
    },
    en: {
      title: "Blog & Articles",
      description: "Awareness content on eco-tourism and natural healing",
    },
  },
  {
    icon: "🤖",
    ar: {
      title: "المساعد الذكي",
      description: "اكتشف وجهتك المثالية بناءً على حالتك واحتياجاتك",
    },
    en: {
      title: "AI Assistant",
      description: "Find your ideal destination based on your condition and needs",
    },
  },
  {
    icon: "🌊",
    ar: {
      title: "الاستشفاء من الطبيعة",
      description: "مقالات توعوية حول الرمال والمياه والبيئات الطبيعية",
    },
    en: {
      title: "Healing from Nature",
      description: "Awareness articles on sand, water, and natural environments",
    },
  },
];

const HEALTH_FOCUS = [
  {
    icon: "🦴",
    ar: { condition: "الروماتيزم وآلام المفاصل", source: "الرمال العلاجية — سفاجا، سيوة" },
    en: { condition: "Rheumatism & joint pain", source: "Therapeutic sand — Safaga, Siwa" },
  },
  {
    icon: "✨",
    ar: {
      condition: "الصدفية وبعض الأمراض الجلدية",
      source: "المياه المعدنية والبحرية",
    },
    en: {
      condition: "Psoriasis & some skin conditions",
      source: "Mineral and seawater therapy",
    },
  },
  {
    icon: "🧘",
    ar: {
      condition: "الإجهاد والتوتر المزمن",
      source: "العزلة الطبيعية — الصحراء والجبال",
    },
    en: {
      condition: "Chronic stress & anxiety",
      source: "Natural seclusion — desert and mountains",
    },
  },
  {
    icon: "😴",
    ar: { condition: "الإرهاق الذهني واضطرابات النوم", source: "البيئات الهادئة" },
    en: { condition: "Mental fatigue & sleep disorders", source: "Quiet natural settings" },
  },
];

const VISION_CARDS: BilingualEntry[] = [
  {
    icon: "🌊",
    ar: { title: "مياه كبريتية ومعدنية", description: "موارد مائية فريدة بخصائص علاجية مثبتة" },
    en: { title: "Sulfuric & mineral waters", description: "Rare waters with documented therapeutic properties" },
  },
  {
    icon: "🏖️",
    ar: { title: "رمال غنية بالمعادن", description: "خاصة الرمال السوداء في سفاجا وسيوة" },
    en: { title: "Mineral-rich sand", description: "Especially the black sand of Safaga and Siwa" },
  },
  {
    icon: "🏜️",
    ar: { title: "بيئات صحراوية وبحرية", description: "ذات تأثير إيجابي على الصحة النفسية والجسدية" },
    en: { title: "Desert & marine environments", description: "Documented positive effects on mental and physical wellbeing" },
  },
  {
    icon: "🔗",
    ar: { title: "ربط الإنسان بالطبيعة", description: "فهم العلاقة بين البيئة والثقافة المحلية والصحة" },
    en: { title: "Reconnecting people with nature", description: "Understanding the link between environment, local culture, and health" },
  },
];

// Top-level page strings — kept here so the page reads top-down.
const COPY = {
  ar: {
    badge: "منصة محتوى رقمية",
    tagline: "شفاؤك من الطبيعة",
    intro:
      "منصة محتوى رقمية تختص بالتوعية حول السياحة البيئية المستدامة في مصر، والاستشفاء من الطبيعة كنهج داعم للصحة، والعلاقة بين البيئة والإنسان والثقافة المحلية — من خلال محتوى بصري وتجريبي يهدف إلى رفع الوعي والتوثيق وإعادة تقديم الموارد الطبيعية المصرية في إطار غير تجاري ومسؤول بيئياً.",
    visionEyebrow: "رؤيتنا",
    visionTitle: "لماذا واحة؟",
    visionLead:
      "تتمتع مصر بموارد طبيعية ذات قيمة علاجية معترف بها تاريخياً، لكن لا يوجد طرح إعلامي متخصص يقدّم هذه الموارد في إطار بيئي مستدام.",
    awarenessEyebrow: "أهدافنا التوعوية",
    awarenessTitle: "ما نسعى إليه",
    envEyebrow: "أهدافنا البيئية",
    envTitle: "سياحة مستدامة ومسؤولة",
    envLead: "نؤمن أن السياحة الحقيقية هي التي تحترم الموارد والمجتمعات",
    healthEyebrow: "المحتوى العلاجي",
    healthTitle: "نركّز على التوعية بحالات صحية محددة",
    healthLead: "المحتوى توعوي وتجريبي ولا يُقدَّم كبديل طبي",
    sectionsEyebrow: "المنصة الرقمية",
    sectionsTitle: "أقسام الموقع",
    contactTitle: "تواصل معنا",
    contactLead:
      "نرحب باقتراحاتك وأسئلتك. واحة تسعى دائماً لإثراء المحتوى وخدمة قضايا الإنسان والطبيعة والاستدامة.",
    emailLabel: "البريد الإلكتروني",
    phoneLabel: "للتواصل المباشر",
    breadcrumbAbout: "من نحن",
    breadcrumbHome: "الرئيسية",
    home: "الرئيسية",
    blog: "المدونة",
  },
  en: {
    badge: "Digital editorial platform",
    tagline: "Healing from nature",
    intro:
      "Waha is a digital editorial platform dedicated to eco-tourism in Egypt, healing from nature as a supportive approach to health, and the relationship between people, environment, and local culture — through visual and experiential content that raises awareness, documents Egypt's natural assets, and presents them in a non-commercial, environmentally-responsible frame.",
    visionEyebrow: "Our vision",
    visionTitle: "Why Waha?",
    visionLead:
      "Egypt has natural resources with historically recognised therapeutic value — yet there's no specialised editorial platform presenting them within a sustainable environmental frame.",
    awarenessEyebrow: "Awareness goals",
    awarenessTitle: "What we work toward",
    envEyebrow: "Environmental goals",
    envTitle: "Sustainable, responsible tourism",
    envLead: "We believe real tourism respects both resources and communities",
    healthEyebrow: "Healing content",
    healthTitle: "We focus on raising awareness about specific conditions",
    healthLead:
      "All content is awareness-based and experiential — not a medical substitute",
    sectionsEyebrow: "The platform",
    sectionsTitle: "Site sections",
    contactTitle: "Contact us",
    contactLead:
      "We welcome suggestions and questions. Waha is always working to enrich its content in service of people, nature, and sustainability.",
    emailLabel: "Email",
    phoneLabel: "Direct line",
    breadcrumbAbout: "About",
    breadcrumbHome: "Home",
    home: "Home",
    blog: "Blog",
  },
};

export default function AboutPage() {
  const { t, locale } = useTranslations();
  const c = locale === "en" ? COPY.en : COPY.ar;

  return (
    <SiteLayout>
      <PageHero
        title={t("aboutPage.title")}
        subtitle={t("aboutPage.subtitle")}
        breadcrumb={[
          { label: c.breadcrumbHome, href: "/home" },
          { label: c.breadcrumbAbout },
        ]}
      />

      {/* Intro — Hero Statement */}
      <section className="py-20 bg-white dark:bg-[#0d1b2a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#91b149]/10 text-[#91b149] text-[10px] font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-[#91b149] animate-pulse" />
              {c.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-display text-[#12394d] dark:text-white leading-tight mb-6">
              {locale === "en" ? (
                <>
                  <span className="text-[#91b149]">Waha</span> — واحة
                </>
              ) : (
                <>
                  <span className="text-[#91b149]">واحة</span> — WAHA
                </>
              )}
            </h1>
            <p className="text-xl md:text-2xl font-display text-[#1d5770] dark:text-white/90 font-bold mb-4">
              {c.tagline}
            </p>
            <p className="text-base md:text-lg text-[#7b7c7d] dark:text-white/60 leading-relaxed max-w-3xl mx-auto">
              {c.intro}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Vision / Why */}
      <section className="py-20 bg-[#f5f8fa] dark:bg-[#0a151f]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                <span className="w-6 h-px bg-[#91b149]" />
                {c.visionEyebrow}
                <span className="w-6 h-px bg-[#91b149]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#12394d] dark:text-white mb-4">
                {c.visionTitle}
              </h2>
              <p className="text-[#7b7c7d] max-w-2xl mx-auto">{c.visionLead}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VISION_CARDS.map((item, i) => {
              const local = locale === "en" ? item.en : item.ar;
              return (
                <Reveal key={local.title} delay={i * 0.1}>
                  <div className="bg-white dark:bg-[#162033] rounded-2xl p-6 border border-[#d0dde4] dark:border-[#1e3a5f] hover:border-[#91b149]/40 transition-all hover:-translate-y-1 h-full">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="font-bold font-display text-lg text-[#12394d] dark:text-white mb-1">
                      {local.title}
                    </h3>
                    <p className="text-sm text-[#7b7c7d] dark:text-white/60 leading-relaxed">
                      {local.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Awareness goals */}
      <section className="py-20 bg-white dark:bg-[#0d1b2a]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                <span className="w-6 h-px bg-[#91b149]" />
                {c.awarenessEyebrow}
                <span className="w-6 h-px bg-[#91b149]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#12394d] dark:text-white">
                {c.awarenessTitle}
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {AWARENESS_GOALS.map((goal, i) => {
              const local = locale === "en" ? goal.en : goal.ar;
              return (
                <Reveal key={local.title} delay={i * 0.1}>
                  <div className="relative bg-gradient-to-br from-[#f5f8fa] to-white dark:from-[#162033] dark:to-[#0a151f] rounded-2xl p-6 border border-[#d0dde4] dark:border-[#1e3a5f] h-full overflow-hidden group">
                    <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-[#91b149]/10 blur-2xl group-hover:scale-125 transition-transform duration-500" />
                    <div className="relative">
                      <div className="text-4xl mb-4">{goal.icon}</div>
                      <h3 className="font-bold font-display text-lg text-[#12394d] dark:text-white mb-2">
                        {local.title}
                      </h3>
                      <p className="text-sm text-[#7b7c7d] dark:text-white/60 leading-relaxed">
                        {local.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Environmental goals */}
      <section className="py-20 bg-gradient-to-br from-[#12394d] via-[#1d5770] to-[#0d2a39] text-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#91b149]/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#91b149]/5 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                <span className="w-6 h-px bg-[#91b149]" />
                {c.envEyebrow}
                <span className="w-6 h-px bg-[#91b149]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                {c.envTitle}
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">{c.envLead}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ENV_GOALS.map((goal, i) => {
              const local = locale === "en" ? goal.en : goal.ar;
              return (
                <Reveal key={local.title} delay={i * 0.1}>
                  <div className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.1] transition-all hover:-translate-y-1 h-full">
                    <div className="text-4xl mb-3">{goal.icon}</div>
                    <h3 className="font-bold font-display text-lg mb-2">
                      {local.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {local.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Health focus */}
      <section className="py-20 bg-[#f5f8fa] dark:bg-[#0a151f]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                <span className="w-6 h-px bg-[#91b149]" />
                {c.healthEyebrow}
                <span className="w-6 h-px bg-[#91b149]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#12394d] dark:text-white mb-4">
                {c.healthTitle}
              </h2>
              <p className="text-[#7b7c7d] dark:text-white/60 max-w-2xl mx-auto text-sm">
                {c.healthLead}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HEALTH_FOCUS.map((item, i) => {
              const local = locale === "en" ? item.en : item.ar;
              return (
                <Reveal key={local.condition} delay={i * 0.1}>
                  <div className="flex items-start gap-4 bg-white dark:bg-[#162033] rounded-2xl p-5 border border-[#d0dde4] dark:border-[#1e3a5f] hover:border-[#91b149]/40 transition-all group">
                    <div className="w-14 h-14 rounded-full bg-[#91b149]/10 dark:bg-[#91b149]/20 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold font-display text-lg text-[#12394d] dark:text-white mb-1">
                        {local.condition}
                      </h3>
                      <p className="text-xs text-[#7b7c7d] dark:text-white/50">
                        {local.source}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Site sections */}
      <section className="py-20 bg-white dark:bg-[#0d1b2a]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                <span className="w-6 h-px bg-[#91b149]" />
                {c.sectionsEyebrow}
                <span className="w-6 h-px bg-[#91b149]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#12394d] dark:text-white mb-4">
                {c.sectionsTitle}
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SITE_SECTIONS.map((section, i) => {
              const local = locale === "en" ? section.en : section.ar;
              return (
                <Reveal key={local.title} delay={i * 0.06}>
                  <div className="bg-[#f5f8fa] dark:bg-[#162033] rounded-2xl p-6 border border-[#d0dde4] dark:border-[#1e3a5f] hover:border-[#91b149]/40 hover:-translate-y-1 transition-all h-full">
                    <div className="text-3xl mb-3">{section.icon}</div>
                    <h3 className="font-bold font-display text-base text-[#12394d] dark:text-white mb-2">
                      {local.title}
                    </h3>
                    <p className="text-sm text-[#7b7c7d] dark:text-white/60 leading-relaxed">
                      {local.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0d2a39] via-[#1d5770] to-[#12394d] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#91b149]/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#91b149]/10 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              {c.contactTitle}
            </h2>
            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              {c.contactLead}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
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
                    {c.emailLabel}
                  </div>
                  <div className="text-sm font-semibold truncate">
                    {CONTACT_EMAIL}
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
                <div className="text-left flex-1 min-w-0" dir="ltr">
                  <div className="text-[10px] text-white/50 uppercase tracking-wider">
                    {c.phoneLabel}
                  </div>
                  <div className="text-sm font-semibold">
                    {CONTACT_PHONE_DISPLAY}
                  </div>
                </div>
              </a>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/home"
                className="px-6 py-3 rounded-full bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold text-sm transition-colors no-underline"
              >
                {c.home}
              </Link>
              <Link
                href="/blog"
                className="px-6 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white font-bold text-sm transition-colors no-underline"
              >
                {c.blog}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
