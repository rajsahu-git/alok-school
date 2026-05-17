"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AlumniImage { fileId: string; viewLink: string; directLink: string; }
interface Alumni {
  _id: string;
  name: string;
  batch: string;
  currentPosition: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  image: AlumniImage;
  createdAt: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const TrashIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>;
const EditIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>;
const PlusIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>;
const SaveIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" /></svg>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const imgUrl = (image?: AlumniImage) =>
  image?.fileId ? `/api/drive-image?id=${image.fileId}` : null;

const EMPTY_FORM = { name: "", batch: "", currentPosition: "", linkedin: "", github: "", twitter: "" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function AlumniManager() {
  const [alumni, setAlumni]         = useState<Alumni[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [showForm, setShowForm]     = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);

  const [form, setForm]             = useState(EMPTY_FORM);
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Fetch ──
  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<Alumni[]>("/alumni");
      setAlumni(Array.isArray(data) ? data : []);
    } catch { setError("Failed to load alumni."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAlumni(); }, [fetchAlumni]);

  // ── Form helpers ──
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const openAdd = () => { resetForm(); setShowForm(true); };

  const openEdit = (a: Alumni) => {
    setEditingId(a._id);
    setForm({ name: a.name, batch: a.batch, currentPosition: a.currentPosition, linkedin: a.linkedin ?? "", github: a.github ?? "", twitter: a.twitter ?? "" });
    setImagePreview(imgUrl(a.image));
    setImageFile(null);
    setShowForm(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── Save (create / update) ──
  const handleSave = async () => {
    if (!form.name.trim() || !form.batch.trim() || !form.currentPosition.trim()) {
      setError("Name, batch and current position are required."); return;
    }
    if (!editingId && !imageFile) { setError("Image is required."); return; }

    setSaving(true); setError(null); setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("batch", form.batch.trim());
      fd.append("currentPosition", form.currentPosition.trim());
      if (form.linkedin) fd.append("linkedin", form.linkedin);
      if (form.github)   fd.append("github",   form.github);
      if (form.twitter)  fd.append("twitter",  form.twitter);
      if (imageFile)     fd.append("image",    imageFile);

      if (editingId) {
        await apiClient.put(`/alumni/${editingId}`, fd);
        setSuccess("Alumni updated successfully!");
      } else {
        await apiClient.post("/alumni", fd);
        setSuccess("Alumni added successfully!");
      }
      resetForm();
      await fetchAlumni();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally { setSaving(false); }
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this alumni profile?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/alumni/${id}`);
      setAlumni((prev) => prev.filter((a) => a._id !== id));
    } catch { alert("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alumni Manager</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage alumni profiles</p>
        </div>
        {!showForm && (
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <PlusIcon /> Add Alumni
          </button>
        )}
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{editingId ? "Edit Alumni" : "Add New Alumni"}</p>
            <button onClick={resetForm} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          </div>

          {/* Image */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Profile Photo {!editingId && <span className="text-red-500">*</span>}</p>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-20 h-20 rounded-full object-cover border border-border" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-xs">No photo</div>
              )}
              <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2 rounded-lg border border-dashed border-border hover:border-primary text-sm text-muted-foreground hover:text-primary transition-all">
                {imagePreview ? "Change Photo" : "Upload Photo"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: "name",            label: "Full Name",        required: true,  placeholder: "e.g. Rahul Sharma" },
              { key: "batch",           label: "Batch Year",       required: true,  placeholder: "e.g. 2015-16" },
              { key: "currentPosition", label: "Current Position", required: true,  placeholder: "e.g. Software Engineer at Google" },
              { key: "linkedin",        label: "LinkedIn URL",     required: false, placeholder: "https://linkedin.com/in/..." },
              { key: "github",          label: "GitHub URL",       required: false, placeholder: "https://github.com/..." },
              { key: "twitter",         label: "Twitter URL",      required: false, placeholder: "https://twitter.com/..." },
            ].map(({ key, label, required, placeholder }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setError(null); }}
                  className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
          </div>

          {error   && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <SaveIcon />}
              {saving ? "Saving…" : editingId ? "Update Alumni" : "Add Alumni"}
            </button>
          </div>
        </div>
      )}

      {/* ── List ── */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-foreground">
            All Alumni <span className="text-sm font-normal text-muted-foreground">({alumni.length})</span>
          </p>
          <button onClick={fetchAlumni} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Refresh</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border p-4 flex flex-col items-center gap-3 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-secondary" />
                <div className="h-4 bg-secondary rounded w-3/4" />
                <div className="h-3 bg-secondary rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : alumni.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">No alumni profiles yet. Click "Add Alumni" to get started.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {alumni.map((a) => {
              const photo = imgUrl(a.image);
              return (
                <div key={a._id} className="rounded-xl border border-border bg-background flex flex-col items-center gap-3 p-4 text-center">
                  {photo ? (
                    <img src={photo} alt={a.name} className="w-20 h-20 rounded-full object-cover border-2 border-border" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-muted-foreground">
                      {a.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 w-full">
                    <p className="text-sm font-semibold text-foreground truncate">{a.name}</p>
                    <p className="text-xs text-primary font-medium">Batch {a.batch}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{a.currentPosition}</p>
                  </div>

                  {/* Social links */}
                  {(a.linkedin || a.github || a.twitter) && (
                    <div className="flex items-center gap-2">
                      {a.linkedin && (
                        <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                        </a>
                      )}
                      {a.github && (
                        <a href={a.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                        </a>
                      )}
                      {a.twitter && (
                        <a href={a.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 w-full mt-1">
                    <button
                      onClick={() => openEdit(a)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
                    >
                      <EditIcon /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a._id)}
                      disabled={deletingId === a._id}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      {deletingId === a._id
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
