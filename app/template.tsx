"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Paths that have their own heavy animations / full-screen fixed layouts.
// The global transition uses `filter: blur()` which breaks `position:fixed`
// children (they get contained by the transformed parent instead of the
// viewport) — so any full-screen experience needs to opt out here.
const SKIP_PATHS = ["/", "/gate", "/therapy-room", "/map"];

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (SKIP_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
