"use client";

import { useState } from "react";
import Link from "next/link";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
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
              {filtered.map((dest) => (
                <Link
                  key={dest.id}
                  href={`/destination/${dest.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
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
                        className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: "#91b149" }}
                      >
                        {dest.environment}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: "#12394d" }}
                    >
                      {dest.name}
                    </h3>
                    <p
                      className="text-sm leading-relaxed mb-4 line-clamp-3"
                      style={{ color: "#7b7c7d" }}
                    >
                      {dest.description}
                    </p>

                    {/* Treatments Tags */}
                    {dest.treatments && dest.treatments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {dest.treatments.map((treatment: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: "#f0f7ed",
                              color: "#91b149",
                            }}
                          >
                            {treatment}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: "#12394d" }}
              >
                لا توجد نتائج
              </h3>
              <p style={{ color: "#7b7c7d" }}>
                جرّب تغيير معايير البحث للعثور على وجهات مناسبة
              </p>
              <button
                onClick={() => {
                  setActiveTreatment("الكل");
                  setActiveEnvironment("الكل");
                }}
                className="mt-6 px-6 py-2 rounded-full text-white font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#1d5770" }}
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
