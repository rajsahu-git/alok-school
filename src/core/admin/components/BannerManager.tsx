"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { apiClient } from "@/lib/apiClient";

type BannerMode = "single" | "multiple";

interface BannerImage {
  _id: string;
  fileId: string;
  fileName: string;
  viewLink: string;
  directLink: string;
  uploadedBy?: { name: string; email: string };
  createdAt?: string;
}

interface BannersResponse {
  count: number;
  banners: BannerImage[];
}

export default function BannerManager() {
  const [mode, setMode] = useState<BannerMode>("multiple");
  const [banners, setBanners] = useState<BannerImage[]>([]);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // GET /api/upload/banners
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<BannersResponse>("/upload/banners");
      setBanners(data.banners ?? []);
    } catch {
      setError("Failed to load banners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const selected = mode === "single" ? [files[0]] : files;
    setPreviews(selected.map((f) => ({ file: f, url: URL.createObjectURL(f) })));
    setError(null);
    setSuccess(null);
  };

  const removePreview = (index: number) => {
    setPreviews((p) => p.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!previews.length) return;
    setUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress({ done: 0, total: previews.length });

    try {
      const formData = new FormData();
      const token = localStorage.getItem("admin_token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload?.id) formData.append("userId", payload.id);
      }

      if (mode === "single") {
        formData.append("image", previews[0].file);
        await apiClient.post("/upload/single", formData);
        setUploadProgress({ done: 1, total: 1 });
      } else {
        previews.forEach((p) => formData.append("images", p.file));
        await apiClient.post("/upload/multiple", formData);
        setUploadProgress({ done: previews.length, total: previews.length });
      }

      setSuccess(
        previews.length === 1
          ? "Banner uploaded successfully!"
          : `${previews.length} banners uploaded successfully!`
      );
      setPreviews([]);
      if (inputRef.current) inputRef.current.value = "";
      await fetchBanners();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    setDeletingId(id);
    setError(null);
    try {
      await apiClient.delete(`/upload/banner/${id}`);
      setBanners((b) => b.filter((x) => x._id !== id));
    } catch {
      setError("Failed to delete banner.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleModeSwitch = (newMode: BannerMode) => {
    setMode(newMode);
    setPreviews([]);
    if (inputRef.current) inputRef.current.value = "";
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Banner Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage home page banner images</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-2 p-1 bg-secondary rounded-xl w-fit">
        {(["single", "multiple"] as BannerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeSwitch(m)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === m
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "single" ? "Single Image" : "Multiple Images"}
          </button>
        ))}
      </div>

      {/* Upload Area */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
        <p className="text-sm font-medium text-foreground">
          {mode === "single"
            ? "Upload one banner image"
            : "Upload multiple banner images (uploaded one by one)"}
        </p>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-200"
        >
          <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-muted-foreground">
            Click to select {mode === "single" ? "an image" : "images"}
          </p>
          <p className="text-xs text-muted-foreground">JPG, PNG, WEBP — max 5MB each</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={mode === "multiple"}
          className="hidden"
          onChange={onFileChange}
        />

        {/* Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {previews.map((p, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-secondary">
                <img src={p.url} alt={`preview-${i}`}  className="object-cover" />
                <button
                  onClick={() => removePreview(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >✕</button>
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Upload progress */}
        {uploadProgress && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Uploading…</span>
              <span>{uploadProgress.done} / {uploadProgress.total}</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(uploadProgress.done / uploadProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          onClick={handleUpload}
          disabled={!previews.length || uploading}
          className="self-start flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {uploading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {uploading
            ? uploadProgress
              ? `Uploading ${uploadProgress.done + 1} of ${uploadProgress.total}…`
              : "Uploading…"
            : `Upload${previews.length > 1 ? ` (${previews.length})` : ""}`}
        </button>
      </div>

      {/* Current Banners */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Current Banners{" "}
            <span className="text-muted-foreground font-normal text-sm">({banners.length})</span>
          </h2>
          {!loading && banners.length > 0 && (
            <button
              onClick={fetchBanners}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg aspect-video bg-secondary animate-pulse" />
            ))}
          </div>
        ) : banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
            <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No banners uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {banners.map((b, i) =>{
              const directLink =  `https://lh3.googleusercontent.com/d/${b.fileId}`
            return (
              <div
                key={b._id}
                className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-secondary"
              >
                <Image
                  src={directLink}
                  alt={b.fileName}
                  fill
                  onError={() => console.log("Image failed:", directLink)}
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <p className="text-white text-xs text-center truncate w-full px-1">{b.fileName}</p>
                  <button
                    onClick={() => handleDelete(b._id)}
                    disabled={deletingId === b._id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    {deletingId === b._id ? (
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                    Delete
                  </button>
                </div>
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                  {i + 1}
                </span>
              </div>
            )}
            )}
          </div>
        )}
      </div>
    </div>
  );
}
