"use client";

import { useState } from "react";
import Image from "next/image";

interface PageBannerProps {
  src: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Full-width page header banner with optional background image.
 * Falls back to the dark gradient (current state) when the image is missing.
 */
export default function PageBanner({ src, children, className = "" }: PageBannerProps) {
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
        {/* dark overlay — always present so text is readable over any photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/92 to-gray-800/80" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
