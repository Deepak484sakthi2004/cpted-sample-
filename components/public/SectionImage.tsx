"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

interface SectionImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Tailwind aspect-ratio class, e.g. "aspect-[4/3]" */
  aspect?: string;
}

/**
 * Rounded image panel for content sections.
 * Falls back to a styled placeholder when image is missing or fails.
 * Safe to use from both Server and Client Components.
 */
export default function SectionImage({
  src,
  alt,
  className = "",
  aspect = "aspect-[4/3]",
}: SectionImageProps) {
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${aspect} ${className}`}>
      {!error ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 gap-3">
          <ImageOff className="h-10 w-10 text-gray-300" />
          <p className="text-xs text-gray-400 font-medium">Image coming soon</p>
        </div>
      )}
    </div>
  );
}
