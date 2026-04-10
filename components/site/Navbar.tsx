"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/home", label: "الرئيسية" },
  { href: "/destinations", label: "الأماكن" },
  { href: "/tours", label: "جولات 360°" },
  { href: "/map", label: "الخريطة" },
  { href: "/blog", label: "المدونة" },
  { href: "/compare", label: "المقارنة" },
  { href: "/ai-guide", label: "المساعد" },
  { href: "/about", label: "عن المشروع" },
  { href: "/contact", label: "الفريق" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white/80 backdrop-blur-sm"
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
            <span className="text-[#1d5770]">وا</span>
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
                    ? "text-[#1d5770] bg-[#e4edf2]"
                    : "text-[#12394d] hover:text-[#1d5770] hover:bg-[#e4edf2]"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className="flex md:hidden flex-col gap-[5px] p-2 cursor-pointer bg-transparent border-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`block w-[22px] h-[2px] bg-[#12394d] rounded-sm transition-all duration-300 ${
              menuOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-[#12394d] rounded-sm transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-[#12394d] rounded-sm transition-all duration-300 ${
              menuOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 right-0 bg-white border-b border-[#d0dde4] shadow-md p-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2.5 text-[0.925rem] font-semibold rounded-[10px] no-underline transition-all duration-300 ${
                pathname === l.href
                  ? "text-[#1d5770] bg-[#e4edf2]"
                  : "text-[#12394d]"
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
