"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/images/iStock-2.jpg",
    heading: "Crime Prevention Through",
    headingHighlight: "Environmental Design",
    description:
      "CPTEDINDIA applies proactive methodologies and CPTED concepts to implement crime prevention strategies — combining people, space, and design for maximum safety.",
    cta: [
      { label: "Our Services", href: "/services", variant: "primary" },
      { label: "Contact Us", href: "/contact", variant: "outline" },
    ],
  },
  {
    image: "/images/iStock-3.jpg",
    heading: "CPTED Audit &",
    headingHighlight: "Certification",
    description:
      "Involve us right from the building design stage to get a holistic safety and security design. We assess, advise, and certify spaces for individuals, institutions, and government bodies.",
    cta: [
      { label: "Learn More", href: "/services", variant: "primary" },
      { label: "Get Started Free", href: "/auth/signup", variant: "outline" },
    ],
  },
  {
    image: "/images/iStock-5.jpg",
    heading: "Earn Your CPTED",
    headingHighlight: "Professional Certification",
    description:
      "Build credibility with CCA or CCP certifications. Industry-relevant credentials that boost visibility, demonstrate expertise, and give you a competitive edge in safety and security domains.",
    cta: [
      { label: "View Courses", href: "/courses", variant: "primary" },
      { label: "Get Started Free", href: "/auth/signup", variant: "outline" },
    ],
  },
];

const DRAG_THRESHOLD = 50;
const AUTO_PLAY_INTERVAL = 5000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setFadeKey((k) => k + 1);
  }, []);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    autoPlayRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [next]);

  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
  }, [next]);

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    dragStartX.current = e.clientX;
    isDragging.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (dragStartX.current === null) return;
    if (Math.abs(e.clientX - dragStartX.current) > 8) {
      isDragging.current = true;
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      if (delta < 0) next();
      else prev();
      resetAutoPlay();
    }
    dragStartX.current = null;
  };

  const handleArrowClick = (fn: () => void) => {
    fn();
    resetAutoPlay();
  };

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white min-h-[560px] flex flex-col justify-center px-4 py-16 select-none cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0">
        {!imageError[current] && (
          <Image
            key={current}
            src={slide.image}
            alt=""
            fill
            className="object-cover"
            priority={current === 0}
            draggable={false}
            onError={() =>
              setImageError((prev) => ({ ...prev, [current]: true }))
            }
          />
        )}
        {/* neutral dark tint — lets photo breathe, ensures text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      </div>

      {/* Slide content */}
      <div
        key={fadeKey}
        className="relative mx-auto max-w-4xl text-center animate-fade-in"
      >
        {/* Badge pill above heading */}
        <span className="inline-block mb-4 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-sm font-semibold tracking-wide uppercase">
          CPTEDINDIA
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
          <span className="text-white">{slide.heading}{" "}</span>
          <span className="text-amber-400">{slide.headingHighlight}</span>
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow">
          {slide.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {slide.cta.map(({ label, href, variant }) =>
            variant === "primary" ? (
              <Link
                key={label}
                href={href}
                onClick={(e) => isDragging.current && e.preventDefault()}
              >
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 shadow-lg shadow-amber-900/30 transition-all duration-200"
                >
                  {label}
                </Button>
              </Link>
            ) : (
              <Link
                key={label}
                href={href}
                onClick={(e) => isDragging.current && e.preventDefault()}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/70 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm font-semibold px-8 transition-all duration-200"
                >
                  {label}
                </Button>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Prev arrow */}
      <button
        onClick={() => handleArrowClick(prev)}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      {/* Next arrow */}
      <button
        onClick={() => handleArrowClick(next)}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              goTo(i);
              resetAutoPlay();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-amber-400" : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
