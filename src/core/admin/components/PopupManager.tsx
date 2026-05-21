"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

interface PopupItem {
  _id: string;
  image: { fileId: string; viewLink: string; directLink: string };
  isActive: boolean;
  createdAt: string;
}

const TrashIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
const UploadIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>;

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function PopupManager() {
  const [popups, setPopups]         = useState<PopupItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [uploading, setUploading]   = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);
  const [preview, setPreview]       = useState<string | null>(null);
  const [file, setFile]             = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchPopups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<{ popups: PopupItem[] }>("/popup");
      setPopups(data.popups ?? []);
    } catch { setError("Failed to load popups."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPopups(); }, [fetchPopups]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null); setSuccess(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true); setError(null); setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      await apiClient.post("/popup", fd);
      setSuccess("Popup uploaded successfully!");
      setFile(null); setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      await fetchPopups();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally { setUploading(false); }
  };

  const handleToggle = async (popup: PopupItem) => {
    setTogglingId(popup._id);
    try {
      const fd = new FormData();
      fd.append("isActive", String(!popup.isActive));
      await apiClient.put(`/popup/${popup._id}`, fd);
      setPopups((p) => p.map((x) => x._id === popup._id ? { ...x, isActive: !x.isActive } : x));
    } catch { alert("Failed to update."); }
    finally { setTogglingId(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this popup?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/popup/${id}`);
      setPopups((p) => p.filter((x) => x._id !== id));
    } catch { alert("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  const activeCount = popups.filter((p) => p.isActive).length;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Popup Manager</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Upload and manage website popup images. Toggle to show or hide on the main website.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-primary/10 text-primary p-4 flex flex-col gap-1">
          <span className="text-2xl font-black">{popups.length}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">Total Popups</span>
        </div>
        <div className="rounded-xl bg-green-100 text-green-700 p-4 flex flex-col gap-1">
          <span className="text-2xl font-black">{activeCount}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">Active</span>
        </div>
        <div className="rounded-xl bg-secondary text-muted-foreground p-4 flex flex-col gap-1">
          <span className="text-2xl font-black">{popups.length - activeCount}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">Inactive</span>
        </div>
      </div>

      {/* Upload */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <p className="text-sm font-semibold text-foreground">Upload New Popup</p>

        <div onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
          {preview ? (
            <img src={preview} alt="preview" className="max-h-48 rounded-xl object-contain" />
          ) : (
            <>
              <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-muted-foreground">Click to select popup image</p>
              <p className="text-xs text-muted-foreground">JPG, PNG, WEBP — max 5MB</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

        {preview && (
          <button type="button" onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
            className="self-start text-xs text-red-500 hover:text-red-600">Remove preview</button>
        )}

        {error   && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button onClick={handleUpload} disabled={!file || uploading}
          className="self-start flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
          {uploading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <UploadIcon />}
          {uploading ? "Uploading…" : "Upload Popup"}
        </button>
      </div>

      {/* List */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-foreground">
            All Popups <span className="text-sm font-normal text-muted-foreground">({popups.length})</span>
          </p>
          <button onClick={fetchPopups} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Refresh</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="rounded-xl aspect-video bg-secondary animate-pulse" />)}
          </div>
        ) : popups.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">No popups uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popups.map((popup) => {
              const imgSrc = `/api/drive-image?id=${popup.image.fileId}`;
              return (
                <div key={popup._id} className="rounded-xl border border-border bg-background overflow-hidden flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-secondary">
                    <img src={imgSrc} alt="popup" className="w-full h-full object-cover" />
                    {/* Active badge */}
                    <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${popup.isActive ? "bg-green-500 text-white" : "bg-secondary text-muted-foreground border border-border"}`}>
                      {popup.isActive ? "● Active" : "○ Inactive"}
                    </span>
                  </div>

                  {/* Info + actions */}
                  <div className="p-3 flex flex-col gap-3">
                    <p className="text-xs text-muted-foreground">Added {fmt(popup.createdAt)}</p>

                    {/* Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">Show on website</span>
                      <button
                        onClick={() => handleToggle(popup)}
                        disabled={togglingId === popup._id}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${popup.isActive ? "bg-green-500" : "bg-border"} disabled:opacity-50`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${popup.isActive ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>

                    {/* Delete */}
                    <button onClick={() => handleDelete(popup._id)} disabled={deletingId === popup._id}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-colors disabled:opacity-50">
                      {deletingId === popup._id
                        ? <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
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
