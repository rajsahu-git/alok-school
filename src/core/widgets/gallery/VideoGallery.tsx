"use client";

import { useState } from "react";

interface Video {
  _id: string;
  title?: string;
  videoLink: string;
  createdAt: string;
}

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return match?.[1] ?? null;
}

export default function VideoGallery({ videos }: { videos: Video[] }) {
  const [playing, setPlaying] = useState<Video | null>(null);

  if (!videos.length) return null;

  return (
    <section className="bg-background py-16">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Videos</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Watch our latest videos and highlights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => {
            const videoId = getYoutubeId(video.videoLink);
            if (!videoId) return null;
            return (
              <button
                key={video._id}
                onClick={() => setPlaying(video)}
                className="group text-left rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                    alt={video.title ?? "Video"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* YT badge */}
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    YT
                  </span>
                </div>
                {/* Title */}
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                    {video.title ?? "Untitled"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(video.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {playing && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPlaying(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl leading-none transition-colors"
            onClick={() => setPlaying(null)}
          >
            &times;
          </button>
          <div className="w-full max-w-4xl flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
            <p className="text-white font-semibold text-lg truncate">{playing.title ?? "Video"}</p>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeId(playing.videoLink)}?autoplay=1`}
                title={playing.title ?? "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
