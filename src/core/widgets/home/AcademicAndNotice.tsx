"use client";

import { useEffect, useRef, useState } from "react";

interface Notice {
  _id: string;
  title: string;
  isActive: boolean;
  link?: string;
  pdf?: { viewLink: string };
}

const programs = [
  {
    label: "Pre-Primary",
    grades: "Nursery – KG",
    desc: "Playful learning environment fostering creativity and early development.",
    points: ["Sensory-based discovery", "Creative play & expression", "Early social skill building"],
  },
  {
    label: "Primary",
    grades: "Class I – V",
    desc: "A strong foundation that makes learning fun and engaging.",
    points: ["Interactive learning experiences", "Hands-on creative activities", "Growing communication & social skills"],
  },
  {
    label: "Secondary",
    grades: "Class VI – X",
    desc: "A focused environment that builds confidence and deeper understanding.",
    points: ["Concept-based learning", "Applied creativity & projects", "Personality & social development"],
  },
  {
    label: "Senior Secondary",
    grades: "Class XI – XII",
    desc: "A future-ready program that prepares students for higher studies.",
    points: ["Stream-aligned learning", "Advanced skill & creativity development", "Communication, leadership & social skills"],
  },
];

export function NoticePannel({ notices }: { notices: Notice[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const active = notices.filter((n) => n.isActive);

  useEffect(() => {
    const el = listRef.current;
    if (!el || active.length === 0) return;
    let animId: number;
    let pos = 0;

    const step = () => {
      if (!paused) {
        pos += 0.4;
        if (pos >= el.scrollHeight / 2) pos = 0;
        el.style.transform = `translateY(-${pos}px)`;
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [paused, active.length]);

  return (
    <div className="flex flex-col h-full">
      {/* Notice header */}
      <div className="bg-primary text-white text-center font-bold py-3 px-4 rounded-t-xl text-base tracking-wide">
        📢 Notice Board
      </div>

      {/* Scrolling list */}
      <div
        className="relative overflow-hidden flex-1 bg-white border border-t-0 border-gray-200 rounded-b-xl"
        style={{ minHeight: 320 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {active.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">No notices available.</p>
        ) : (
          <ul ref={listRef} className="absolute w-full will-change-transform">
            {[...active, ...active].map((notice, i) => {
              const href = notice.pdf?.viewLink ?? notice.link ?? "#";
              return (
                <li
                  key={`${notice._id}-${i}`}
                  className="flex items-start gap-2 px-4 py-3 border-b border-gray-100 last:border-0"
                >
                  <span className="text-primary font-bold mt-0.5 shrink-0 text-base">»</span>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-foreground/80 hover:text-primary hover:underline leading-snug"
                  >
                    {notice.title}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function AcademicAndNotice({ notices }: { notices: Notice[] }) {
  return (
    <section className="py-14 bg-secondary">
      <div className="container">
        {/* Section heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Academic <span className="text-primary">Programs</span>
          </h2>
          <p className="text-foreground/70 mt-2 text-base md:text-lg">
            A structured learning journey for every stage of growth
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT — Academic Programs */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {programs.map((p) => (
                <div
                  key={p.label}
                  className="bg-white rounded-xl border border-dashed border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Card header */}
                  <div className="bg-primary text-white text-center font-bold py-2.5 px-4 text-base">
                    {p.label}
                    <span className="block text-sm font-normal opacity-80">{p.grades}</span>
                  </div>

                  {/* Connector line */}
                  <div className="flex justify-center">
                    <div className="w-px h-4 bg-primary opacity-40" />
                  </div>

                  {/* Card body */}
                  <div className="px-5 pb-5 pt-1">
                    <p className="text-foreground/75 text-base mb-3 leading-relaxed">{p.desc}</p>
                    <ul className="space-y-1.5">
                      {p.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2 text-base text-foreground/80">
                          <span className="text-primary font-bold mt-0.5">✓</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Notice Board */}
          <div className="hidden lg:grid w-full lg:w-80 xl:w-96 shrink-0">
            <NoticePannel notices={notices} />
          </div>
        </div>
      </div>
    </section>
  );
}
