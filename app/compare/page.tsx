"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { DESTINATIONS } from "@/data/siteData";

const COMPARISON_ROWS = [
  { key: "environment", label: "البيئة" },
  { key: "treatments", label: "العلاجات" },
  { key: "bestMonths", label: "أفضل الأشهر" },
  { key: "description", label: "الوصف" },
  { key: "features", label: "المميزات" },
];

function ComparePageInner() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);

  // Pre-load from ?ids= query parameter or localStorage
  useEffect(() => {
    const idsParam = searchParams.get("ids");
    if (idsParam) {
      const ids = idsParam.split(",").filter(Boolean).slice(0, 3);
      setSelected(ids);
      return;
    }
    try {
      const saved = localStorage.getItem("waaha_comparison");
      if (saved) {
        const ids = JSON.parse(saved);
        if (Array.isArray(ids)) setSelected(ids.slice(0, 3));
      }
    } catch {}
  }, [searchParams]);

  const toggleDestination = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((s) => s !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const selectedDestinations = DESTINATIONS.filter((d: any) =>
    selected.includes(d.id ?? d.name)
  );

  return (
    <SiteLayout>
      <PageHero
        title="مقارنة الوجهات"
        breadcrumb={[
          { label: "الرئيسية", href: "/" },
          { label: "مقارنة الوجهات" },
        ]}
      />

      <section className="bg-[#f5f8fa] dark:bg-[#0a151f] py-16">
        <div className="container mx-auto px-4" dir="rtl">
          {/* Destination Selection */}
          <div className="mb-12">
            <h2 className="font-display text-xl font-bold text-[#12394d] dark:text-white mb-2 text-center">
              اختر الوجهات للمقارنة
            </h2>
            <p className="text-[#7b7c7d] dark:text-white/60 text-sm text-center mb-6">
              يمكنك اختيار من 2 إلى 3 وجهات
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {DESTINATIONS.map((dest: any) => {
                const destId = dest.id ?? dest.name;
                const isSelected = selected.includes(destId);
                return (
                  <button
                    key={destId}
                    onClick={() => toggleDestination(destId)}
                    className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-display font-semibold transition-all duration-300 ${
                      isSelected
                        ? "bg-[#1d5770] text-white shadow-lg shadow-[#1d5770]/25"
                        : "bg-white dark:bg-[#162033] text-[#7b7c7d] dark:text-white/60 hover:bg-[#1d5770]/10 hover:text-[#1d5770] border border-gray-200 dark:border-[#1e3a5f]"
                    } ${
                      !isSelected && selected.length >= 3
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={!isSelected && selected.length >= 3}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                        isSelected
                          ? "border-white bg-white"
                          : "border-current"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="h-3 w-3 text-[#1d5770]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                    {dest.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comparison Table */}
          {selectedDestinations.length >= 2 ? (
            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-[#1e3a5f] bg-white dark:bg-[#162033] shadow-sm">
              <table className="w-full min-w-[600px] text-right">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#12394d]">
                    <th className="px-6 py-4 font-display text-sm font-bold text-white border-l border-[#1d5770] w-36">
                      عنصر المقارنة
                    </th>
                    {selectedDestinations.map((dest: any) => (
                      <th
                        key={dest.id ?? dest.name}
                        className="px-6 py-4 font-display text-sm font-bold text-white border-l border-[#1d5770] last:border-l-0"
                      >
                        <div className="flex flex-col items-center gap-1">
                          {dest.image && (
                            <Image
                              src={dest.image}
                              alt={dest.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover border-2 border-white/30"
                            />
                          )}
                          {dest.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {COMPARISON_ROWS.map((row, rowIdx) => (
                    <tr
                      key={row.key}
                      className={`${
                        rowIdx % 2 === 0 ? "bg-[#f5f8fa] dark:bg-[#0d1b2a]" : "bg-white dark:bg-[#162033]"
                      } transition-colors hover:bg-[#1d5770]/5`}
                    >
                      <td className="px-6 py-4 font-display text-sm font-bold text-[#1d5770] border-l border-gray-200 dark:border-[#1e3a5f] whitespace-nowrap">
                        {row.label}
                      </td>
                      {selectedDestinations.map((dest: any) => (
                        <td
                          key={dest.id ?? dest.name}
                          className="px-6 py-4 text-sm text-[#12394d] dark:text-white/80 leading-relaxed border-l border-gray-200 dark:border-[#1e3a5f] last:border-l-0"
                        >
                          {row.key === "features" ? (
                            <ul className="list-none space-y-1.5">
                              {(dest[row.key] ?? []).map(
                                (feature: string, i: number) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#91b149]" />
                                    <span>{feature}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            dest[row.key] ?? "—"
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-[#1e3a5f] bg-white dark:bg-[#162033] py-20 text-center">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-[#7b7c7d]/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              </svg>
              <p className="font-display text-lg font-bold text-[#12394d] dark:text-white mb-1">
                اختر وجهتين على الأقل للمقارنة
              </p>
              <p className="text-sm text-[#7b7c7d] dark:text-white/50">
                قم باختيار الوجهات من القائمة أعلاه لعرض جدول المقارنة
              </p>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <ComparePageInner />
    </Suspense>
  );
}
