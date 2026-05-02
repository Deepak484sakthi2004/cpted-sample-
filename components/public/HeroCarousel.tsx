"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/images/cpted-safe-space-banner.jpg",
    heading: "",
    headingHighlight: "",
    description: "",
    cta: [
      { label: "Our Services", href: "/services", variant: "primary" },
      { label: "Contact Us", href: "/contact", variant: "outline" },
    ],
  },
  {
    image: "/images/risk-assessment.jpg",
    heading: "CPTED Audit & Certification",
    headingHighlight: "",
    description:
      "We assess, advise, and certify spaces for individuals, institutions, and government bodies.",
    cta: [
      { label: "Learn More", href: "/services", variant: "primary" },
      { label: "Get Started Free", href: "/auth/signup", variant: "outline" },
    ],
  },
  {
    image: "/images/certification-hero.jpg",
    heading: "Earn Your",
    headingHighlight: "Professional",
    description: "Get industry-recognised CPTED certifications that validate your expertise in designing safer spaces and communities.",
    overlay: "bg-gradient-to-b from-black/60 via-transparent to-black/70",
    split: true,
    cta: [
      { label: "View Courses", href: "/courses", variant: "primary" },
      { label: "Get Started Free", href: "/auth/signup", variant: "outline" },
    ],
  },
  {
    image: "/images/iStock-5.jpg",
    heading: "Measure Your",
    headingHighlight: "Return on Investment",
    description: "CPTED delivers measurable value — reduced crime rates, lower insurance costs, and increased property values. Secure your space and your bottom line.",
    overlay: "bg-gradient-to-b from-black/60 via-black/40 to-black/70",
    split: true,
    cta: [
      { label: "Learn More", href: "/services#training", variant: "primary" },
      { label: "Free Consultation", href: "/contact", variant: "outline" },
    ],
  },
];

const DRAG_THRESHOLD = 50;
const AUTO_PLAY_INTERVAL = 8000;

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
    // Do NOT call setPointerCapture — it prevents click events reaching child Links
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
    isDragging.current = false; // always reset so subsequent clicks are never blocked
  };

  const handleArrowClick = (fn: () => void) => {
    fn();
    resetAutoPlay();
  };

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white min-h-screen flex flex-col justify-center px-4 py-16 select-none cursor-grab active:cursor-grabbing"
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
            className="object-cover object-[center_25%]"
            priority={current === 0}
            draggable={false}
            onError={() =>
              setImageError((prev) => ({ ...prev, [current]: true }))
            }
          />
        )}
        {/* neutral dark tint — lets photo breathe, ensures text contrast */}
        <div className={`absolute inset-0 ${"overlay" in slide && slide.overlay ? slide.overlay : "bg-gradient-to-t from-black/80 via-black/55 to-black/30"}`} />
      </div>

      {"split" in slide && slide.split ? (
        /* Split layout: heading top-quarter, description+CTA bottom-quarter */
        <>
          {(slide.heading || slide.headingHighlight) && (
            <div key={`${fadeKey}-top`} className="absolute top-8 left-0 right-0 px-4 text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                {slide.heading && <span className="text-white">{slide.heading}{" "}</span>}
                {slide.headingHighlight && <span className="text-amber-400">{slide.headingHighlight}</span>}
              </h1>
            </div>
          )}
          <div key={`${fadeKey}-bottom`} className="absolute bottom-16 left-0 right-0 px-4 text-center animate-fade-in">
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed drop-shadow">
              {slide.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {slide.cta.map(({ label, href, variant }) =>
                variant === "primary" ? (
                  <Link key={label} href={href} onClick={(e) => isDragging.current && e.preventDefault()}>
                    <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 shadow-lg shadow-amber-900/30 transition-all duration-200">
                      {label}
                    </Button>
                  </Link>
                ) : (
                  <Link key={label} href={href} onClick={(e) => isDragging.current && e.preventDefault()}>
                    <Button size="lg" variant="outline" className="border-2 border-white/70 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm font-semibold px-8 transition-all duration-200">
                      {label}
                    </Button>
                  </Link>
                )
              )}
            </div>
          </div>
        </>
      ) : (
        /* Default centered layout */
        <div key={fadeKey} className="relative mx-auto max-w-4xl text-center animate-fade-in">
          {(slide.heading || slide.headingHighlight) && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg text-center">
              {slide.heading && <span className="text-white">{slide.heading}{" "}</span>}
              {slide.headingHighlight && <span className="text-amber-400">{slide.headingHighlight}</span>}
            </h1>
          )}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow">
            {slide.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {slide.cta.map(({ label, href, variant }) =>
              variant === "primary" ? (
                <Link key={label} href={href} onClick={(e) => isDragging.current && e.preventDefault()}>
                  <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 shadow-lg shadow-amber-900/30 transition-all duration-200">
                    {label}
                  </Button>
                </Link>
              ) : (
                <Link key={label} href={href} onClick={(e) => isDragging.current && e.preventDefault()}>
                  <Button size="lg" variant="outline" className="border-2 border-white/70 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm font-semibold px-8 transition-all duration-200">
                    {label}
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>
      )}

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
