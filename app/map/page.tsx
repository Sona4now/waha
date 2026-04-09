"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { DESTINATIONS } from "@/data/siteData";

// Dynamic import - Leaflet doesn't support SSR
const EgyptMap = dynamic(() => import("@/components/site/EgyptMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl bg-[#e8f0f5] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-[#1d5770] border-t-transparent rounded-full animate-spin" />
        <span className="text-[#7b7c7d] text-sm">جاري تحميل الخريطة...</span>
      </div>
    </div>
  ),
});

const TREATMENT_FILTERS = [
  "الكل",
  "مفاصل",
  "جلد",
  "تنفس",
  "توتر",
  "استرخاء",
];

export default function MapPage() {
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [activeDestination, setActiveDestination] = useState<string | null>(
    null
  );

  const filteredDestinations = useMemo(() => {
    if (activeFilter === "الكل") return DESTINATIONS;
    return DESTINATIONS.filter((d) => d.treatments.includes(activeFilter));
  }, [activeFilter]);

  const handleSelectDestination = useCallback((id: string) => {
    setActiveDestination(id);
  }, []);

  return (
    <SiteLayout>
      <PageHero
        title="خريطة الوجهات"
        subtitle="استكشف وجهات السياحة الاستشفائية على خريطة مصر التفاعلية"
        breadcrumb={[
          { label: "الرئيسية", href: "/home" },
          { label: "خريطة الوجهات" },
        ]}
      />

      <section className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Treatment Filters */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-[#12394d] mb-3 font-display">
            تصفية حسب العلاج
          </h2>
          <div className="flex flex-wrap gap-2">
            {TREATMENT_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setActiveDestination(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-[#1d5770] text-white shadow-md"
                    : "bg-white text-[#12394d] border border-[#d0dde4] hover:border-[#1d5770] hover:text-[#1d5770]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Map + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Map */}
          <div className="h-[450px] md:h-[600px] rounded-2xl overflow-hidden shadow-lg border border-[#d0dde4]">
            <EgyptMap
              destinations={filteredDestinations}
              activeDestination={activeDestination}
              onSelectDestination={handleSelectDestination}
            />
          </div>

          {/* Sidebar */}
          <div className="bg-white rounded-2xl border border-[#d0dde4] shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-[#12394d] px-5 py-4">
              <h3 className="text-white font-bold font-display text-lg">
                الوجهات
              </h3>
              <p className="text-white/50 text-xs mt-0.5">
                {filteredDestinations.length} وجهة
                {activeFilter !== "الكل" && ` · ${activeFilter}`}
              </p>
            </div>

            {/* Destination List */}
            <div className="max-h-[350px] md:max-h-[508px] overflow-y-auto">
              {filteredDestinations.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => handleSelectDestination(dest.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-right transition-all duration-200 border-b border-[#f0f0f0] hover:bg-[#f5f8fa] group ${
                    activeDestination === dest.id
                      ? "bg-[#e4edf2] border-r-4 border-r-[#1d5770]"
                      : ""
                  }`}
                >
                  {/* Image thumbnail */}
                  <div
                    className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow"
                    style={{ backgroundImage: `url('${dest.image}')` }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#12394d] font-display">
                        {dest.name}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: `${dest.color}15`,
                          color: dest.color,
                        }}
                      >
                        {dest.envIcon} {dest.environment}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dest.treatments.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] text-[#7b7c7d] bg-[#f5f8fa] px-1.5 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="w-4 h-4 text-[#d0dde4] group-hover:text-[#1d5770] transition-colors flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              ))}

              {filteredDestinations.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-[#7b7c7d] text-sm mb-3">
                    لا توجد وجهات تطابق هذا الفلتر
                  </p>
                  <button
                    onClick={() => setActiveFilter("الكل")}
                    className="text-[#1d5770] text-sm font-bold hover:underline"
                  >
                    عرض الكل
                  </button>
                </div>
              )}
            </div>

            {/* Footer CTA */}
            {activeDestination && (
              <div className="p-4 border-t border-[#f0f0f0] bg-[#f5f8fa]">
                <Link
                  href={`/destination/${activeDestination}`}
                  className="block w-full text-center py-3 bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold text-sm rounded-full transition-all duration-300 no-underline"
                >
                  اكتشف{" "}
                  {DESTINATIONS.find((d) => d.id === activeDestination)?.name}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-[#7b7c7d]">
          <span className="font-semibold text-[#12394d]">دليل الألوان:</span>
          {[
            { label: "بحر", color: "#0e7490", icon: "🌊" },
            { label: "صحراء", color: "#b45309", icon: "🏜️" },
            { label: "واحة", color: "#065f46", icon: "🌴" },
            { label: "جبال", color: "#44403c", icon: "⛰️" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: item.color }}
              />
              <span>
                {item.icon} {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
