"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { DOCTORS, DOCTOR_SPECIALTIES, type Doctor } from "@/data/doctors";

const LANG_LABEL: Record<string, string> = {
  ar: "العربية",
  en: "English",
  fr: "Français",
  ru: "Русский",
};

export default function DoctorsPage() {
  const [activeSpecialty, setActiveSpecialty] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...DOCTORS];
    if (activeSpecialty !== "all") {
      list = list.filter((d) =>
        d.specialties.some((s) =>
          s.toLowerCase().includes(activeSpecialty.toLowerCase()),
        ),
      );
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.subtitle.toLowerCase().includes(q) ||
          d.conditions.some((c) => c.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [activeSpecialty, search]);

  return (
    <SiteLayout>
      <PageHero
        title="دليل الأطباء"
        subtitle="استشاريون متخصصون في الأمراض اللي بتستفيد من السياحة الاستشفائية. استشر قبل ما تسافر."
        breadcrumb={[
          { label: "الرئيسية", href: "/home" },
          { label: "الأطباء" },
        ]}
      />

      <section className="bg-[#f5f8fa] dark:bg-[#0a151f] py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Disclaimer */}
          <div
            className="mb-8 rounded-2xl bg-[#FEF9EB] dark:bg-[#92400e]/15 border border-[#fcd34d]/40 p-5"
            dir="rtl"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">⚕️</span>
              <div className="text-xs md:text-sm text-[#92400e] dark:text-[#fcd34d] leading-relaxed">
                <strong className="block mb-1">مهم قبل ما تحجز:</strong>
                السياحة الاستشفائية مكمّل للعلاج الطبي مش بديل. ننصح كل
                مستخدم باستشارة طبيب متخصص قبل وبعد البرنامج العلاجي،
                خصوصاً إذا كنت تعاني من حالة مزمنة أو بتاخد أدوية بشكل
                منتظم.
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6 relative" dir="rtl">
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7b7c7d] dark:text-white/40 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم الطبيب أو الحالة (مثال: صدفية)"
              className="w-full pr-11 pl-4 py-3 bg-white dark:bg-[#162033] border border-gray-200 dark:border-[#1e3a5f] rounded-full text-base text-[#12394d] dark:text-white placeholder:text-[#7b7c7d] dark:placeholder:text-white/40 focus:outline-none focus:border-[#1d5770] dark:focus:border-[#91b149] focus:ring-2 focus:ring-[#1d5770]/10 transition-all"
            />
          </div>

          {/* Specialty filter */}
          <div
            className="mb-8 flex flex-wrap gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar"
            dir="rtl"
          >
            <FilterPill
              label="الكل"
              count={DOCTORS.length}
              active={activeSpecialty === "all"}
              onClick={() => setActiveSpecialty("all")}
            />
            {DOCTOR_SPECIALTIES.map((spec) => {
              const count = DOCTORS.filter((d) =>
                d.specialties.some((s) => s.includes(spec)),
              ).length;
              if (count === 0) return null;
              return (
                <FilterPill
                  key={spec}
                  label={spec}
                  count={count}
                  active={activeSpecialty === spec}
                  onClick={() => setActiveSpecialty(spec)}
                />
              );
            })}
          </div>

          {/* Cards */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            dir="rtl"
          >
            {filtered.map((doc, i) => (
              <DoctorCard key={doc.id} doc={doc} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16" dir="rtl">
              <p className="text-[#7b7c7d] dark:text-white/50 text-base">
                مفيش أطباء في هذا التصنيف حالياً
              </p>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function FilterPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-display font-semibold transition-all ${
        active
          ? "bg-[#1d5770] text-white shadow-md"
          : "bg-white dark:bg-[#162033] text-[#7b7c7d] dark:text-white/60 hover:bg-[#1d5770]/10 hover:text-[#1d5770] dark:hover:text-[#91b149] border border-gray-200 dark:border-[#1e3a5f]"
      }`}
    >
      <span>{label}</span>
      <span
        className={`text-[11px] px-1.5 py-0.5 rounded-full ${
          active
            ? "bg-white/20 text-white"
            : "bg-[#f5f8fa] dark:bg-[#0a151f] text-[#7b7c7d] dark:text-white/50"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function DoctorCard({ doc, index }: { doc: Doctor; index: number }) {
  const tel = doc.phone ? `tel:${doc.phone.replace(/\s/g, "")}` : null;
  const wa = doc.whatsapp
    ? `https://wa.me/${doc.whatsapp}?text=${encodeURIComponent(
        `أهلاً د. ${doc.name.replace(/^د\. /, "")}, جاء لي اسمك من موقع واحة وعايز استشارة.`,
      )}`
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.4 }}
      className="bg-white dark:bg-[#162033] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 dark:border-[#1e3a5f]"
    >
      {/* Header */}
      <div className="p-5 flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#91b149]/30">
          <Image src={doc.photo} alt={doc.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-base text-[#12394d] dark:text-white leading-tight">
            {doc.name}
          </h3>
          <p className="text-xs text-[#1d5770] dark:text-[#91b149] font-bold mt-0.5">
            {doc.title}
          </p>
          <p className="text-xs text-[#7b7c7d] dark:text-white/55 mt-1 leading-snug line-clamp-2">
            {doc.subtitle}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 pb-2 grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#f5f8fa] dark:bg-[#0a151f] rounded-xl py-2">
          <div className="text-base font-display font-black text-[#12394d] dark:text-white">
            {doc.experience}
          </div>
          <div className="text-[10px] text-[#7b7c7d] dark:text-white/50">
            سنة خبرة
          </div>
        </div>
        <div className="bg-[#f5f8fa] dark:bg-[#0a151f] rounded-xl py-2">
          <div className="text-xs font-bold text-[#12394d] dark:text-white pt-1">
            {doc.city}
          </div>
          <div className="text-[10px] text-[#7b7c7d] dark:text-white/50 mt-0.5">
            المدينة
          </div>
        </div>
        <div className="bg-[#f5f8fa] dark:bg-[#0a151f] rounded-xl py-2">
          <div className="text-xs font-bold text-[#12394d] dark:text-white pt-1">
            {doc.consultationFee || "—"}
          </div>
          <div className="text-[10px] text-[#7b7c7d] dark:text-white/50 mt-0.5">
            الكشف
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="px-5 py-3">
        <p className="text-[10px] font-bold text-[#7b7c7d] uppercase tracking-wider mb-2">
          بيعالج
        </p>
        <div className="flex flex-wrap gap-1.5">
          {doc.conditions.slice(0, 4).map((c) => (
            <span
              key={c}
              className="text-[11px] bg-[#1d5770]/8 dark:bg-[#91b149]/15 text-[#1d5770] dark:text-[#91b149] px-2 py-0.5 rounded-full"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Languages */}
      {doc.languages.length > 1 && (
        <div className="px-5 pb-2 flex items-center gap-2 text-[10px] text-[#7b7c7d] dark:text-white/50">
          <span>🌐</span>
          <span>
            {doc.languages.map((l) => LANG_LABEL[l] || l).join(" · ")}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="p-5 pt-3 border-t border-gray-100 dark:border-[#1e3a5f] grid grid-cols-2 gap-2">
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] hover:bg-[#1da851] text-white text-xs font-bold py-2.5 transition-colors no-underline"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>واتساب</span>
          </a>
        )}
        {tel && (
          <a
            href={tel}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#1d5770] hover:bg-[#174860] text-white text-xs font-bold py-2.5 transition-colors no-underline"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>اتصال</span>
          </a>
        )}
      </div>
    </motion.article>
  );
}
