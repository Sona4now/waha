"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export default function PageHero({ title, subtitle, breadcrumb }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Parallax background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -top-10 bg-gradient-to-br from-[#12394d] via-[#1a6b8a] to-[#1f8a6e]"
      />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 pt-[calc(72px+52px)] pb-14 text-white text-center"
      >
        <div className="max-w-[1280px] mx-auto px-6">
          {breadcrumb && (
            <div className="inline-flex items-center gap-2 text-[0.82rem] text-white/55 bg-white/10 px-3.5 py-1.5 rounded-full mb-4">
              {breadcrumb.map((b, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="opacity-40 text-[0.7rem]">›</span>}
                  {b.href ? (
                    <Link
                      href={b.href}
                      className="text-white/65 hover:text-white transition-colors no-underline"
                    >
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-white/80">{b.label}</span>
                  )}
                </span>
              ))}
            </div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-4xl font-bold text-white mb-3 font-display"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/75 text-[1.08rem] max-w-[560px] mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
