"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/site/SiteLayout";
import { DESTINATIONS, getDestById } from "@/data/siteData";

const BASE_TABS = [
  { key: "overview", label: "نبذة" },
  { key: "benefits", label: "الفوائد العلاجية" },
  { key: "timing", label: "أفضل وقت" },
  { key: "why", label: "لماذا هنا؟" },
];

const SINAI_TAB = { key: "sites", label: "المواقع الاستشفائية" };

/* ─── Sinai Therapeutic Sites Data ─── */
interface TherapeuticSite {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  sections: { title: string; icon: string; content: string[] }[];
  warnings?: string[];
  quickFacts: { label: string; value: string; icon: string }[];
}

const SINAI_SITES: TherapeuticSite[] = [
  {
    id: "wadi-asal",
    name: "وادي عسل",
    subtitle: "البحيرة الكبريتية — رأس سدر",
    icon: "♨️",
    color: "#0e7490",
    sections: [
      {
        title: "النطاق الجغرافي",
        icon: "🗺️",
        content: [
          "موجود جنوب مدينة رأس سدر في جنوب سيناء، حوالي 10 كيلومتر من المدينة، في منطقة صحراوية ساحلية قريبة من خليج السويس.",
          "المكان في مستوى منخفض بسبب الصدوع الجيولوجية التي خلت المياه السخنة تطلع من باطن الأرض.",
          "البيئة صحراوية مكشوفة، اتزرع سور شجري حوالين العين لتوفير جو مناسب للاستشفاء.",
        ],
      },
      {
        title: "المياه الكبريتية",
        icon: "💧",
        content: [
          "المياه طالعة من خزان جوفي عميق جداً، حرارتها حوالي 200 درجة مئوية.",
          "حفرت لنفسها مجرى طبيعي طوله 100 متر، وتتجمع في بحيرة طبيعية مساحتها 150 م² وعمقها مترين.",
          "الحرارة أعلى عند المنبع وتقل في البحيرة، مما يسمح بالاستحمام الآمن.",
        ],
      },
      {
        title: "القيمة العلاجية",
        icon: "🏥",
        content: [
          "الحرارة تساعد على إرخاء العضلات، تخفيف الشد، تحسين الدورة الدموية، وآلام المفاصل والروماتيزم.",
          "الكبريت يُمتص عن طريق الجلد ويعالج الصدفية والإكزيما.",
          "استنشاق البخار يفيد الجهاز التنفسي في حالات الربو والجيوب الأنفية.",
        ],
      },
    ],
    warnings: ["غير مناسب للحوامل", "خطر على مرضى الضغط العالي", "غير مناسب لمرضى الفشل الكلوي"],
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
    sections: [
      {
        title: "النطاق الجغرافي",
        icon: "🗺️",
        content: [
          "في قلب جبال جنوب سيناء، على ارتفاع 1100 - 1200 متر فوق سطح البحر.",
          "مناخ جبلي: برد في الشتاء، معتدل في الصيف. الهضبة من حجر رملي وكوارتز، غنية بالفيروز والنحاس.",
        ],
      },
      {
        title: "البيئة الاستشفائية",
        icon: "🧘",
        content: [
          "استشفاء غير مباشر — العزلة والهدوء والبيئة الجبلية.",
          "علاج بالرمال في الصيف لتخفيف آلام الروماتيزم.",
          "غرف ملح من ملح صخري لتحسين التنفس.",
          "معتقدات بدوية عن طاقة أحجار الكوارتز والفيروز.",
        ],
      },
      {
        title: "القيمة التاريخية",
        icon: "🏛️",
        content: [
          "مركز تعدين الفيروز من الأسرة الرابعة في مصر القديمة.",
          "معبد الإلهة حتحور \"سيدة الفيروز\" — مغارات منحوتة ونقوش فريدة.",
          "فيه الأبجدية السينائية الأولية — أقدم نظام كتابة أبجدي معروف وأصل كل الأبجديات.",
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
    subtitle: "مدينة الطور — ساحل خليج السويس",
    icon: "♨️",
    color: "#065f46",
    sections: [
      {
        title: "النطاق الجغرافي",
        icon: "🗺️",
        content: [
          "في مدينة الطور على ساحل خليج السويس — بين الجبل والواحة والخليج.",
          "ينابيع مياه كبريتية طبيعية تنبع من تحت الجبل وتصب في أحواض مجهزة.",
          "نقطة جذب رئيسية للسياحة العلاجية في المنطقة.",
        ],
      },
      {
        title: "الخصائص العلاجية",
        icon: "🏥",
        content: [
          "مياه كبريتية دافئة (37°م) متجددة طول العام، غنية بالكبريت والصوديوم والمغنيسيوم والكالسيوم.",
          "علاج الصدفية والإكزيما والروماتيزم وتنشيط الدورة الدموية.",
          "المنطقة غنية بالطحالب المفيدة للبشرة والشعر.",
          "خمس عيون رئيسية تصب في أحواض مجهزة للاستحمام.",
        ],
      },
      {
        title: "القيمة التاريخية",
        icon: "📜",
        content: [
          "مرتبط بالنبي موسى عليه السلام — مرّ بالموقع خلال خروجه من مصر مع بني إسرائيل.",
          "الروايات تقول إن قومه أصيبوا بأمراض جلدية فأرشدهم الله لهذه العيون فاغتسلوا وشُفوا.",
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
    sections: [
      {
        title: "النطاق الجغرافي",
        icon: "🗺️",
        content: [
          "منطقة سياحية وأثرية على ساحل خليج السويس، 35 كم من نفق الشهيد أحمد حمدي.",
          "أول محطة سياحية يراها المسافرون إلى شرم الشيخ.",
        ],
      },
      {
        title: "القيمة التاريخية",
        icon: "📜",
        content: [
          "بعد نجاتهم من فرعون، عانى بنو إسرائيل من العطش فضرب موسى الحجر بعصاه فانفجرت 12 عيناً.",
          "في التوراة ذُكر 12 عين و70 نخلة — ومازالت الـ 70 نخلة موجودة.",
        ],
      },
      {
        title: "جهود الدولة",
        icon: "🏗️",
        content: [
          "تم تطهير 7 عيون وتحليل المياه وتنقيتها وافتتاحها في 10 فبراير 2018.",
          "تحليل المياه أثبت أنها عذبة عن طريق المجلس الأعلى للآثار.",
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

export default function DestinationDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const dest = getDestById(id);
  const [activeTab, setActiveTab] = useState("overview");

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: dest?.name || "وجهة علاجية",
          text: dest?.description || "",
          url,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("تم نسخ الرابط!");
    }
  };

  if (!dest) {
    return (
      <SiteLayout>
        <div
          dir="rtl"
          className="min-h-screen flex items-center justify-center"
        >
          <div className="text-center">
            <h1
              className="text-3xl font-bold mb-4"
              style={{ color: "#12394d", fontFamily: "var(--font-display)" }}
            >
              الوجهة غير موجودة
            </h1>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-full text-white"
              style={{ backgroundColor: "#1d5770" }}
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const TABS = id === "sinai" ? [...BASE_TABS, SINAI_TAB] : BASE_TABS;
  const [activeSiteId, setActiveSiteId] = useState(SINAI_SITES[0].id);
  const activeSinaiSite = SINAI_SITES.find((s) => s.id === activeSiteId)!;

  const relatedDestinations = DESTINATIONS.filter((d) => d.id !== dest.id).slice(0, 3);

  return (
    <SiteLayout>
      <div dir="rtl">
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
          <Image
            src={dest.image}
            alt={dest.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 right-0 left-0 p-8 md:p-16">
            <div className="max-w-6xl mx-auto">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm text-white mb-4"
                style={{ backgroundColor: "#91b149" }}
              >
                {dest.environment}
              </span>
              <h1
                className="text-4xl md:text-6xl font-bold text-white mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {dest.name}
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl">
                {dest.description}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Content Area */}
            <div className="flex-1 min-w-0">
              {/* Share Button */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 transition-colors hover:text-white"
                  style={{
                    borderColor: "#1d5770",
                    color: "#1d5770",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1d5770";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#1d5770";
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  مشاركة
                </button>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-gray-200 pb-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-3 text-sm md:text-base font-semibold rounded-t-lg transition-colors relative -mb-[3px] ${
                      activeTab === tab.key
                        ? "text-white"
                        : "hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor:
                        activeTab === tab.key ? "#1d5770" : "transparent",
                      color: activeTab === tab.key ? "#fff" : "#7b7c7d",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                {activeTab === "overview" && (
                  <div>
                    <h2
                      className="text-2xl font-bold mb-4"
                      style={{
                        color: "#12394d",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      نبذة عن {dest.name}
                    </h2>
                    <p
                      className="text-lg leading-relaxed"
                      style={{ color: "#7b7c7d" }}
                    >
                      {dest.longDescription}
                    </p>
                  </div>
                )}

                {activeTab === "benefits" && (
                  <div>
                    <h2
                      className="text-2xl font-bold mb-6"
                      style={{
                        color: "#12394d",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      الفوائد العلاجية
                    </h2>
                    <ul className="space-y-4">
                      {dest.benefits?.map((benefit: { icon: string; text: string }, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <span
                            className="mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: "#91b149" }}
                          >
                            <svg
                              className="w-3.5 h-3.5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                          <span
                            className="text-base leading-relaxed"
                            style={{ color: "#12394d" }}
                          >
                            {benefit.icon} {benefit.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "timing" && (
                  <div>
                    <h2
                      className="text-2xl font-bold mb-6"
                      style={{
                        color: "#12394d",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      أفضل وقت للزيارة
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="p-5 rounded-xl bg-green-50 border border-green-200">
                        <h3
                          className="font-bold text-lg mb-3 flex items-center gap-2"
                          style={{ color: "#91b149" }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          الأشهر المثالية
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {dest.bestMonths?.map(
                            (month: number, i: number) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 rounded-full text-sm text-white font-medium"
                                style={{ backgroundColor: "#91b149" }}
                              >
                                {month}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-600">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          أشهر مقبولة
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {dest.okMonths?.map(
                            (month: number, i: number) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 rounded-full text-sm font-medium bg-amber-200 text-amber-800"
                              >
                                {month}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "why" && (
                  <div>
                    <h2
                      className="text-2xl font-bold mb-6"
                      style={{
                        color: "#12394d",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      لماذا {dest.name}؟
                    </h2>
                    <div className="space-y-4">
                      {dest.reasons?.map((reason: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-start gap-4 p-4 rounded-xl bg-gray-50"
                        >
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{ backgroundColor: "#1d5770" }}
                          >
                            {i + 1}
                          </span>
                          <p
                            className="text-base leading-relaxed"
                            style={{ color: "#12394d" }}
                          >
                            {reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sinai Therapeutic Sites Tab */}
                {activeTab === "sites" && (
                  <div>
                    <h2
                      className="text-2xl font-bold mb-6"
                      style={{ color: "#12394d", fontFamily: "var(--font-display)" }}
                    >
                      المواقع الاستشفائية في سيناء
                    </h2>

                    {/* Site Selector Pills */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {SINAI_SITES.map((site) => (
                        <button
                          key={site.id}
                          onClick={() => setActiveSiteId(site.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border-2 ${
                            activeSiteId === site.id
                              ? "text-white shadow-md"
                              : "bg-white hover:shadow-sm"
                          }`}
                          style={{
                            borderColor: activeSiteId === site.id ? site.color : "#e5e7eb",
                            backgroundColor: activeSiteId === site.id ? site.color : undefined,
                            color: activeSiteId === site.id ? "#fff" : "#12394d",
                          }}
                        >
                          <span className="text-lg">{site.icon}</span>
                          {site.name}
                        </button>
                      ))}
                    </div>

                    {/* Active Site Content */}
                    <div key={activeSinaiSite.id}>
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{activeSinaiSite.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold font-display" style={{ color: activeSinaiSite.color }}>
                            {activeSinaiSite.name}
                          </h3>
                          <p className="text-sm text-[#7b7c7d]">{activeSinaiSite.subtitle}</p>
                        </div>
                      </div>

                      {/* Quick Facts */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
                        {activeSinaiSite.quickFacts.map((fact) => (
                          <div
                            key={fact.label}
                            className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100"
                          >
                            <span className="text-xl block mb-0.5">{fact.icon}</span>
                            <div className="text-base font-bold text-[#12394d]">{fact.value}</div>
                            <div className="text-[10px] text-[#7b7c7d]">{fact.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Sections */}
                      <div className="space-y-5">
                        {activeSinaiSite.sections.map((section) => (
                          <div
                            key={section.title}
                            className="rounded-xl border border-gray-100 bg-gray-50 p-5"
                          >
                            <h4
                              className="font-bold font-display text-base mb-3 flex items-center gap-2"
                              style={{ color: activeSinaiSite.color }}
                            >
                              <span>{section.icon}</span>
                              {section.title}
                            </h4>
                            <div className="space-y-2.5">
                              {section.content.map((text, i) => (
                                <div key={i} className="flex gap-2.5">
                                  <span
                                    className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{ background: activeSinaiSite.color }}
                                  />
                                  <p className="text-sm text-[#12394d]/80 leading-relaxed">{text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Warnings */}
                      {activeSinaiSite.warnings && activeSinaiSite.warnings.length > 0 && (
                        <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4">
                          <h4 className="font-bold text-red-700 font-display text-sm flex items-center gap-2 mb-2">
                            ⚠️ تحذيرات مهمة
                          </h4>
                          <ul className="space-y-1.5">
                            {activeSinaiSite.warnings.map((w, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-red-600">
                                <span className="w-1 h-1 rounded-full bg-red-400" />
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div
                className="rounded-2xl p-6 sticky top-24 text-white"
                style={{ backgroundColor: "#12394d" }}
              >
                <h3
                  className="text-xl font-bold mb-5 border-b border-white/20 pb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  معلومات سريعة
                </h3>

                <div className="space-y-4">
                  <div>
                    <span className="text-white/60 text-sm block mb-1">
                      البيئة
                    </span>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: "#91b149" }}
                    >
                      {dest.environment}
                    </span>
                  </div>

                  <div>
                    <span className="text-white/60 text-sm block mb-1">
                      العلاجات المتاحة
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.treatments?.map(
                        (treatment: string, i: number) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-full text-xs border border-white/30"
                          >
                            {treatment}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {dest.trustSignal && (
                    <div className="mt-4 p-3 rounded-lg bg-white/10">
                      <span className="text-white/60 text-sm block mb-1">
                        مصدر موثوق
                      </span>
                      <p className="text-sm leading-relaxed">
                        {dest.trustSignal}
                      </p>
                    </div>
                  )}
                </div>

                <Link
                  href="/ai-guide"
                  className="block w-full mt-6 py-3 text-center rounded-full font-semibold transition-colors"
                  style={{ backgroundColor: "#91b149" }}
                >
                  اسأل المساعد الذكي
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* Related Destinations */}
        <section
          className="py-16"
          style={{ backgroundColor: "#f8faf5" }}
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2
              className="text-3xl font-bold mb-8 text-center"
              style={{
                color: "#12394d",
                fontFamily: "var(--font-display)",
              }}
            >
              وجهات ذات صلة
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedDestinations.map((rd) => (
                <Link
                  key={rd.id}
                  href={`/destination/${rd.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={rd.image}
                      alt={rd.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs text-white mb-2"
                      style={{ backgroundColor: "#91b149" }}
                    >
                      {rd.environment}
                    </span>
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{
                        color: "#12394d",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {rd.name}
                    </h3>
                    <p className="text-sm line-clamp-2" style={{ color: "#7b7c7d" }}>
                      {rd.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
