"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Achievement {
  _id: string;
  image: { fileId: string; viewLink: string; directLink: string };
  createdAt: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const TrashIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
const UploadIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>;
const EditIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AchievementManager() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading]           = useState(true);
  const [uploading, setUploading]       = useState(false);
  const [deletingId, setDeletingId]     = useState<string | null>(null);
  const [updatingId, setUpdatingId]     = useState<string | null>(null);
  const [error, setError]               = useState<string | null>(null);
  const [success, setSuccess]           = useState<string | null>(null);

  // Upload state
  const [previews, setPreviews]         = useState<{ file: File; url: string }[]>([]);
  const fileRef   = useRef<HTMLInputElement>(null);
  const updateRef = useRef<HTMLInputElement>(null);

  // ── Fetch ──
  const fetchAchievements = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<{ achievements: Achievement[] }>("/achievement");
      setAchievements(data.achievements ?? []);
    } catch { setError("Failed to load achievements."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAchievements(); }, [fetchAchievements]);

  // ── Select files ──
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setPreviews(files.map((f) => ({ file: f, url: URL.createObjectURL(f) })));
    setError(null); setSuccess(null);
  };

  const removePreview = (i: number) => setPreviews((p) => p.filter((_, j) => j !== i));

  // ── Upload multiple ──
  const handleUpload = async () => {
    if (!previews.length) return;
    setUploading(true); setError(null); setSuccess(null);
    try {
      for (const { file } of previews) {
        const fd = new FormData();
        fd.append("image", file);
        await apiClient.post("/achievement", fd);
      }
      setSuccess(`${previews.length} achievement${previews.length > 1 ? "s" : ""} uploaded!`);
      setPreviews([]);
      if (fileRef.current) fileRef.current.value = "";
      await fetchAchievements();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally { setUploading(false); }
  };

  // ── Update (replace image) ──
  const handleUpdate = async (id: string, file: File) => {
    setUpdatingId(id); setError(null); setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      await apiClient.put(`/achievement/${id}`, fd);
      setSuccess("Achievement updated!");
      await fetchAchievements();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Update failed.");
    } finally { setUpdatingId(null); if (updateRef.current) updateRef.current.value = ""; }
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this achievement?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/achievement/${id}`);
      setAchievements((p) => p.filter((a) => a._id !== id));
    } catch { alert("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Achievement Manager</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Upload and manage achievement images</p>
      </div>

      {/* ── Upload Section ── */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <p className="text-sm font-semibold text-foreground">Upload Achievement Images</p>

        {/* Drop zone */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
        >
          <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-muted-foreground">Click to select images (multiple allowed)</p>
          <p className="text-xs text-muted-foreground">JPG, PNG, WEBP — max 100MB each</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFileChange} />

        {/* Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {previews.map((p, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-border aspect-square bg-secondary">
                <img src={p.url} alt={`preview-${i}`} className="w-full h-full object-cover" />
                <button onClick={() => removePreview(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {error   && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          onClick={handleUpload}
          disabled={!previews.length || uploading}
          className="self-start flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {uploading
            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <UploadIcon />}
          {uploading ? "Uploading…" : `Upload${previews.length > 1 ? ` (${previews.length})` : ""}`}
        </button>
      </div>

      {/* ── Grid ── */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-foreground">
            All Achievements <span className="text-sm font-normal text-muted-foreground">({achievements.length})</span>
          </p>
          <button onClick={fetchAchievements} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Refresh</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-xl aspect-square bg-secondary animate-pulse" />
            ))}
          </div>
        ) : achievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-muted-foreground">
            <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No achievements uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {achievements.map((a) => {
              const imgSrc = `/api/drive-image?id=${a.image.fileId}`;
              return (
                <div key={a._id} className="group relative rounded-xl overflow-hidden border border-border bg-secondary aspect-square">
                  <img src={imgSrc} alt="achievement" className="w-full h-full object-cover" />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <p className="text-white text-[10px] text-center">{fmt(a.createdAt)}</p>

                    {/* Update button */}
                    <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity ${updatingId === a._id ? "opacity-50 pointer-events-none" : ""}`}>
                      {updatingId === a._id
                        ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <EditIcon />}
                      Replace
                      <input type="file" accept="image/*" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpdate(a._id, f); }} />
                    </label>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(a._id)}
                      disabled={deletingId === a._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {deletingId === a._id
                        ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <TrashIcon />}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
