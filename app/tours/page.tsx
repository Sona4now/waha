"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { useTranslations } from "@/components/site/LocaleProvider";

interface Tour {
  id: string;
  name: string;
  subtitle: string;
  destination: "bahariya" | "siwa" | "shagie-farms";
  destinationName: string;
  icon: string;
  color: string;
  kuulaId: string;
  thumbnail: string;
  description: string;
}

const TOURS: Tour[] = [
  {
    id: "gara-cave",
    name: "كهف الجارة",
    subtitle: "تشكيلات صخرية ورسومات العصر الحجري",
    destination: "bahariya",
    destinationName: "الواحات البحرية",
    icon: "🕳️",
    color: "#92400e",
    kuulaId: "7MMg7",
    thumbnail:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    description: "استكشف كهف الجارة بتشكيلاته الصخرية الفريدة ورسوماته التاريخية في جولة افتراضية غامرة.",
  },
  {
    id: "oases-farms",
    name: "مزارع الواحات",
    subtitle: "الطبيعة الخضراء في قلب الصحراء",
    destination: "bahariya",
    destinationName: "الواحات البحرية",
    icon: "🌴",
    color: "#065f46",
    kuulaId: "7MM8W",
    thumbnail:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
    description: "جولة في مزارع الواحات الخضراء حيث النخيل والزيتون والحياة الصحراوية.",
  },
  {
    id: "moon-cave",
    name: "كهف القمر",
    subtitle: "تكوين طبيعي ساحر",
    destination: "bahariya",
    destinationName: "الواحات البحرية",
    icon: "🌙",
    color: "#1e293b",
    kuulaId: "7MM8T",
    thumbnail:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    description: "استكشف كهف القمر بتكويناته الصخرية الفريدة التي تبدو وكأنها من عالم آخر.",
  },
  {
    id: "black-desert",
    name: "الصحراء السوداء",
    subtitle: "تضاريس بركانية من البازلت والكوارتز",
    destination: "bahariya",
    destinationName: "الواحات البحرية",
    icon: "🌑",
    color: "#1e293b",
    kuulaId: "7MM8q",
    thumbnail:
      "https://images.unsplash.com/photo-1504198266287-1659872e6590?w=800&q=80",
    description: "انغمس في أجواء الصحراء السوداء البركانية — تجربة بصرية استثنائية تقلل التوتر وتعزز التركيز.",
  },
  {
    id: "white-desert",
    name: "الصحراء البيضاء",
    subtitle: "تكوينات طباشيرية منحوتة بفعل الرياح",
    destination: "bahariya",
    destinationName: "الواحات البحرية",
    icon: "🏜️",
    color: "#7b7c7d",
    kuulaId: "7MM8p",
    thumbnail:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80",
    description: "اكتشف الصحراء البيضاء بتكويناتها الكونية الفريدة — رحلة استشفائية للروح والعقل.",
  },
  {
    id: "siwa-palms",
    name: "مزارع النخيل — سيوة",
    subtitle: "300,000 نخلة في قلب الواحة",
    destination: "siwa",
    destinationName: "سيوة",
    icon: "🌴",
    color: "#065f46",
    kuulaId: "7MM6B",
    thumbnail:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    description: "تجول بين مزارع النخيل في واحة سيوة واستمتع بجمال الطبيعة الصحراوية.",
  },
  {
    id: "cleopatra-spring",
    name: "عين كليوباترا",
    subtitle: "الينبوع الأثري الأسطوري",
    destination: "siwa",
    destinationName: "سيوة",
    icon: "👑",
    color: "#7c3aed",
    kuulaId: "7MM6C",
    thumbnail:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    description: "زُر عين كليوباترا الشهيرة حيث كانت تستحم العروس قبل الفرح — ينبوع معدني وثقافي فريد.",
  },
  {
    id: "shali-fortress",
    name: "قلعة شالي",
    subtitle: "التراث والعمارة التقليدية",
    destination: "siwa",
    destinationName: "سيوة",
    icon: "🏰",
    color: "#b45309",
    kuulaId: "7MMcL",
    thumbnail:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80",
    description: "استكشف قلعة شالي المبنية من الكرشيف — شاهد على التراث الأمازيغي العريق في سيوة.",
  },
  {
    id: "shagie-farms-1",
    name: "مزرعة شجيع — الجولة الأولى",
    subtitle: "المدخل والمنظر العام للمزرعة",
    destination: "shagie-farms",
    destinationName: "مزارع شجيع",
    icon: "🌾",
    color: "#ca8a04",
    kuulaId: "7M8SP",
    thumbnail:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    description: "ادخل المزرعة من بوابتها واستكشف المنظر العام للأرض الخضراء وتنوّع المحاصيل.",
  },
  {
    id: "shagie-farms-2",
    name: "مزرعة شجيع — الجولة الثانية",
    subtitle: "بساتين المانجو والأشجار المثمرة",
    destination: "shagie-farms",
    destinationName: "مزارع شجيع",
    icon: "🥭",
    color: "#d97706",
    kuulaId: "7M8Sh",
    thumbnail:
      "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=800&q=80",
    description: "تجوّل بين بساتين المانجو السكري والأشجار المثمرة — أكثر من 10 أصناف زراعية عضوية.",
  },
  {
    id: "shagie-farms-3",
    name: "مزرعة شجيع — الجولة الثالثة",
    subtitle: "الأنشطة التفاعلية والحيوانات",
    destination: "shagie-farms",
    destinationName: "مزارع شجيع",
    icon: "🐎",
    color: "#92400e",
    kuulaId: "7M8QV",
    thumbnail:
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80",
    description: "اكتشف منطقة الأنشطة التفاعلية — حظائر الحيوانات، إسطبل الخيل، وتجربة الحياة الزراعية.",
  },
  {
    id: "shagie-farms-4",
    name: "مزرعة شجيع — الجولة الرابعة",
    subtitle: "القرية التراثية والإقامة",
    destination: "shagie-farms",
    destinationName: "مزارع شجيع",
    icon: "🏡",
    color: "#78350f",
    kuulaId: "7M8QX",
    thumbnail:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    description: "ادخل القرية التراثية بطابعها الريفي — البيوت التقليدية، خيم الإقامة، وأماكن الطهي البلدي.",
  },
];

/**
 * Build a Kuula embed URL. Params chosen to match the official "Embed HTML"
 * snippet from Kuula's share dialog with logo hidden:
 *   logo=-1   → no Kuula logo
 *   card=1    → show info card
 *   info=1    → show info button
 *   fs=1      → enable fullscreen
 *   vr=1      → enable VR mode
 *   zoom=1    → allow scroll-wheel zoom
 *   initload=0 → don't autoload (waits for user interaction)
 *   thumbs=-1 → thumbnails repositioned
 *   margin=30 → 30px breathing room
 */
function buildKuulaUrl(id: string) {
  const params =
    "logo=-1&card=1&info=1&fs=1&vr=1&zoom=1&initload=0&thumbs=-1&margin=30";
  return `https://kuula.co/share/collection/${id}?${params}`;
}

export default function ToursPage() {
  const { t } = useTranslations();
  const [activeFilter, setActiveFilter] = useState<
    "all" | "bahariya" | "siwa" | "shagie-farms"
  >("all");
  const [activeTour, setActiveTour] = useState<Tour | null>(null);

  const filteredTours =
    activeFilter === "all"
      ? TOURS
      : TOURS.filter((t) => t.destination === activeFilter);

  const filters = [
    { id: "all" as const, label: "جميع الجولات", count: TOURS.length },
    {
      id: "bahariya" as const,
      label: "الواحات البحرية",
      count: TOURS.filter((t) => t.destination === "bahariya").length,
    },
    {
      id: "siwa" as const,
      label: "سيوة",
      count: TOURS.filter((t) => t.destination === "siwa").length,
    },
    {
      id: "shagie-farms" as const,
      label: "مزارع شجيع",
      count: TOURS.filter((t) => t.destination === "shagie-farms").length,
    },
  ];

  return (
    <SiteLayout>
      <PageHero
        title={t("toursPage.title")}
        subtitle={t("toursPage.subtitle")}
        breadcrumb={[
          { label: t("nav.home"), href: "/home" },
          { label: t("nav.tours") },
        ]}
      />

      <section className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Info Banner */}
        <div className="mb-8 bg-gradient-to-l from-[#e4edf2] to-[#eef3e0] dark:from-[#162033] dark:to-[#162033] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-[#d0dde4] dark:border-[#1e3a5f]">
          <div className="w-12 h-12 rounded-full bg-[#1d5770] flex items-center justify-center flex-shrink-0">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold font-display text-[#12394d] dark:text-white mb-1">
              كيف تستخدم الجولات التفاعلية؟
            </h3>
            <p className="text-sm text-[#7b7c7d] dark:text-white/60 leading-relaxed">
              اسحب بالماوس أو إصبعك لتدوير المشهد · استخدم عجلة التمرير للتكبير
              · اضغط على أيقونة VR للتجربة الغامرة · اضغط على الشاشة الكاملة لتجربة سينمائية
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setActiveFilter(f.id);
                setActiveTour(null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeFilter === f.id
                  ? "bg-[#1d5770] text-white shadow-md"
                  : "bg-white dark:bg-[#162033] text-[#12394d] dark:text-white border border-[#d0dde4] dark:border-[#1e3a5f] hover:border-[#1d5770] hover:text-[#1d5770]"
              }`}
            >
              {f.label}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeFilter === f.id
                    ? "bg-white/20 text-white"
                    : "bg-[#f5f8fa] dark:bg-[#0a151f] text-[#7b7c7d] dark:text-white/50"
                }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Active Tour Viewer */}
        <AnimatePresence mode="wait">
          {activeTour && (
            <motion.div
              key={activeTour.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="bg-[#0d2a39] rounded-2xl overflow-hidden shadow-2xl border border-[#d0dde4] dark:border-[#1e3a5f]">
                {/* Header */}
                <div className="p-5 flex items-center justify-between gap-4 border-b border-white/10">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-3xl flex-shrink-0">
                      {activeTour.icon}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold font-display text-white text-lg truncate">
                        {activeTour.name}
                      </h3>
                      <p className="text-white/50 text-xs truncate">
                        {activeTour.subtitle} · {activeTour.destinationName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTour(null)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all flex-shrink-0"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="hidden sm:inline">إغلاق</span>
                  </button>
                </div>

                {/* Kuula iframe — responsive height. Fixed 640px broke mobile
                    (covered the full screen on iPhone SE). h-[60vh] keeps it
                    proportional to the device, capped at 640px on desktop. */}
                <div className="relative w-full h-[60vh] min-h-[400px] max-h-[640px] md:h-[640px]">
                  <iframe
                    src={buildKuulaUrl(activeTour.kuulaId)}
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen
                    allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={activeTour.name}
                  />
                </div>

                {/* Description footer */}
                <div className="p-5 bg-[#0a1f2b]">
                  <p className="text-white/70 text-sm leading-relaxed">
                    {activeTour.description}
                  </p>
                  <Link
                    href={`/destination/${activeTour.destination}`}
                    className="inline-flex items-center gap-1.5 mt-3 text-[#91b149] hover:text-[#a3c45a] text-sm font-semibold transition-colors no-underline"
                  >
                    اقرأ المزيد عن {activeTour.destinationName}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour, i) => (
            <motion.button
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              onClick={() => {
                setActiveTour(tour);
                setTimeout(() => {
                  document
                    .querySelector("iframe")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 100);
              }}
              className={`group text-right bg-white dark:bg-[#162033] rounded-2xl overflow-hidden shadow-sm border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                activeTour?.id === tour.id
                  ? "border-[#1d5770] ring-2 ring-[#1d5770]/20"
                  : "border-transparent hover:border-[#d0dde4] dark:hover:border-[#1e3a5f]"
              }`}
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={tour.thumbnail}
                  alt={tour.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* 360 Badge */}
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                    <span className="text-xs font-bold text-[#91b149] tracking-wider">
                      360°
                    </span>
                  </div>
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#1d5770"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Destination Tag */}
                <div className="absolute bottom-3 right-3">
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
                    style={{ background: `${tour.color}cc` }}
                  >
                    {tour.icon} {tour.destinationName}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3
                  className="font-bold font-display text-lg text-[#12394d] dark:text-white mb-1 group-hover:text-[#1d5770] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {tour.name}
                </h3>
                <p className="text-xs text-[#7b7c7d] dark:text-white/50 mb-3">{tour.subtitle}</p>
                <p className="text-sm text-[#12394d]/70 dark:text-white/60 leading-relaxed line-clamp-2">
                  {tour.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-[#7b7c7d] dark:text-white/50 flex items-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    تجربة غامرة
                  </span>
                  <span className="text-xs font-bold text-[#1d5770] flex items-center gap-1 group-hover:gap-2 transition-all">
                    استكشف
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Empty State */}
        {filteredTours.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#7b7c7d] dark:text-white/50 text-sm mb-3">
              لا توجد جولات متاحة حالياً
            </p>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
