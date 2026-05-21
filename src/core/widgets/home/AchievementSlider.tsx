"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface Achievement {
  _id: string;
  image: { fileId: string };
}

export default function AchievementSlider() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/achievement")
      .then((r) => r.json())
      .then((d) => setItems(d.achievements ?? []))
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  // Duplicate for seamless loop
  const slides = [...items, ...items];

  return (
    <section className="py-14 bg-secondary overflow-hidden">
      <div className="container mb-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary" style={{ fontFamily: "Georgia, serif" }}>
            Our Achievements
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="block w-12 h-px bg-accent" />
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            <span className="block w-12 h-px bg-accent" />
          </div>
          <p className="text-foreground/70 text-base mt-3 max-w-md mx-auto">
            Celebrating the milestones and accomplishments of our students.
          </p>
        </div>
      </div>

      {/* Slider */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Left fade */}
        <div className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--secondary), transparent)" }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--secondary), transparent)" }} />

        <div
          ref={trackRef}
          className="flex gap-4"
          style={{
            animation: `achievement-scroll 30s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
            width: "max-content",
          }}
        >
          {slides.map((item, i) => (
            <div
              key={`${item._id}-${i}`}
              className="flex-shrink-0 w-64 rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow duration-300 bg-card"
            >
              <img
                src={`/api/drive-image?id=${item.image.fileId}`}
                alt="Achievement"
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* View all */}
      <div className="flex justify-center mt-8">
        <Link
          href="/academic/achievement"
          className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 rounded-full text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
        >
          View All Achievements
        </Link>
      </div>

      <style>{`
        @keyframes achievement-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
