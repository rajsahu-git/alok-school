"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const AUTOPLAY_INTERVAL = 4000;

const HomeSlider = ({ slides }: { slides: string[] }) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback((nextFn: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(nextFn, AUTOPLAY_INTERVAL);
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

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

  if (!slides.length) {
    return <div className="w-full h-[500px] md:h-[550px] bg-secondary animate-pulse" />;
  }

  return (
    <div className="relative h-[40rem] overflow-hidden bg-black select-none">
      {/* Slides — all rendered, opacity crossfade */}
      {slides.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: index === current ? 1 : 0, zIndex: index === current ? 10 : 1 }}
        >
          <img
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r " />
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
