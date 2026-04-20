"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Paths that ship their own heavy page-level animations.
const SKIP_PATHS = ["/", "/gate"];

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (SKIP_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  // Opacity-only transition so `position: fixed` children (BottomNav,
  // ChatWidget, Toasts, etc.) are positioned relative to the viewport,
  // not this wrapper. `filter` and `transform` both create a containing
  // block per CSS spec — even `filter: blur(0px)` does — so those would
  // break any fixed layout on every route. Opacity is safe.
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
