"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "./LocaleProvider";

// Translate Arabic category/caption labels coming from data into English.
const CATEGORY_EN: Record<string, string> = {
  الكل: "All",
  طبيعة: "Nature",
  الطبيعة: "Nature",
  البحر: "Sea",
  العلاج: "Therapy",
  البحيرات: "Lakes",
  العيون: "Springs",
  التراث: "Heritage",
  الجبال: "Mountains",
  الآثار: "Antiquities",
  الصحراء: "Desert",
};

const CAPTION_EN: Record<string, string> = {
  "البحر الأحمر — سفاجا": "The Red Sea — Safaga",
  "الشعاب المرجانية": "Coral reefs",
  "مياه سفاجا الزرقاء": "The blue waters of Safaga",
  "غروب الشمس في سفاجا": "Sunset in Safaga",
  "الرمال الذهبية": "Golden sands",
  "العلاج بالشمس": "Heliotherapy",
  "واحة سيوة": "Siwa Oasis",
  "بحيرات الملح": "Salt lakes",
  "النخيل والزيتون": "Palms and olives",
  "العيون الكبريتية": "Sulfur springs",
  "الصحراء الغربية": "Western Desert",
  "العمارة التقليدية": "Traditional architecture",
  "جبال سيناء الشاهقة": "Towering Sinai mountains",
  "وادي رم": "Wadi Rum",
  "سانت كاترين": "Saint Catherine",
  "البحر الأحمر من الجبل": "The Red Sea from the mountain",
  "صخور ملونة": "Colored rocks",
  "الصحراء الجبلية": "Mountain desert",
  "بحيرة قارون": "Lake Qarun",
  "الفيوم الخضراء": "Green Fayoum",
  "وادي الحيتان": "Wadi El Hitan",
  "شلالات وادي الريان": "Wadi El Rayan waterfalls",
  "غروب الصحراء": "Desert sunset",
  "قرية تونس": "Tunis Village",
  "الصحراء البيضاء": "The White Desert",
  "تكوينات صخرية": "Rock formations",
  "سماء الصحراء": "Desert sky",
  "العيون الحارة": "Hot springs",
  "واحة بين الصحاري": "Oasis between deserts",
  "جبل الكريستال": "Crystal Mountain",
};

function localizeLabel(label: string, isEn: boolean, dict: Record<string, string>) {
  if (!isEn) return label;
  return dict[label] ?? label;
}

export interface GalleryImage {
  url: string;
  caption?: string;
  category?: string;
}

interface Props {
  images: GalleryImage[];
  title?: string;
}

export default function Gallery({ images, title = "" }: Props) {
  const { locale } = useTranslations();
  const isEn = locale === "en";
  const ALL_LABEL = isEn ? "All" : "الكل";
  const NATURE_FALLBACK = isEn ? "Nature" : "طبيعة";
  const galleryTitle = title || (isEn ? "Image gallery" : "معرض الصور");
  const resolvedTitle = galleryTitle;
  const [activeCategory, setActiveCategory] = useState<string>(ALL_LABEL);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Re-sync the "All" label if the locale changes mid-mount.
  useEffect(() => {
    setActiveCategory(ALL_LABEL);
  }, [ALL_LABEL]);

  // Get unique categories
  const categories = Array.from(
    new Set([ALL_LABEL, ...images.map((i) => i.category || NATURE_FALLBACK)])
  );

  const filtered =
    activeCategory === ALL_LABEL
      ? images
      : images.filter((i) => (i.category || NATURE_FALLBACK) === activeCategory);

  const openLightbox = useCallback((idx: number) => {
    setLightboxIdx(idx);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIdx(null);
  }, []);

  const next = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % filtered.length);
  }, [lightboxIdx, filtered.length]);

  const prev = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx(
      lightboxIdx === 0 ? filtered.length - 1 : lightboxIdx - 1
    );
  }, [lightboxIdx, filtered.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIdx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") next(); // RTL: left = next
      if (e.key === "ArrowRight") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, next, prev, closeLightbox]);

  return (
    <>
      <div className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <div>
            <h3 className="text-xl font-bold font-display text-[#12394d] dark:text-white">
              {resolvedTitle}
            </h3>
            <p className="text-xs text-[#7b7c7d]">
              {isEn
                ? `${filtered.length} ${filtered.length === 1 ? "image" : "images"} — click any image to enlarge`
                : `${filtered.length} صورة — اضغط على أي صورة لتكبيرها`}
            </p>
          </div>

          {/* Category filters */}
          {categories.length > 2 && (
            <div className="flex gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? "bg-[#1d5770] dark:bg-[#91b149] text-white"
                      : "bg-[#f5f8fa] dark:bg-[#0a151f] text-[#7b7c7d] hover:text-[#1d5770] dark:hover:text-[#91b149]"
                  }`}
                >
                  {localizeLabel(cat, isEn, CATEGORY_EN)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((img, i) => (
            <motion.button
              key={`${img.url}-${i}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              onClick={() => openLightbox(i)}
              className={`group relative overflow-hidden rounded-xl bg-[#f5f8fa] dark:bg-[#0a151f] ${
                i % 5 === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
              }`}
            >
              <img
                src={img.url}
                alt={img.caption || ""}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {img.caption && (
                <div className={`absolute bottom-2 right-2 left-2 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isEn ? "text-left" : "text-right"}`}>
                  {localizeLabel(img.caption, isEn, CAPTION_EN)}
                </div>
              )}
              {/* Zoom icon */}
              <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1d5770"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h6v6" />
                  <path d="M10 14L21 3" />
                  <path d="M9 21H3v-6" />
                  <path d="M14 10L3 21" />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
              aria-label={isEn ? "Close" : "إغلاق"}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-5 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold">
              {lightboxIdx + 1} / {filtered.length}
            </div>

            {/* Prev (right arrow on RTL = prev) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
              aria-label={isEn ? "Previous" : "السابق"}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
              aria-label={isEn ? "Next" : "التالي"}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightboxIdx].url}
                alt={filtered[lightboxIdx].caption || ""}
                className="max-w-full max-h-[85vh] w-auto h-auto mx-auto rounded-xl shadow-2xl"
              />
              {filtered[lightboxIdx].caption && (
                <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/90 to-transparent p-6 rounded-b-xl">
                  <p className="text-white text-center font-semibold">
                    {localizeLabel(filtered[lightboxIdx].caption!, isEn, CAPTION_EN)}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Pre-built gallery sets for each destination
export function getGalleryForDestination(destId: string): GalleryImage[] {
  const galleries: Record<string, GalleryImage[]> = {
    safaga: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
        caption: "البحر الأحمر — سفاجا",
        category: "البحر",
      },
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
        caption: "الشعاب المرجانية",
        category: "البحر",
      },
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
        caption: "مياه سفاجا الزرقاء",
        category: "البحر",
      },
      {
        url: "https://images.unsplash.com/photo-1582738412039-00fb3d80d6a3?w=1200&q=80",
        caption: "غروب الشمس في سفاجا",
        category: "الطبيعة",
      },
      {
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
        caption: "الرمال الذهبية",
        category: "الطبيعة",
      },
      {
        url: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1200&q=80",
        caption: "العلاج بالشمس",
        category: "العلاج",
      },
    ],
    siwa: [
      {
        url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80",
        caption: "واحة سيوة",
        category: "الطبيعة",
      },
      {
        url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80",
        caption: "بحيرات الملح",
        category: "البحيرات",
      },
      {
        url: "https://images.unsplash.com/photo-1516638261787-07c68fdb2c81?w=1200&q=80",
        caption: "النخيل والزيتون",
        category: "الطبيعة",
      },
      {
        url: "https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=1200&q=80",
        caption: "العيون الكبريتية",
        category: "العيون",
      },
      {
        url: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?w=1200&q=80",
        caption: "الصحراء الغربية",
        category: "الطبيعة",
      },
      {
        url: "https://images.unsplash.com/photo-1502780402662-acc01917db4a?w=1200&q=80",
        caption: "العمارة التقليدية",
        category: "التراث",
      },
    ],
    sinai: [
      {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
        caption: "جبال سيناء الشاهقة",
        category: "الجبال",
      },
      {
        url: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?w=1200&q=80",
        caption: "وادي رم",
        category: "الطبيعة",
      },
      {
        url: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=1200&q=80",
        caption: "سانت كاترين",
        category: "التراث",
      },
      {
        url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80",
        caption: "البحر الأحمر من الجبل",
        category: "البحر",
      },
      {
        url: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&q=80",
        caption: "صخور ملونة",
        category: "الطبيعة",
      },
      {
        url: "https://images.unsplash.com/photo-1565608438257-fac3c27beb36?w=1200&q=80",
        caption: "الصحراء الجبلية",
        category: "الجبال",
      },
    ],
    fayoum: [
      {
        url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
        caption: "بحيرة قارون",
        category: "البحيرات",
      },
      {
        url: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=80",
        caption: "الفيوم الخضراء",
        category: "الطبيعة",
      },
      {
        url: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=1200&q=80",
        caption: "وادي الحيتان",
        category: "الآثار",
      },
      {
        url: "https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=1200&q=80",
        caption: "شلالات وادي الريان",
        category: "الطبيعة",
      },
      {
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80",
        caption: "غروب الصحراء",
        category: "الطبيعة",
      },
      {
        url: "https://images.unsplash.com/photo-1502780402662-acc01917db4a?w=1200&q=80",
        caption: "قرية تونس",
        category: "التراث",
      },
    ],
    bahariya: [
      {
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80",
        caption: "الصحراء البيضاء",
        category: "الصحراء",
      },
      {
        url: "https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=1200&q=80",
        caption: "تكوينات صخرية",
        category: "الصحراء",
      },
      {
        url: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?w=1200&q=80",
        caption: "سماء الصحراء",
        category: "الطبيعة",
      },
      {
        url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80",
        caption: "العيون الحارة",
        category: "العيون",
      },
      {
        url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80",
        caption: "واحة بين الصحاري",
        category: "الطبيعة",
      },
      {
        url: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&q=80",
        caption: "جبل الكريستال",
        category: "الصحراء",
      },
    ],
  };

  return galleries[destId] || galleries.safaga;
}
