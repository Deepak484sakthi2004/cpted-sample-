"use client";

import { useState } from "react";
import Image from "next/image";

interface PageBannerProps {
  src: string;
  children: React.ReactNode;
  className?: string;
  /** Tailwind class(es) for the overlay div — controls darkness/direction of the tint */
  overlayClass?: string;
}

/**
 * Full-width banner/section with optional background image.
 * Falls back to a dark gradient when the image is missing.
 * Use `overlayClass` to control overlay opacity/direction per section.
 */
export default function PageBanner({
  src,
  children,
  className = "",
  overlayClass = "bg-gradient-to-r from-gray-900/92 to-gray-800/80",
}: PageBannerProps) {
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0">
        {!error && (
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            priority
            onError={() => setError(true)}
          />
        )}
        {/* overlay — always present so text is readable over any photo */}
        <div className={`absolute inset-0 ${overlayClass}`} />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
