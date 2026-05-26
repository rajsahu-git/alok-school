"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";
import Image from "next/image";

interface ResultImage {
  fileId: string;
  viewLink: string;
  directLink: string;
}

interface Result {
  _id: string;
  studentName: string;
  sessionYear: string;
  studentClass: string;
  stream: string | null;
  percentage: number;
  image: ResultImage;
  createdAt: string;
}

const TrashIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>;
const EditIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>;
const PlusIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>;
const SaveIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" /></svg>;
const ImgIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>;

const EMPTY = { studentName: "", sessionYear: "", studentClass: "", stream: "", percentage: "" };

export default function ResultManager() {
  const [results, setResults]       = useState<Result[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [showForm, setShowForm]     = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);
  const [form, setForm]             = useState(EMPTY);
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [preview, setPreview]       = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const params = filterYear ? `?sessionYear=${filterYear}` : "";
      const data = await apiClient.get<{ results: Result[] }>(`/result${params}`);
      setResults(data.results ?? []);
    } catch { setError("Failed to load results."); }
    finally { setLoading(false); }
  }, [filterYear]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  const resetForm = () => {
    setForm(EMPTY);
    setImageFile(null);
    setPreview(null);
    setEditingId(null);
    setShowForm(false);
    setError(null);
    setSuccess(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const openAdd = () => { resetForm(); setShowForm(true); };

  const openEdit = (r: Result) => {
    setEditingId(r._id);
    setForm({ studentName: r.studentName, sessionYear: r.sessionYear, studentClass: r.studentClass, stream: r.stream ?? "", percentage: String(r.percentage) });
    setImageFile(null);
    setPreview(r.image.directLink);
    setShowForm(true);
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (!form.studentName.trim() || !form.sessionYear.trim() || !form.studentClass || !form.percentage) {
      setError("All fields are required."); return;
    }
    if (form.studentClass === "12th" && !form.stream) {
      setError("Stream is required for class 12th."); return;
    }
    if (!editingId && !imageFile) { setError("Student image is required."); return; }

    setSaving(true); setError(null); setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("studentName", form.studentName.trim());
      fd.append("sessionYear", form.sessionYear.trim());
      fd.append("studentClass", form.studentClass);
      fd.append("percentage", form.percentage);
      if (form.studentClass === "12th" && form.stream) fd.append("stream", form.stream);
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await apiClient.put(`/result/${editingId}`, fd);
        setSuccess("Result updated successfully!");
      } else {
        await apiClient.post("/result", fd);
        setSuccess("Result created successfully!");
      }
      resetForm();
      await fetchResults();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this result?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/result/${id}`);
      setResults((prev) => prev.filter((r) => r._id !== id));
    } catch { alert("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setError(null);
    },
  });

  const is12th = form.studentClass === "12th";

  const uniqueYears = [...new Set(results.map((r) => r.sessionYear))].sort().reverse();

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Result Manager</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage student results with images</p>
        </div>
        {!showForm && (
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <PlusIcon /> Add Result
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{editingId ? "Edit Result" : "Add New Result"}</p>
            <button onClick={resetForm} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Student Name <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. Rahul Sharma" {...field("studentName")}
                className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Session Year <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. 2024-25" {...field("sessionYear")}
                className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Class <span className="text-red-500">*</span></label>
              <select
                value={form.studentClass}
                onChange={(e) => { setForm((f) => ({ ...f, studentClass: e.target.value, stream: "" })); setError(null); }}
                className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select class</option>
                <option value="10th">10th</option>
                <option value="12th">12th</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-medium ${is12th ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
                Stream {is12th && <span className="text-red-500">*</span>}
              </label>
              <select
                value={form.stream}
                disabled={!is12th}
                onChange={(e) => { setForm((f) => ({ ...f, stream: e.target.value })); setError(null); }}
                className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="">Select stream</option>
                <option value="Arts">Arts</option>
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Percentage <span className="text-red-500">*</span></label>
              <input type="number" min="0" max="100" step="0.01" placeholder="e.g. 95.5" {...field("percentage")}
                className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Student Image {!editingId && <span className="text-red-500">*</span>}
              {editingId && <span className="text-muted-foreground"> (leave empty to keep existing)</span>}
            </label>
            <div className="flex items-start gap-4">
              <div
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all flex-1"
              >
                <ImgIcon />
                <span className="text-sm text-muted-foreground">
                  {imageFile ? imageFile.name : "Click to upload image"}
                </span>
                {imageFile && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); setImageFile(null); setPreview(editingId ? preview : null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="ml-auto text-xs text-red-500 hover:text-red-600">Remove</button>
                )}
              </div>
              {preview && (
                <div className="w-16 h-16 rounded-lg border border-border overflow-hidden flex-shrink-0 relative">
                  <Image src={preview} alt="preview" fill className="object-cover" unoptimized />
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setImageFile(f); setPreview(URL.createObjectURL(f)); }
              }} />
          </div>

          {error   && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <SaveIcon />}
              {saving ? "Saving…" : editingId ? "Update Result" : "Create Result"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-base font-semibold text-foreground">
            All Results <span className="text-sm font-normal text-muted-foreground">({results.length})</span>
          </p>
          <div className="flex items-center gap-3">
            {uniqueYears.length > 0 && (
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">All Years</option>
                {uniqueYears.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            )}
            <button onClick={fetchResults} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Refresh</button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border p-4 animate-pulse flex gap-4">
                <div className="w-14 h-14 rounded-lg bg-secondary flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 bg-secondary rounded w-1/3" />
                  <div className="h-3 bg-secondary rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-muted-foreground">
            <ImgIcon />
            <p className="text-sm">No results yet. Click &quot;Add Result&quot; to create one.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {results.map((r) => {
              const src = `/api/drive-image?id=${r.image.fileId}`;
              return(
              <div key={r._id} className="rounded-xl border border-border bg-background p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-14 h-14 rounded-lg border border-border overflow-hidden flex-shrink-0 relative">
                  <Image src={src} alt={r.studentName} fill className="object-cover" unoptimized />
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{r.studentName}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      {r.sessionYear}
                    </span>
                    <span className="inline-flex items-center text-xs bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                      Class {r.studentClass}
                    </span>
                    {r.stream && (
                      <span className="inline-flex items-center text-xs bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                        {r.stream}
                      </span>
                    )}
                    <span className="inline-flex items-center text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full font-medium">
                      {r.percentage}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={r.image.viewLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-border text-foreground text-xs font-medium transition-colors">
                    View
                  </a>
                  <button onClick={() => openEdit(r)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors">
                    <EditIcon /> Edit
                  </button>
                  <button onClick={() => handleDelete(r._id)} disabled={deletingId === r._id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-colors disabled:opacity-50">
                    {deletingId === r._id
                      ? <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      : <TrashIcon />}
                    Delete
                  </button>
                </div>
              </div>
            )}
            )}
          </div>
        )}
      </div>
    </div>
  );
}
