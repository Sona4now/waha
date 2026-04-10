"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/home", label: "الرئيسية" },
  { href: "/destinations", label: "الأماكن" },
  { href: "/tours", label: "جولات 360°" },
  { href: "/map", label: "الخريطة" },
  { href: "/blog", label: "المدونة" },
  { href: "/symptoms", label: "فاحص الأعراض" },
  { href: "/compare", label: "المقارنة" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "الفريق" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [platformKey, setPlatformKey] = useState("Ctrl");
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    // Detect Mac
    if (typeof navigator !== "undefined" && /Mac/.test(navigator.platform)) {
      setPlatformKey("⌘");
    }
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openSearch() {
    const w = window as unknown as { openSearch?: () => void };
    if (typeof w.openSearch === "function") w.openSearch();
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-[#0d1b2a]/95 backdrop-blur-md shadow-md"
          : "bg-white/80 dark:bg-[#0d1b2a]/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2.5 no-underline">
          <img
            src="/logo.png"
            alt="واحة"
            className="h-[54px] w-[54px] object-contain"
          />
          <div className="text-[1.7rem] font-black leading-none font-display">
            <span className="text-[#1d5770] dark:text-[#4a9dc0]">وا</span>
            <span className="text-[#91b149]">حة</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-0.5 list-none">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`block px-3.5 py-2 text-[0.925rem] font-semibold rounded-[10px] transition-all duration-300 no-underline ${
                  pathname === l.href
                    ? "text-[#1d5770] dark:text-[#91b149] bg-[#e4edf2] dark:bg-[#162033]"
                    : "text-[#12394d] dark:text-white/80 hover:text-[#1d5770] dark:hover:text-[#91b149] hover:bg-[#e4edf2] dark:hover:bg-[#162033]"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Search button */}
          <button
            onClick={openSearch}
            aria-label="بحث"
            title="بحث"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-[#7b7c7d] bg-[#f5f8fa] dark:bg-[#162033] hover:bg-[#e4edf2] dark:hover:bg-[#1e3a5f] rounded-full border border-[#d0dde4] dark:border-[#1e3a5f] transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="hidden md:inline">بحث</span>
            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-white dark:bg-[#0a151f] border border-[#d0dde4] dark:border-[#1e3a5f] rounded">
              {platformKey}K
            </kbd>
          </button>

          {/* Mobile search (icon only) */}
          <button
            onClick={openSearch}
            aria-label="بحث"
            className="sm:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#12394d] dark:text-white hover:bg-[#e4edf2] dark:hover:bg-[#162033] transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Hamburger */}
          <button
            className="flex md:hidden flex-col gap-[5px] p-2 cursor-pointer bg-transparent border-none ml-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="القائمة"
          >
            <span
              className={`block w-[22px] h-[2px] bg-[#12394d] dark:bg-white rounded-sm transition-all duration-300 ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-[22px] h-[2px] bg-[#12394d] dark:bg-white rounded-sm transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-[22px] h-[2px] bg-[#12394d] dark:bg-white rounded-sm transition-all duration-300 ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 right-0 bg-white dark:bg-[#0d1b2a] border-b border-[#d0dde4] dark:border-[#1e3a5f] shadow-md p-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2.5 text-[0.925rem] font-semibold rounded-[10px] no-underline transition-all duration-300 ${
                pathname === l.href
                  ? "text-[#1d5770] dark:text-[#91b149] bg-[#e4edf2] dark:bg-[#162033]"
                  : "text-[#12394d] dark:text-white/80"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
