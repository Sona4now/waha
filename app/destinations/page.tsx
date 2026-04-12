"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { CompareButton } from "@/components/site/ComparisonTray";
import Reveal from "@/components/site/Reveal";
import EmptyState from "@/components/site/EmptyState";
import { DESTINATIONS } from "@/data/siteData";

const treatmentFilters = [
  { key: "الكل", label: "الكل" },
  { key: "مفاصل", label: "مفاصل" },
  { key: "جلد", label: "جلد" },
  { key: "تنفس", label: "تنفس" },
  { key: "توتر", label: "توتر" },
  { key: "استرخاء", label: "استرخاء" },
];

const environmentFilters = [
  { key: "الكل", label: "الكل" },
  { key: "بحر", label: "بحر" },
  { key: "صحراء", label: "صحراء" },
  { key: "واحة", label: "واحة" },
  { key: "جبال", label: "جبال" },
];

export default function DestinationsPage() {
  const [activeTreatment, setActiveTreatment] = useState("الكل");
  const [activeEnvironment, setActiveEnvironment] = useState("الكل");

  const filtered = DESTINATIONS.filter((dest) => {
    const matchTreatment =
      activeTreatment === "الكل" ||
      dest.treatments?.some((t: string) => t.includes(activeTreatment));
    const matchEnvironment =
      activeEnvironment === "الكل" ||
      dest.environment?.includes(activeEnvironment);
    return matchTreatment && matchEnvironment;
  });

  return (
    <SiteLayout>
      <PageHero
        title="الأماكن الاستشفائية"
        subtitle="اكتشف وجهات الشفاء الطبيعية في قلب مصر"
      />

      <section className="py-16 px-4 bg-[#f5f8fa] dark:bg-[#0a151f]">
        <div className="max-w-6xl mx-auto" dir="rtl">
          {/* Treatment Filters */}
          <Reveal>
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 text-[#12394d] dark:text-white">
                نوع العلاج
              </h3>
              <div className="flex flex-wrap gap-2">
                {treatmentFilters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveTreatment(filter.key)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                      activeTreatment === filter.key
                        ? "bg-[#1d5770] text-white border-[#1d5770] shadow-md"
                        : "bg-white dark:bg-[#162033] text-[#7b7c7d] dark:text-white/60 border-[#d1d5db] dark:border-[#1e3a5f] hover:border-[#1d5770] hover:text-[#1d5770]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Environment Filters */}
          <Reveal delay={0.1}>
            <div className="mb-10">
              <h3 className="text-lg font-bold mb-3 text-[#12394d] dark:text-white">
                نوع البيئة
              </h3>
              <div className="flex flex-wrap gap-2">
                {environmentFilters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveEnvironment(filter.key)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                      activeEnvironment === filter.key
                        ? "bg-[#91b149] text-white border-[#91b149] shadow-md"
                        : "bg-white dark:bg-[#162033] text-[#7b7c7d] dark:text-white/60 border-[#d1d5db] dark:border-[#1e3a5f] hover:border-[#91b149] hover:text-[#91b149]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Destinations Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((dest, i) => (
                <Reveal key={dest.id} delay={i * 0.1}>
                  <div className="relative group h-full">
                    <CompareButton id={dest.id} />
                    <Link
                      href={`/destination/${dest.id}`}
                      className="block bg-white dark:bg-[#162033] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.6)] transition-all duration-500 hover:-translate-y-2 border border-[#d0dde4] dark:border-[#1e3a5f] hover:border-[#1d5770]/40 dark:hover:border-[#91b149]/40 h-full no-underline"
                    >
                      {/* Card Image */}
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={dest.image}
                          alt={`${dest.name} — وجهة استشفائية`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        {/* Hover gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Glassmorphism hover CTA */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <span className="bg-white/20 backdrop-blur-md text-white text-sm font-bold px-5 py-2.5 rounded-full border border-white/30 shadow-lg translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                            اكتشف المزيد ←
                          </span>
                        </div>

                        {dest.environment && (
                          <span className="absolute top-3 right-3 text-xs font-bold px-3 py-1.5 rounded-full text-white bg-[#91b149] shadow-lg">
                            {dest.envIcon} {dest.environment}
                          </span>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-2 text-[#12394d] dark:text-white font-display group-hover:text-[#1d5770] dark:group-hover:text-[#91b149] transition-colors">
                          {dest.name}
                        </h3>
                        <p className="text-sm leading-relaxed mb-4 line-clamp-3 text-[#7b7c7d] dark:text-white/60">
                          {dest.description}
                        </p>

                        {/* Treatments Tags */}
                        {dest.treatments && dest.treatments.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {dest.treatments.map(
                              (treatment: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs px-3 py-1 rounded-full bg-[#f0f7ed] dark:bg-[#91b149]/15 text-[#91b149] group-hover:shadow-sm group-hover:-translate-y-0.5 transition-all duration-300"
                                >
                                  {treatment}
                                </span>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🏜️"
              title="ما لقيناش وجهات بالمواصفات دي"
              description="جرّب تعديل فلتر العلاج أو البيئة، أو شيل الفلاتر كلها عشان تشوف الوجهات المتاحة"
              action={
                <button
                  onClick={() => {
                    setActiveTreatment("الكل");
                    setActiveEnvironment("الكل");
                  }}
                  className="px-6 py-3 rounded-full bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white font-bold text-sm hover:shadow-lg transition-all hover:scale-[1.03]"
                >
                  امسح الفلاتر وشوف كل الوجهات
                </button>
              }
            />
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
