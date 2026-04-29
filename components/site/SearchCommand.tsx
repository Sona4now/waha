"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { DESTINATIONS, BLOG_POSTS } from "@/data/siteData";
import { localizeBlogPost, localizeDestination } from "@/lib/localize";
import { useTranslations } from "./LocaleProvider";
import type { Locale } from "@/lib/i18n";

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  href: string;
  icon: string;
  keywords: string[];
};

const PAGE_LABELS = {
  ar: {
    home: "الصفحة الرئيسية",
    destinations: "جميع الوجهات",
    map: "الخريطة التفاعلية",
    tours: "جولات 360° الافتراضية",
    blog: "المدونة",
    about: "من نحن",
    contact: "الفريق والتواصل",
    page: "صفحة",
    destination: "وجهة",
    article: "مقالة",
    treatment: "علاج",
  },
  en: {
    home: "Home",
    destinations: "All destinations",
    map: "Interactive map",
    tours: "Virtual 360° tours",
    blog: "Blog",
    about: "About us",
    contact: "Team & contact",
    page: "Page",
    destination: "Destination",
    article: "Article",
    treatment: "Treatment",
  },
} as const;

const TREATMENTS_AR = [
  { name: "الصدفية", icon: "🩺", dest: "safaga" },
  { name: "الروماتويد", icon: "🦴", dest: "safaga" },
  { name: "آلام المفاصل", icon: "🦴", dest: "siwa" },
  { name: "الجهاز التنفسي", icon: "🫁", dest: "sinai" },
  { name: "الاسترخاء النفسي", icon: "🧘", dest: "fayoum" },
  { name: "التوتر", icon: "😌", dest: "bahariya" },
  { name: "الأمراض الجلدية", icon: "✨", dest: "safaga" },
  { name: "الجيوب الأنفية", icon: "🫁", dest: "siwa" },
];

const TREATMENTS_EN = [
  { name: "Psoriasis", icon: "🩺", dest: "safaga" },
  { name: "Rheumatoid arthritis", icon: "🦴", dest: "safaga" },
  { name: "Joint pain", icon: "🦴", dest: "siwa" },
  { name: "Respiratory health", icon: "🫁", dest: "sinai" },
  { name: "Mental relaxation", icon: "🧘", dest: "fayoum" },
  { name: "Stress relief", icon: "😌", dest: "bahariya" },
  { name: "Skin conditions", icon: "✨", dest: "safaga" },
  { name: "Sinus health", icon: "🫁", dest: "siwa" },
];

// Build the searchable index
function buildIndex(locale: Locale): SearchItem[] {
  const index: SearchItem[] = [];
  const L = PAGE_LABELS[locale === "en" ? "en" : "ar"];
  const isEn = locale === "en";

  // Destinations — show localized title/subtitle, but keep both AR + EN
  // values in the keyword pool so users can search in either language.
  DESTINATIONS.forEach((d) => {
    const dl = localizeDestination(d, locale);
    index.push({
      id: `dest-${d.id}`,
      title: isEn ? d.nameEn : d.name,
      subtitle: dl.description,
      category: L.destination,
      href: `/destination/${d.id}`,
      icon: d.envIcon,
      keywords: [
        d.name,
        d.nameEn,
        d.environment,
        dl.environment,
        ...d.treatments,
        ...(dl.treatments ?? []),
        d.description,
        dl.description,
      ],
    });
  });

  // Blog posts — link to the specific article, not the listing page.
  BLOG_POSTS.forEach((rawPost) => {
    const post = localizeBlogPost(rawPost, locale);
    index.push({
      id: `blog-${post.id}`,
      title: post.title,
      subtitle: post.excerpt,
      category: L.article,
      href: `/blog/${post.id}`,
      icon: "📖",
      keywords: [
        post.title,
        rawPost.title,
        post.excerpt,
        rawPost.excerpt,
        post.category,
      ],
    });
  });

  // Pages
  const pages = [
    {
      id: "home",
      title: L.home,
      href: "/home",
      icon: "🏠",
      keywords: ["home", "رئيسية"],
    },
    {
      id: "destinations",
      title: L.destinations,
      href: "/destinations",
      icon: "🗺️",
      keywords: ["destinations", "أماكن", "وجهات"],
    },
    {
      id: "map",
      title: L.map,
      href: "/map",
      icon: "📍",
      keywords: ["map", "خريطة"],
    },
    {
      id: "tours",
      title: L.tours,
      href: "/tours",
      icon: "🎥",
      keywords: ["tours", "360", "جولات", "افتراضية"],
    },
    {
      id: "blog",
      title: L.blog,
      href: "/blog",
      icon: "📰",
      keywords: ["blog", "مدونة", "مقالات"],
    },
    {
      id: "about",
      title: L.about,
      href: "/about",
      icon: "ℹ️",
      keywords: ["about", "عن المشروع", "من نحن"],
    },
    {
      id: "contact",
      title: L.contact,
      href: "/contact",
      icon: "👥",
      keywords: ["contact", "فريق", "تواصل"],
    },
  ];

  pages.forEach((p) => {
    index.push({
      id: `page-${p.id}`,
      title: p.title,
      subtitle: L.page,
      category: L.page,
      href: p.href,
      icon: p.icon,
      keywords: p.keywords,
    });
  });

  // Treatments / symptoms
  const treatments = isEn ? TREATMENTS_EN : TREATMENTS_AR;

  treatments.forEach((tr) => {
    index.push({
      id: `treatment-${tr.name}`,
      title: isEn ? `${tr.name} therapy` : `علاج ${tr.name}`,
      subtitle: isEn
        ? `Discover the best destination for ${tr.name}`
        : `اكتشف أفضل وجهة لعلاج ${tr.name}`,
      category: L.treatment,
      href: `/destination/${tr.dest}`,
      icon: tr.icon,
      keywords: [tr.name],
    });
  });

  return index;
}

function fuzzyMatch(query: string, item: SearchItem): number {
  if (!query) return 0;
  const q = query.trim().toLowerCase();
  const title = item.title.toLowerCase();
  const subtitle = item.subtitle.toLowerCase();
  const keywords = item.keywords.join(" ").toLowerCase();

  if (title === q) return 100;
  if (title.startsWith(q)) return 90;
  if (title.includes(q)) return 80;
  if (keywords.includes(q)) return 60;
  if (subtitle.includes(q)) return 40;

  // Character-by-character fuzzy matching
  let score = 0;
  let qIdx = 0;
  const combined = `${title} ${keywords}`;
  for (let i = 0; i < combined.length && qIdx < q.length; i++) {
    if (combined[i] === q[qIdx]) {
      score += 1;
      qIdx++;
    }
  }
  if (qIdx === q.length) return Math.min(score, 30);

  return 0;
}

export default function SearchCommand() {
  const router = useRouter();
  const { locale } = useTranslations();
  const isEn = locale === "en";
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(() => buildIndex(locale), [locale]);
  const destinationCategoryLabel = isEn ? "Destination" : "وجهة";

  const results = useMemo(() => {
    if (!query.trim()) {
      // Return default popular items
      return index.filter((i) => i.category === destinationCategoryLabel).slice(0, 5);
    }
    return index
      .map((item) => ({ item, score: fuzzyMatch(query, item) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((x) => x.item);
  }, [query, index, destinationCategoryLabel]);

  // Keyboard shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = results[selectedIdx];
        if (selected) {
          router.push(selected.href);
          setIsOpen(false);
          setQuery("");
          setSelectedIdx(0);
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, results, selectedIdx, router]);

  // Reset selection when query changes
  useEffect(() => {
    const id = setTimeout(() => setSelectedIdx(0), 0);
    return () => clearTimeout(id);
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      router.push(item.href);
      setIsOpen(false);
      setQuery("");
      setSelectedIdx(0);
    },
    [router]
  );

  // Expose open method globally
  useEffect(() => {
    (window as unknown as { openSearch?: () => void }).openSearch = () =>
      setIsOpen(true);
    return () => {
      delete (window as unknown as { openSearch?: () => void }).openSearch;
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            dir={isEn ? "ltr" : "rtl"}
            className="fixed top-[10vh] left-1/2 -translate-x-1/2 w-[92%] max-w-xl z-[111]"
          >
            <div className="bg-white dark:bg-[#0d1b2a] rounded-2xl shadow-2xl border border-[#d0dde4] dark:border-[#1e3a5f] overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#d0dde4] dark:border-[#1e3a5f]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#7b7c7d] flex-shrink-0"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    isEn
                      ? "Search destinations, therapies, articles..."
                      : "ابحث عن وجهة، علاج، مقالة..."
                  }
                  className="flex-1 bg-transparent outline-none text-[#12394d] dark:text-white placeholder:text-[#7b7c7d] text-sm"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#7b7c7d] bg-[#f5f8fa] dark:bg-[#162033] border border-[#d0dde4] dark:border-[#1e3a5f] rounded">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto">
                {results.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-[#7b7c7d] text-sm">
                      {isEn
                        ? <>No results for &ldquo;{query}&rdquo;</>
                        : <>لا توجد نتائج لـ &ldquo;{query}&rdquo;</>}
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    {!query && (
                      <p className="px-5 py-2 text-[10px] text-[#7b7c7d] font-semibold uppercase tracking-wider">
                        {isEn ? "Popular destinations" : "وجهات شائعة"}
                      </p>
                    )}
                    {results.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIdx(idx)}
                        className={`w-full flex items-center gap-3 px-5 py-3 ${isEn ? "text-left" : "text-right"} transition-colors ${
                          selectedIdx === idx
                            ? "bg-[#e4edf2] dark:bg-[#162033]"
                            : "hover:bg-[#f5f8fa] dark:hover:bg-[#162033]/50"
                        }`}
                      >
                        <span className="text-xl flex-shrink-0">
                          {item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-[#12394d] dark:text-white text-sm truncate">
                              {item.title}
                            </p>
                            <span className="text-[9px] text-[#7b7c7d] bg-[#f5f8fa] dark:bg-[#1e3a5f] px-1.5 py-0.5 rounded uppercase">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-[#7b7c7d] truncate">
                            {item.subtitle}
                          </p>
                        </div>
                        {selectedIdx === idx && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-[#1d5770] dark:text-[#91b149] flex-shrink-0"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#d0dde4] dark:border-[#1e3a5f] bg-[#f5f8fa] dark:bg-[#0a151f]">
                <div className="flex items-center gap-4 text-[10px] text-[#7b7c7d]">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#162033] border border-[#d0dde4] dark:border-[#1e3a5f] rounded">
                      ↑↓
                    </kbd>
                    {isEn ? "Navigate" : "تنقل"}
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#162033] border border-[#d0dde4] dark:border-[#1e3a5f] rounded">
                      ↵
                    </kbd>
                    {isEn ? "Select" : "اختيار"}
                  </span>
                </div>
                <p className="text-[10px] text-[#7b7c7d]">
                  {isEn ? "Powered by Waha 🌿" : "مدعوم بـ واحة 🌿"}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
