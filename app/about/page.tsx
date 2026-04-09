"use client";

import Link from "next/link";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { DESTINATIONS } from "@/data/siteData";

const timelineItems = [
  {
    title: "سيوة",
    desc: "واحة الهدوء والعلاج بالملح والرمال في قلب الصحراء الغربية",
    icon: "🏜️",
  },
  {
    title: "سفاجا",
    desc: "شواطئ البحر الأحمر الغنية بالمعادن العلاجية لأمراض الجلد والمفاصل",
    icon: "🌊",
  },
  {
    title: "الوادي الجديد",
    desc: "الرمال الساخنة والينابيع الكبريتية لعلاج الروماتيزم والتوتر",
    icon: "☀️",
  },
  {
    title: "أسوان",
    desc: "المناخ الجاف والدافئ المثالي لأمراض الجهاز التنفسي والاسترخاء",
    icon: "🏛️",
  },
];

const stats = [
  { value: "5", label: "وجهات استشفائية", icon: "📍" },
  { value: "12", label: "علاج طبيعي", icon: "💆" },
  { value: "4", label: "بيئات متنوعة", icon: "🌿" },
  { value: "365", label: "يوم مشمس", icon: "☀️" },
];

const importanceCards = [
  {
    title: "البحث العلمي",
    desc: "يستند المشروع إلى أبحاث علمية موثقة حول فوائد السياحة الاستشفائية في مصر وتأثيرها الإيجابي على الصحة الجسدية والنفسية.",
    icon: "🔬",
  },
  {
    title: "التوثيق الأكاديمي",
    desc: "يهدف المشروع إلى توثيق الموارد الطبيعية العلاجية في مصر بشكل أكاديمي منهجي يساهم في تطوير هذا القطاع السياحي المهم.",
    icon: "📚",
  },
  {
    title: "التنمية المستدامة",
    desc: "يدعم المشروع رؤية مصر 2030 في تنويع مصادر الدخل السياحي وتعزيز السياحة العلاجية كرافد اقتصادي مستدام.",
    icon: "🌱",
  },
];

export default function AboutPage() {
  return (
    <SiteLayout>
      <PageHero title="عن المشروع" />

      {/* About Section */}
      <section className="py-16 px-4" style={{ backgroundColor: "#f5f8fa" }}>
        <div className="max-w-5xl mx-auto" dir="rtl">
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-12">
            <h2
              className="text-3xl font-bold mb-6 text-center"
              style={{ color: "#1d5770" }}
            >
              السياحة الاستشفائية في مصر
            </h2>
            <div className="space-y-4 text-lg leading-loose" style={{ color: "#7b7c7d" }}>
              <p>
                تتميز مصر بموارد طبيعية فريدة تجعلها واحدة من أهم الوجهات
                الاستشفائية في العالم. من الرمال الساخنة في الصحراء الغربية إلى
                المياه المعدنية في البحر الأحمر، تقدم مصر تجربة علاجية شاملة
                تجمع بين الطبيعة والثقافة والتاريخ.
              </p>
              <p>
                يهدف هذا المشروع الأكاديمي إلى تسليط الضوء على الإمكانات
                العلاجية الهائلة التي تمتلكها مصر، وتوفير دليل شامل للباحثين
                والمهتمين بالسياحة الاستشفائية، من خلال تقديم معلومات موثقة عن
                أهم الوجهات والعلاجات المتاحة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Egypt Timeline */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto" dir="rtl">
          <h2
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: "#12394d" }}
          >
            لماذا مصر؟
          </h2>

          <div className="relative">
            {/* Timeline Line */}
            <div
              className="hidden md:block absolute right-1/2 top-0 bottom-0 w-0.5"
              style={{ backgroundColor: "#91b149" }}
            />

            <div className="space-y-12">
              {timelineItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col md:flex-row items-center gap-6 ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content Card */}
                  <div className="flex-1">
                    <div
                      className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${
                        idx % 2 === 0 ? "md:text-left" : "md:text-right"
                      }`}
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: "#1d5770" }}
                      >
                        {item.title}
                      </h3>
                      <p className="leading-relaxed" style={{ color: "#7b7c7d" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Icon */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md z-10 flex-shrink-0"
                    style={{ backgroundColor: "#1d5770" }}
                  >
                    {item.icon}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4" style={{ backgroundColor: "#12394d" }}>
        <div className="max-w-5xl mx-auto" dir="rtl">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">
            مصر في أرقام
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div
                  className="text-4xl font-extrabold mb-1"
                  style={{ color: "#91b149" }}
                >
                  {stat.value}
                </div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Importance */}
      <section className="py-16 px-4" style={{ backgroundColor: "#f5f8fa" }}>
        <div className="max-w-5xl mx-auto" dir="rtl">
          <h2
            className="text-3xl font-bold mb-4 text-center"
            style={{ color: "#12394d" }}
          >
            الأهمية الأكاديمية
          </h2>
          <p
            className="text-center mb-12 max-w-2xl mx-auto"
            style={{ color: "#7b7c7d" }}
          >
            يقدم هذا المشروع إسهاما أكاديميا في مجال السياحة الاستشفائية من خلال
            عدة محاور رئيسية
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {importanceCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-5"
                  style={{ backgroundColor: "#f0f7ed" }}
                >
                  {card.icon}
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: "#1d5770" }}
                >
                  {card.title}
                </h3>
                <p className="leading-relaxed text-sm" style={{ color: "#7b7c7d" }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center" dir="rtl">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "#12394d" }}
          >
            اكتشف الوجهات الاستشفائية
          </h2>
          <p className="mb-8" style={{ color: "#7b7c7d" }}>
            تعرف على أهم الأماكن العلاجية في مصر وابدأ رحلتك نحو الشفاء
            والاسترخاء
          </p>
          <Link
            href="/destinations"
            className="inline-block px-8 py-3 rounded-full text-white font-bold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1d5770" }}
          >
            استكشف الوجهات
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
