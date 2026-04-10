"use client";

import { useState } from "react";
import Link from "next/link";
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
      <PageHero title="الأماكن الاستشفائية" />

      <section className="py-16 px-4" style={{ backgroundColor: "#f5f8fa" }}>
        <div className="max-w-6xl mx-auto" dir="rtl">
          {/* Treatment Filters */}
          <div className="mb-6">
            <h3
              className="text-lg font-bold mb-3"
              style={{ color: "#12394d" }}
            >
              نوع العلاج
            </h3>
            <div className="flex flex-wrap gap-2">
              {treatmentFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveTreatment(filter.key)}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    backgroundColor:
                      activeTreatment === filter.key ? "#1d5770" : "#ffffff",
                    color:
                      activeTreatment === filter.key ? "#ffffff" : "#7b7c7d",
                    border: `1px solid ${
                      activeTreatment === filter.key ? "#1d5770" : "#d1d5db"
                    }`,
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Environment Filters */}
          <div className="mb-10">
            <h3
              className="text-lg font-bold mb-3"
              style={{ color: "#12394d" }}
            >
              نوع البيئة
            </h3>
            <div className="flex flex-wrap gap-2">
              {environmentFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveEnvironment(filter.key)}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    backgroundColor:
                      activeEnvironment === filter.key ? "#91b149" : "#ffffff",
                    color:
                      activeEnvironment === filter.key ? "#ffffff" : "#7b7c7d",
                    border: `1px solid ${
                      activeEnvironment === filter.key ? "#91b149" : "#d1d5db"
                    }`,
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Destinations Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((dest, i) => (
                <Reveal key={dest.id} delay={i * 0.08}>
                  <div className="relative group h-full">
                    <CompareButton id={dest.id} />
                    <Link
                      href={`/destination/${dest.id}`}
                      className="block bg-white dark:bg-[#162033] rounded-2xl overflow-hidden shadow-md hover:shadow-xl dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 border border-[#d0dde4] dark:border-[#1e3a5f] h-full"
                    >
                      {/* Card Image */}
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {dest.environment && (
                          <span
                            className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full text-white shadow-md"
                            style={{ backgroundColor: "#91b149" }}
                          >
                            {dest.environment}
                          </span>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-2 text-[#12394d] dark:text-white font-display">
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
                                  className="text-xs px-3 py-1 rounded-full bg-[#f0f7ed] dark:bg-[#91b149]/15 text-[#91b149]"
                                >
                                  {treatment}
                                </span>
                              )
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
