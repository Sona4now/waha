"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Paths that have their own heavy animations — skip the global transition
const SKIP_PATHS = ["/", "/gate"];

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (SKIP_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
