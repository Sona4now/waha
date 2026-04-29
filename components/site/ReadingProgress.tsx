"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const HIDDEN_PATHS = ["/", "/gate", "/therapy-room", "/map"];

export default function ReadingProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (HIDDEN_PATHS.includes(pathname)) return;

    function updateProgress() {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, percent)));
      setVisible(scrollTop > 100);
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [pathname]);

  if (HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <div
      className={`fixed top-[72px] left-0 right-0 z-40 h-[3px] bg-[#d0dde4]/20 dark:bg-[#1e3a5f]/30 pointer-events-none transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-l from-[#91b149] via-[#1d5770] to-[#91b149] transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
