"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ENVIRONMENT_CHAPTERS } from "@/data/environmentChapters";
import { useTranslations } from "@/components/site/LocaleProvider";
import { localizeChapter } from "@/lib/localize";

/**
 * Sticky chapter navigation for the narrative /destinations page.
 *
 * Desktop (md+): floating vertical rail on the LEFT edge (RTL "outside")
 * with one dot per chapter. Active chapter highlights, click to smooth-
 * scroll to that chapter section.
 *
 * Mobile: hidden — too cramped, the page already has a recently-viewed
 * rail and we don't want to compete for screen space.
 *
 * Hides itself when no chapters are visible (i.e. user is in filtered
 * grid mode) to avoid pointing at non-existent anchors.
 */
export default function ChapterNav() {
  const { locale } = useTranslations();
  const chapters = ENVIRONMENT_CHAPTERS.map((c) => localizeChapter(c, locale));
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function checkVisibility() {
      // Only show when we can find at least one chapter on the page.
      const firstChapter = document.getElementById(
        `chapter-${ENVIRONMENT_CHAPTERS[0].key}`,
      );
      setVisible(!!firstChapter);
    }
    checkVisibility();

    // IntersectionObserver picks up which chapter the user is currently
    // looking at. We use a triggering line ~40% from the top so the
    // active dot updates as the chapter "enters reading position".
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const key = id.replace(/^chapter-/, "");
            setActiveKey(key);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    const elements = ENVIRONMENT_CHAPTERS.map((c) =>
      document.getElementById(`chapter-${c.key}`),
    ).filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    // The DOM may rebuild when the user toggles filters → grid mode and
    // back. Recheck on a short interval so we re-attach.
    const recheckTimer = setInterval(checkVisibility, 1200);

    return () => {
      observer.disconnect();
      clearInterval(recheckTimer);
    };
  }, []);

  function jumpTo(key: string) {
    const el = document.getElementById(`chapter-${key}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          // Hidden on mobile / tablet; shown on lg+. Anchored bottom-left
          // so it doesn't collide with the WhatsApp FAB (bottom-right) or
          // the chat FAB (also right). Vertical orientation matches the
          // reading direction of a long-scroll page.
          className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-3 no-print"
          aria-label={locale === "en" ? "Journey chapters" : "فصول الرحلة"}
        >
          {chapters.map((c) => {
            const active = activeKey === c.key;
            return (
              <button
                key={c.key}
                onClick={() => jumpTo(c.key)}
                className="group relative flex items-center gap-3 cursor-pointer"
                aria-label={
                  locale === "en"
                    ? `Jump to chapter ${c.number}: ${c.name}`
                    : `اقفز للفصل ${c.number}: ${c.name}`
                }
                aria-current={active ? "true" : undefined}
              >
                {/* Dot — fills with chapter accent when active */}
                <span
                  className={`relative flex items-center justify-center transition-all ${
                    active
                      ? "w-3.5 h-3.5"
                      : "w-2.5 h-2.5 group-hover:w-3 group-hover:h-3"
                  }`}
                >
                  <span
                    className={`absolute inset-0 rounded-full transition-all ${
                      active ? "scale-100" : "scale-90"
                    }`}
                    style={{
                      backgroundColor: active ? c.accent : "rgba(125, 137, 145, 0.5)",
                      boxShadow: active
                        ? `0 0 0 4px ${c.accent}22`
                        : undefined,
                    }}
                  />
                </span>

                {/* Label — only visible when active or on hover */}
                <span
                  className={`hidden xl:inline-flex items-center gap-1.5 text-xs font-display font-bold whitespace-nowrap transition-all ${
                    active
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-1 group-hover:opacity-90 group-hover:translate-x-0"
                  }`}
                  style={{ color: active ? c.accent : "#7b7c7d" }}
                >
                  <span aria-hidden>{c.icon}</span>
                  <span>{c.name}</span>
                </span>
              </button>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
