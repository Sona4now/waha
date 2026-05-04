"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SiteLayout from "@/components/site/SiteLayout";
import VideoCard from "@/components/site/VideoCard";
import { useTranslations } from "@/components/site/LocaleProvider";
import { VIDEOS, CATEGORY_LABELS, type VideoCategory } from "@/data/videos";

const CATEGORIES: VideoCategory[] = [
  "destination",
  "documentary",
  "report",
  "interview",
  "about",
  "podcast",
];

export default function VideosPage() {
  const { locale } = useTranslations();
  const isEn = locale === "en";
  const [activeCategory, setActiveCategory] = useState<VideoCategory | "all">("all");

  const filtered =
    activeCategory === "all"
      ? VIDEOS
      : VIDEOS.filter((v) => v.category === activeCategory);

  return (
    <SiteLayout>
      <div
        dir={isEn ? "ltr" : "rtl"}
        className="min-h-screen bg-[#070d15] pt-24 pb-20 px-4"
      >
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <p className="text-[#91b149] text-xs font-bold tracking-[0.3em] uppercase mb-3">
              {isEn ? "Waaha Media" : "واحة ميديا"}
            </p>
            <h1 className="text-white font-display font-black text-4xl md:text-5xl mb-4">
              {isEn ? "Videos" : "الفيديوهات"}
            </h1>
            <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
              {isEn
                ? "Documentaries, field trips, reports, and interviews about Egypt's healing destinations."
                : "وثائقيات، رحلات ميدانية، تقارير، ومقابلات عن وجهات الاستشفاء في مصر."}
            </p>
          </motion.div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border ${
                activeCategory === "all"
                  ? "bg-[#91b149] border-[#91b149] text-white"
                  : "bg-white/[0.05] border-white/10 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {isEn ? "All" : "الكل"} ({VIDEOS.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = VIDEOS.filter((v) => v.category === cat).length;
              if (!count) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border ${
                    activeCategory === cat
                      ? "bg-[#91b149] border-[#91b149] text-white"
                      : "bg-white/[0.05] border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {CATEGORY_LABELS[cat][isEn ? "en" : "ar"]} ({count})
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </motion.div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-white/30 text-sm">
              {isEn ? "No videos in this category yet." : "لا توجد فيديوهات في هذا التصنيف بعد."}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
