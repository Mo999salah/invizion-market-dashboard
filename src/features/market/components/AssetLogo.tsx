"use client";

import Image from "next/image";
import { useState } from "react";

type AssetLogoSize = "sm" | "md" | "lg";

type AssetLogoProps = Readonly<{
  src: string;
  symbol: string;
  size?: AssetLogoSize;
}>;

const SIZE_STYLES: Record<
  AssetLogoSize,
  Readonly<{ pixels: number; wrapper: string; fallback: string }>
> = {
  sm: {
    pixels: 28,
    wrapper: "size-7",
    fallback: "text-[0.5625rem]",
  },
  md: {
    pixels: 32,
    wrapper: "size-8",
    fallback: "text-[0.625rem]",
  },
  lg: {
    pixels: 44,
    wrapper: "size-11",
    fallback: "text-xs",
  },
};

export function AssetLogo({ src, symbol, size = "sm" }: AssetLogoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const sizeStyles = SIZE_STYLES[size];
  const shouldShowImage = src.length > 0 && failedSrc !== src;
  const fallbackLabel = symbol.trim().slice(0, 2).toLocaleUpperCase("en-US");

  return (
    <span
      aria-hidden="true"
      className={`${sizeStyles.wrapper} relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-ink ring-1 ring-line/80`}
    >
      {shouldShowImage ? (
        <Image
          src={src}
          alt=""
          width={sizeStyles.pixels}
          height={sizeStyles.pixels}
          sizes={`${sizeStyles.pixels}px`}
          onError={() => setFailedSrc(src)}
          className="size-full object-contain"
        />
      ) : (
        <span
          className={`font-mono font-semibold tracking-tight text-muted ${sizeStyles.fallback}`}
        >
          {fallbackLabel || "—"}
        </span>
      )}
    </span>
  );
}
