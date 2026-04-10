"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import Skeleton from "./Skeleton";

type Props = Omit<ImageProps, "onLoad"> & {
  wrapperClassName?: string;
};

/**
 * Next.js Image wrapper that shows a shimmer skeleton while loading.
 */
export default function ImageWithSkeleton({
  wrapperClassName = "",
  className = "",
  alt,
  ...imageProps
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${wrapperClassName}`}>
      {!loaded && (
        <Skeleton className="absolute inset-0 rounded-none z-0" />
      )}
      <Image
        {...imageProps}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
      />
    </div>
  );
}
