"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { apiClient } from "@/lib/apiClient";
import YoutubeManager from "./YoutubeManager";

// ─── Types ────────────────────────────────────────────────────────────────────

interface YoutubeVideo {
  _id: string;
  title: string;
  url: string;
  createdAt: string;
}

interface VideosResponse { videos: YoutubeVideo[] }

interface GalleryFolder {
  _id: string;
  name: string;
  driveId: string;
  viewLink: string;
  order: number;
  createdAt: string;
}

interface GalleryImage {
  fileId: string;
  fileName: string;
  directLink: string;
  createdTime: string;
}

interface FoldersResponse { folders: GalleryFolder[] }
interface ImagesResponse  { images: GalleryImage[]  }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUserId(): string | null {
  const token = localStorage.getItem("admin_token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.id ?? null;
  } catch { return null; }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FolderCard({
  folder,
  onOpen,
  onDelete,
  deleting,
}: {
  folder: GalleryFolder;
  onOpen: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <div
      onClick={onOpen}
      className="group relative flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-200"
    >
      {/* Folder icon */}
      <svg className="w-12 h-12 text-primary/70 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" />
      </svg>
      <p className="text-sm font-medium text-foreground text-center truncate w-full">{folder.name}</p>
      <p className="text-xs text-muted-foreground">{new Date(folder.createdAt).toLocaleDateString()}</p>
      {folder.order > 0 && <p className="text-xs text-primary font-medium">Order: {folder.order}</p>}

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        disabled={deleting}
        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-60"
      >
        {deleting
          ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          : "✕"}
      </button>
    </div>
  );
}

function ImageGrid({
  images,
  onDelete,
  deletingId,
}: {
  images: GalleryImage[];
  onDelete: (fileId: string) => void;
  deletingId: string | null;
}) {
  if (images.length === 0)
    return <p className="text-sm text-muted-foreground text-center py-10">No images in this folder yet.</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {images.map((img, i) => {
        const src = `https://lh3.googleusercontent.com/d/${img.fileId}`;
        return (
          <div key={img.fileId} className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-secondary">
            <Image src={src} alt={img.fileName} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              <p className="text-white text-xs text-center truncate w-full px-1">{img.fileName}</p>
              <button
                onClick={() => onDelete(img.fileId)}
                disabled={deletingId === img.fileId}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-xs font-medium rounded-lg transition-colors"
              >
                {deletingId === img.fileId
                  ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                }
                Delete
              </button>
            </div>
            <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">{i + 1}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GalleryManager() {
  // Folders
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [folderName, setFolderName] = useState("");
  const [folderOrder, setFolderOrder] = useState<number>(0);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);
  const [folderError, setFolderError] = useState<string | null>(null);
  const [folderSuccess, setFolderSuccess] = useState<string | null>(null);

  // Active folder (drill-in view)
  const [activeFolder, setActiveFolder] = useState<GalleryFolder | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageSuccess, setImageSuccess] = useState<string | null>(null);

  // Upload
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Fetch folders ────────────────────────────────────────────────────────────

  const fetchFolders = async () => {
    setFoldersLoading(true);
    try {
      const data = await apiClient.get<FoldersResponse>("/gallery/folders");
      setFolders(data.folders ?? []);
    } catch { setFolderError("Failed to load folders."); }
    finally { setFoldersLoading(false); }
  };

  useEffect(() => { fetchFolders(); }, []);

  // ── Fetch images in active folder ────────────────────────────────────────────

  const fetchImages = async (folder: GalleryFolder) => {
    setImagesLoading(true);
    setImageError(null);
    try {
      const data = await apiClient.get<ImagesResponse>(`/gallery/folder/${folder._id}/images`);
      setImages(data.images ?? []);
    } catch { setImageError("Failed to load images."); }
    finally { setImagesLoading(false); }
  };

  const openFolder = (folder: GalleryFolder) => {
    setActiveFolder(folder);
    setImages([]);
    setPreviews([]);
    setImageError(null);
    setImageSuccess(null);
    fetchImages(folder);
  };

  const closeFolder = () => {
    setActiveFolder(null);
    setImages([]);
    setPreviews([]);
    setImageError(null);
    setImageSuccess(null);
  };

  // ── Create folder ────────────────────────────────────────────────────────────

  const handleCreateFolder = async () => {
    if (!folderName.trim()) { setFolderError("Folder name is required."); return; }
    setCreatingFolder(true);
    setFolderError(null);
    setFolderSuccess(null);
    try {
      const userId = getUserId();
      await apiClient.post("/gallery/folder", { name: folderName.trim(), order: folderOrder, userId });
      setFolderSuccess(`Folder "${folderName.trim()}" created successfully!`);
      setFolderName("");
      setFolderOrder(0);
      await fetchFolders();
    } catch (e: unknown) {
      setFolderError(e instanceof Error ? e.message : "Failed to create folder.");
    } finally { setCreatingFolder(false); }
  };

  // ── Delete folder ────────────────────────────────────────────────────────────

  const handleDeleteFolder = async (id: string, name: string) => {
    if (!confirm(`Delete folder "${name}"? Images inside will remain on Google Drive.`)) return;
    setDeletingFolderId(id);
    setFolderError(null);
    try {
      await apiClient.delete(`/gallery/folder/${id}`);
      setFolders((prev) => prev.filter((f) => f._id !== id));
    } catch { setFolderError("Failed to delete folder."); }
    finally { setDeletingFolderId(null); }
  };

  // ── Upload images ────────────────────────────────────────────────────────────

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setPreviews(files.map((f) => ({ file: f, url: URL.createObjectURL(f) })));
    setImageError(null);
    setImageSuccess(null);
  };

  const removePreview = (index: number) => setPreviews((p) => p.filter((_, i) => i !== index));

  const handleUpload = async () => {
    if (!previews.length || !activeFolder) return;
    setUploading(true);
    setImageError(null);
    setImageSuccess(null);
    setUploadProgress({ done: 0, total: previews.length });
    try {
      const formData = new FormData();
      previews.forEach((p) => formData.append("images", p.file));
      await apiClient.post(`/gallery/folder/${activeFolder._id}/images`, formData);
      setUploadProgress({ done: previews.length, total: previews.length });
      setImageSuccess(`${previews.length} image${previews.length > 1 ? "s" : ""} uploaded!`);
      setPreviews([]);
      if (inputRef.current) inputRef.current.value = "";
      await fetchImages(activeFolder);
    } catch (e: unknown) {
      setImageError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  // ── Delete image ─────────────────────────────────────────────────────────────

  const handleDeleteImage = async (fileId: string) => {
    if (!confirm("Delete this image?")) return;
    setDeletingImageId(fileId);
    setImageError(null);
    try {
      await apiClient.delete(`/gallery/image/${fileId}`);
      setImages((prev) => prev.filter((img) => img.fileId !== fileId));
    } catch { setImageError("Failed to delete image."); }
    finally { setDeletingImageId(null); }
  };

  const [tab, setTab] = useState<"folders" | "videos">("folders");

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        {activeFolder && (
          <button
            onClick={closeFolder}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className={activeFolder ? "cursor-pointer hover:text-foreground transition-colors" : ""}
              onClick={activeFolder ? closeFolder : undefined}
            >
              Gallery
            </span>
            {activeFolder && (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-foreground font-medium">{activeFolder.name}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {activeFolder ? activeFolder.name : "Gallery Management"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeFolder ? "Upload and manage images in this folder" : "Organise gallery images into folders"}
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
      {!activeFolder && (
        <div className="flex gap-1 p-1 bg-secondary rounded-lg w-fit">
          <button
            onClick={() => setTab("folders")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === "folders" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Image Folders
          </button>
          <button
            onClick={() => setTab("videos")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === "videos" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            YouTube Videos
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FOLDER VIEW                                                           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {!activeFolder && tab === "folders" && (
        <>
          {/* Create folder */}
          <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">Create New Folder</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. Annual Day 2024"
                value={folderName}
                onChange={(e) => { setFolderName(e.target.value); setFolderError(null); setFolderSuccess(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Order"
                value={folderOrder}
                min={0}
                onChange={(e) => setFolderOrder(Number(e.target.value))}
                className="w-24 px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleCreateFolder}
                disabled={creatingFolder || !folderName.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                {creatingFolder && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {creatingFolder ? "Creating…" : "Create Folder"}
              </button>
            </div>
            {folderError && <p className="text-sm text-red-500">{folderError}</p>}
            {folderSuccess && <p className="text-sm text-green-600">{folderSuccess}</p>}
          </div>

          {/* Folder grid */}
          <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Folders <span className="text-muted-foreground font-normal">({folders.length})</span>
              </p>
              {!foldersLoading && folders.length > 0 && (
                <button onClick={fetchFolders} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Refresh
                </button>
              )}
            </div>

            {foldersLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="rounded-xl border border-border bg-secondary animate-pulse h-28" />
                ))}
              </div>
            ) : folders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3 text-muted-foreground">
                <svg className="w-12 h-12 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" />
                </svg>
                <p className="text-sm">No folders yet. Create one above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {folders.map((folder) => (
                  <FolderCard
                    key={folder._id}
                    folder={folder}
                    onOpen={() => openFolder(folder)}
                    onDelete={() => handleDeleteFolder(folder._id, folder.name)}
                    deleting={deletingFolderId === folder._id}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── YouTube Videos Tab ── */}
      {!activeFolder && tab === "videos" && <YoutubeManager />}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FOLDER DETAIL VIEW                                                    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeFolder && (
        <>
          {/* Upload area */}
          <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
            <p className="text-sm font-medium text-foreground">Upload Images to "{activeFolder.name}"</p>

            <div
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-200"
            >
              <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-muted-foreground">Click to select images</p>
              <p className="text-xs text-muted-foreground">JPG, PNG, WEBP — max 5MB each</p>
            </div>

            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onFileChange} />

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {previews.map((p, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-secondary">
                    <img src={p.url} alt={`preview-${i}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePreview(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >✕</button>
                    <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">{i + 1}</span>
                  </div>
                ))}
              </div>
            )}

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

            {imageError && <p className="text-sm text-red-500">{imageError}</p>}
            {imageSuccess && <p className="text-sm text-green-600">{imageSuccess}</p>}

            <button
              onClick={handleUpload}
              disabled={!previews.length || uploading}
              className="self-start flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {uploading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {uploading ? "Uploading…" : `Upload${previews.length > 1 ? ` (${previews.length})` : ""}`}
            </button>
          </div>

          {/* Images grid */}
          <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Images <span className="text-muted-foreground font-normal">({images.length})</span>
              </p>
              {!imagesLoading && (
                <button onClick={() => fetchImages(activeFolder)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Refresh
                </button>
              )}
            </div>

            {imagesLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => <div key={i} className="rounded-lg aspect-video bg-secondary animate-pulse" />)}
              </div>
            ) : (
              <ImageGrid images={images} onDelete={handleDeleteImage} deletingId={deletingImageId} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
