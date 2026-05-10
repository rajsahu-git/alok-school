"use client";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

interface YoutubeVideo {
  _id: string;
  title: string;
  videoLink: string;
  createdAt: string;
}

interface VideosResponse { videos: YoutubeVideo[] }

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return match?.[1] ?? null;
}

export default function YoutubeManager() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [playing, setPlaying] = useState<YoutubeVideo | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<VideosResponse>("/gallery/video");
      setVideos(data.videos ?? []);
    } catch {
      setError("Failed to load videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleAdd = async () => {
    if (!title.trim()) { setError("Title is required."); return; }
    if (!videoLink.trim()) { setError("YouTube URL is required."); return; }
    if (!getYoutubeId(videoLink)) { setError("Invalid YouTube URL."); return; }
    setAdding(true);
    setError(null);
    setSuccess(null);
    try {
      await apiClient.post("/gallery/video", { title: title.trim(), videoLink: videoLink.trim() });
      setSuccess("Video added successfully!");
      setTitle("");
      setVideoLink("");
      await fetchVideos();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to add video.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    setDeletingId(id);
    setError(null);
    try {
      await apiClient.delete(`/gallery/video/${id}`);
      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch {
      setError("Failed to delete video.");
    } finally {
      setDeletingId(null);
    }
  };

  const previewId = getYoutubeId(videoLink);

  return (
    <>
      {/* ── Add Video Form ── */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <p className="text-sm font-medium text-foreground">Add YouTube Video</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Video title"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(null); setSuccess(null); }}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="https://youtube.com/watch?v=..."
            value={videoLink}
            onChange={(e) => { setVideoLink(e.target.value); setError(null); setSuccess(null); }}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !title.trim() || !videoLink.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {adding && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {adding ? "Adding…" : "Add Video"}
          </button>
        </div>

        {/* Live thumbnail preview */}
        {previewId && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary border border-border">
            <img
              src={`https://img.youtube.com/vi/${previewId}/mqdefault.jpg`}
              alt="preview"
              className="w-24 h-14 object-cover rounded-md flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Preview</p>
              <p className="text-sm font-medium text-foreground truncate">{title || "Untitled"}</p>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
      </div>

      {/* ── Videos Grid ── */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            Videos <span className="text-muted-foreground font-normal">({videos.length})</span>
          </p>
          <button onClick={fetchVideos} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg aspect-video bg-secondary animate-pulse" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <svg className="w-10 h-10 opacity-30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 15l5.19-3L10 9v6zm11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
            </svg>
            <p className="text-sm">No videos added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {videos.map((video) => {
              const videoId = getYoutubeId(video.videoLink);
              return (
                <div key={video._id} className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-secondary cursor-pointer">
                  {videoId && (
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => setPlaying(video)}
                      className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                    <p className="text-white text-xs text-center truncate w-full px-1">{video.title}</p>
                    <button
                      onClick={() => handleDelete(video._id)}
                      disabled={deletingId === video._id}
                      className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-xs rounded-lg transition-colors"
                    >
                      {deletingId === video._id
                        ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : "Delete"}
                    </button>
                  </div>
                  {/* YT badge */}
                  <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">YT</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Lightbox Player ── */}
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
          <div
            className="w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${getYoutubeId(playing.videoLink)}?autoplay=1`}
              title={playing.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
