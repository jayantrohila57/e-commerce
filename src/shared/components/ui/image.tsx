"use client";

import Image from "next/image";
import type { ComponentProps } from "react";
import * as React from "react";
import { cn } from "@/shared/utils/lib/utils";

interface BlurImageProps extends Omit<ComponentProps<typeof Image>, "src"> {
  src?: string | null;
  fallbackSrc?: string;
}

function normalizeSrc(value?: string | null) {
  if (!value) return null;

  const trimmed = value.trim();

  if (!trimmed) return null;

  // Absolute URL
  if (/^https?:\/\//.test(trimmed)) return trimmed;

  // Root-relative
  if (trimmed.startsWith("/")) return trimmed;

  // If it's something like "uploads/image.jpg"
  return `/${trimmed}`;
}

export function BlurImage({ className, alt, src, fallbackSrc = "/fallback.png", ...props }: BlurImageProps) {
  const safeInitialSrc = normalizeSrc(src) ?? fallbackSrc;

  const [currentSrc, setCurrentSrc] = React.useState(safeInitialSrc);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const normalized = normalizeSrc(src) ?? fallbackSrc;
    setCurrentSrc(normalized);
    setLoading(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
    setLoading(false);
  };

  return (
    <Image
      {...props}
      alt={alt}
      src={currentSrc}
      className={cn(
        className,
        "transition-all duration-300",
        isLoading ? "animate-shimmer blur-xs" : "blur-0",
        currentSrc === fallbackSrc && "bg-input/30",
      )}
      onLoad={() => setLoading(false)}
      onError={handleError}
    />
  );
}
