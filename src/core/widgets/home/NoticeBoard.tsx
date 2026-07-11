"use client";

import { useEffect, useRef, useState } from "react";

interface Notice {
  _id: string;
  title: string;
  isActive: boolean;
  link?: string;
  pdf?: { viewLink: string };
  image?: { fileId: string; viewLink: string };
}

export default function NoticeBoard({ notices }: { notices: Notice[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let animId: number;
    let pos = 0;

    const step = () => {
      if (!paused) {
        pos += 0.5;
        if (pos >= el.scrollHeight / 2) pos = 0;
        el.style.transform = `translateY(-${pos}px)`;
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [paused]);

  const active = notices.filter((n) => n.isActive);

  return (
    <section className="bg-white border-b">
      <div className="container py-4">
        <div className="flex gap-0 border border-gray-200 rounded overflow-hidden shadow-sm">
          {/* Label */}
          <div className="bg-primary text-white font-bold text-sm px-4 flex items-center justify-center min-w-[120px] shrink-0">
            📢 Notices
          </div>

          {/* Scrolling area */}
          <div
            className="relative overflow-hidden h-28 flex-1 bg-white"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <ul ref={listRef} className="absolute w-full will-change-transform">
              {[...active, ...active].map((notice, i) => {
                const href = notice.pdf?.viewLink
                  ?? (notice.image ? `/api/drive-image?id=${notice.image.fileId}` : undefined)
                  ?? notice.link
                  ?? "#";
                return (
                  <li key={`${notice._id}-${i}`} className="flex items-start gap-2 px-4 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-accent font-bold mt-0.5 shrink-0">»</span>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-700 hover:text-primary hover:underline leading-snug"
                    >
                      {notice.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
