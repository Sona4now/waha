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
  const [canHover, setCanHover] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  if (!canHover) return null;
  return <CursorFollower />;
}
