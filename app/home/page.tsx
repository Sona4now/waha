"use client";

import SiteLayout from "@/components/site/SiteLayout";
import Link from "next/link";
import { DESTINATIONS } from "@/data/siteData";
import { useEffect, useState, useRef } from "react";

function Counter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const start = performance.now();
          function step(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black text-[#1d5770] mb-2">
        {count.toLocaleString("ar-EG")}+
      </div>
      <div className="text-[#7b7c7d] text-sm">{label}</div>
    </div>
  );
}

export default function HomePage() {
  const [recommendation, setRecommendation] = useState<{
    destinationId: string;
    need: string;
  } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("waaha_recommendation");
      if (saved) setRecommendation(JSON.parse(saved));
    } catch {}
  }, []);

  const recDest = recommendation
    ? DESTINATIONS.find((d) => d.id === recommendation.destinationId)
    : null;

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#12394d]">
        <div
          className="absolute inset-0 bg-cover bg-center animate-[kenBurns_14s_ease-out_forwards]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-[#1b4f72]/90 via-[#1b4f72]/55 to-black/20" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 pt-[72px] text-white">
          <div className="inline-flex items-center gap-2 bg-white/[0.13] backdrop-blur-sm text-white text-[0.82rem] font-bold px-4 py-1.5 rounded-full border border-white/[0.22] mb-5">
            السياحة الاستشفائية الطبيعية
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-5 font-display leading-tight max-w-[680px]">
            استكشف رحلة شفائك في قلب مصر
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-[520px] leading-relaxed">
            طبيعة مصر تمتلك سراً قديماً. مياه تعالج، هواء يجدد، وصمت يشفي.
            اكتشف الوجهة التي تناسب جسدك وروحك.
          </p>
          <div className="flex gap-3.5 flex-wrap">
            <Link
              href="/"
              className="px-8 py-3.5 bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold rounded-full transition-all duration-300 no-underline text-sm"
            >
              ابدأ رحلتك
            </Link>
            <Link
              href="/destinations"
              className="px-8 py-3.5 bg-white/[0.13] hover:bg-white/[0.22] backdrop-blur-sm text-white font-bold rounded-full border border-white/[0.22] transition-all duration-300 no-underline text-sm"
            >
              استكشف الأماكن
            </Link>
          </div>
        </div>
      </section>

      {/* Personalized Banner */}
      {recDest && (
        <section className="bg-gradient-to-l from-[#e4edf2] to-[#eef3e0] py-5">
          <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{recDest.envIcon}</span>
              <div>
                <p className="text-sm text-[#7b7c7d]">
                  بناءً على إجاباتك، وجهتك المقترحة:
                </p>
                <p className="font-bold text-[#12394d]">{recDest.name}</p>
              </div>
            </div>
            <Link
              href={`/destination/${recDest.id}`}
              className="px-6 py-2.5 bg-[#1d5770] hover:bg-[#174860] text-white font-bold rounded-full text-sm transition-all duration-300 no-underline"
            >
              اكتشف وجهتك
            </Link>
          </div>
        </section>
      )}

      {/* Info Cards */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
            لماذا السياحة الاستشفائية؟
          </h2>
          <p className="text-center text-[#7b7c7d] mb-12 max-w-lg mx-auto">
            مصر تمتلك ثروات طبيعية فريدة تجعلها من أفضل الوجهات الاستشفائية في
            العالم
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌊",
                title: "مياه علاجية",
                desc: "مياه البحر الأحمر والعيون الكبريتية تحتوي على معادن نادرة تعالج الأمراض الجلدية وآلام المفاصل.",
              },
              {
                icon: "🏜️",
                title: "بيئات متنوعة",
                desc: "من البحر إلى الصحراء إلى الجبال — كل بيئة تقدم تجربة علاجية مختلفة تناسب احتياجك.",
              },
              {
                icon: "🧘",
                title: "هدوء وتجدد",
                desc: "الابتعاد عن ضوضاء المدينة والتواصل مع الطبيعة يُعيد التوازن للجسد والروح.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-[20px] p-8 shadow-[0_2px_8px_rgba(29,87,112,0.07)] border border-[#d0dde4] hover:-translate-y-2 hover:shadow-[0_8px_40px_rgba(29,87,112,0.16)] transition-all duration-300"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-[#12394d]">
                  {card.title}
                </h3>
                <p className="text-[0.88rem] text-[#7b7c7d] leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
            وجهات استشفائية مختارة
          </h2>
          <p className="text-center text-[#7b7c7d] mb-12">
            اكتشف أفضل الأماكن العلاجية في مصر
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DESTINATIONS.slice(0, 4).map((dest) => (
              <Link
                key={dest.id}
                href={`/destination/${dest.id}`}
                className="bg-white rounded-[20px] overflow-hidden shadow-[0_2px_8px_rgba(29,87,112,0.07)] border border-[#d0dde4] hover:-translate-y-2 hover:shadow-[0_8px_40px_rgba(29,87,112,0.16)] transition-all duration-300 no-underline group"
              >
                <div className="overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <span
                    className={`inline-flex items-center gap-1 text-[0.75rem] font-bold px-2.5 py-1 rounded-full mb-2 ${
                      dest.envClass === "env-sea"
                        ? "bg-[#EBF8FF] text-[#0369a1]"
                        : dest.envClass === "env-desert"
                          ? "bg-[#FEF9EB] text-[#92400e]"
                          : dest.envClass === "env-oasis"
                            ? "bg-[#ECFDF5] text-[#065f46]"
                            : "bg-[#F1F5F9] text-[#374151]"
                    }`}
                  >
                    {dest.envIcon} {dest.environment}
                  </span>
                  <h3 className="text-lg font-bold text-[#12394d] mb-1.5">
                    {dest.name}
                  </h3>
                  <p className="text-[0.85rem] text-[#7b7c7d] leading-relaxed line-clamp-2">
                    {dest.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/destinations"
              className="inline-block px-8 py-3 bg-[#1d5770] hover:bg-[#174860] text-white font-bold rounded-full text-sm transition-all duration-300 no-underline"
            >
              عرض جميع الوجهات
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-[#f5f8fa]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Counter target={5} label="وجهات استشفائية" />
            <Counter target={12} label="علاج طبيعي" />
            <Counter target={4} label="بيئات مختلفة" />
            <Counter target={365} label="يوم شمس في السنة" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#12394d] to-[#1d5770] text-white text-center">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
            ابدأ رحلتك الاستشفائية الآن
          </h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            خُذ تجربتنا التفاعلية واكتشف الوجهة المثالية لك في دقيقة واحدة
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/"
              className="px-8 py-3.5 bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold rounded-full transition-all duration-300 no-underline text-sm"
            >
              ابدأ التجربة
            </Link>
            <Link
              href="/ai-guide"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 transition-all duration-300 no-underline text-sm"
            >
              اسأل المساعد الذكي
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
