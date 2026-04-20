"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CursorFollower = dynamic(() => import("./CursorFollower"), {
  ssr: false,
});

/**
 * Loads the CursorFollower chunk ONLY on devices that can actually hover.
 * On phones/tablets the chunk is never downloaded — saves ~6 KB gzipped +
 * spares the client from parsing framer-motion spring logic it can't use.
 */
export default function DesktopOnlyCursor() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // hover:hover → has a precise pointer (mouse/trackpad)
    // Touch devices match (hover: none).
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  if (!canHover) return null;
  return <CursorFollower />;
}
