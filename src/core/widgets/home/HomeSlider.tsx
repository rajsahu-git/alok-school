"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

const slides = [
  "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/unnamed_1_zsknt1.webp",
  "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/IMG-20260122-WA0035_xvxdyb.jpg",
  "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/1000228002_702927b04699c8c9175768120d5645f5-27_2_2026_6_45_48_pm_skmcqn.jpg",
  "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/IMG-20260122-WA0021_ud2n5r.jpg",
  "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053861/1000227993_981863f509043ff2e07b9dc4970ad896-7_3_2026_10_18_06_pm_tbpnqc.jpg",
  "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053861/IMG-20260122-WA0020_kl1rqe.jpg",
  "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053862/1000271794_75b19fed4ec27a229461118b059b7e56-7_3_2026_10_55_52_pm_errw5c.png",
//   "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/local_image_1000225980_76e60fe4af4120cab864683d7c118f5a_dckdwn.jpg",
];

const AUTOPLAY_INTERVAL = 4000;

const HomeSlider = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback((nextFn: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(nextFn, AUTOPLAY_INTERVAL);
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  // Auto-play
  useEffect(() => {
    timerRef.current = setInterval(next, AUTOPLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next]);

  const handleNext = () => {
    next();
    resetTimer(next);
  };

  const handlePrev = () => {
    prev();
    resetTimer(prev);
  };

  const handleDot = (index: number) => {
    setCurrent(index);
    resetTimer(next);
  };

  return (
    <div className="relative w-full  h-[500px] md:h-[550px]  overflow-hidden bg-black select-none">
      {/* Slides — all rendered, opacity crossfade */}
      {slides.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: index === current ? 1 : 0, zIndex: index === current ? 10 : 1 }}
        >
          <Image
            src={src}
            alt={`Slide ${index + 1}`}
            fill
            // width={1200}
            // height={675}
            className="object-cover"
            priority={index === 0}
            style={{ objectFit: "cover" }}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </div>
      ))}

      {/* Prev Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDot(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === current ? "bg-white w-8" : "bg-white/50 hover:bg-white/80 w-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute bottom-6 right-6 z-20 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
        <span className="text-white text-sm font-medium">
          {current + 1} / {slides.length}
        </span>
      </div>
    </div>
  );
};

export default HomeSlider;
