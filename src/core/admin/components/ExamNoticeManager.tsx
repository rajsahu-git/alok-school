"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NoticePdf {
  fileId: string;
  fileName: string;
  viewLink: string;
  directLink: string;
}

interface NoticeImage {
  fileId: string;
  viewLink: string;
  directLink: string;
}

interface ExamNotice {
  _id: string;
  title: string;
  examDateFrom: string;
  examDateTo: string;
  description: string;
  pdf?: NoticePdf;
  image?: NoticeImage;
  createdAt: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const TrashIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
const EditIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const PlusIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const SaveIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>;
const PdfIcon    = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg>;
const ViewIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const toInput = (d: string) => new Date(d).toISOString().split("T")[0];
const EMPTY = { title: "", examDateFrom: "", examDateTo: "", description: "" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExamNoticeManager() {
  const [notices, setNotices]       = useState<ExamNotice[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [showForm, setShowForm]     = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);
  const [form, setForm]             = useState(EMPTY);
  const [attachType, setAttachType] = useState<"pdf" | "image">("pdf");
  const [pdfFile, setPdfFile]       = useState<File | null>(null);
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  // ── Fetch ──
  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<{ notices: ExamNotice[] }>("/exam-notice");
      setNotices(data.notices ?? []);
    } catch { setError("Failed to load notices."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  // ── Form helpers ──
  const resetForm = () => {
    setForm(EMPTY);
    setAttachType("pdf");
    setPdfFile(null);
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
    setError(null);
    setSuccess(null);
    if (fileRef.current) fileRef.current.value = "";
    if (imageRef.current) imageRef.current.value = "";
  };

  const openAdd = () => { resetForm(); setShowForm(true); };

  const openEdit = (n: ExamNotice) => {
    setEditingId(n._id);
    setForm({
      title: n.title,
      examDateFrom: toInput(n.examDateFrom),
      examDateTo: toInput(n.examDateTo),
      description: n.description,
    });
    setAttachType(n.image ? "image" : "pdf");
    setPdfFile(null);
    setImageFile(null);
    setShowForm(true);
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Save ──
  const handleSave = async () => {
    if (!form.title.trim() || !form.examDateFrom || !form.examDateTo ) {
      setError("All fields are required."); return;
    }
    if (!editingId && !pdfFile && !imageFile) { setError("A PDF or image attachment is required."); return; }

    setSaving(true); setError(null); setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("examDateFrom", form.examDateFrom);
      fd.append("examDateTo", form.examDateTo);
      fd.append("description", form.description.trim());
      if (attachType === "pdf" && pdfFile) fd.append("pdf", pdfFile);
      if (attachType === "image" && imageFile) fd.append("image", imageFile);

      if (editingId) {
        await apiClient.put(`/exam-notice/${editingId}`, fd);
        setSuccess("Notice updated successfully!");
      } else {
        await apiClient.post("/exam-notice", fd);
        setSuccess("Notice created successfully!");
      }
      resetForm();
      await fetchNotices();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally { setSaving(false); }
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this exam notice?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/exam-notice/${id}`);
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch { alert("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setError(null);
    },
  });

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Exam Notice Manager</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create and manage examination notices with PDF attachments</p>
        </div>
        {!showForm && (
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <PlusIcon /> Add Notice
          </button>
        )}
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{editingId ? "Edit Exam Notice" : "Add New Exam Notice"}</p>
            <button onClick={resetForm} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Notice Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g. Half Yearly Examination 2025-26"
              {...field("title")}
              className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Exam Date From <span className="text-red-500">*</span></label>
              <input
                type="date"
                {...field("examDateFrom")}
                className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Exam Date To <span className="text-red-500">*</span></label>
              <input
                type="date"
                {...field("examDateTo")}
                className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Description </label>
            <textarea
              rows={3}
              placeholder="Brief description about the examination..."
              {...field("description")}
              className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Attachment type toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Attachment {!editingId && <span className="text-red-500">*</span>}
              {editingId && <span className="text-muted-foreground"> (leave empty to keep existing)</span>}
            </label>
            <div className="flex gap-2">
              {(["pdf", "image"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setAttachType(t);
                    setPdfFile(null);
                    setImageFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                    if (imageRef.current) imageRef.current.value = "";
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    attachType === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary"
                  }`}
                >
                  {t === "pdf" ? "PDF" : "Image"}
                </button>
              ))}
            </div>
          </div>

          {/* PDF Upload */}
          {attachType === "pdf" && (
            <div className="flex flex-col gap-1.5">
              <div
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
              >
                <PdfIcon />
                <span className="text-sm text-muted-foreground">
                  {pdfFile ? pdfFile.name : "Click to upload PDF (max 10MB)"}
                </span>
                {pdfFile && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPdfFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="ml-auto text-xs text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="application/pdf" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setPdfFile(f); }} />
            </div>
          )}

          {/* Image Upload */}
          {attachType === "image" && (
            <div className="flex flex-col gap-1.5">
              <div
                onClick={() => imageRef.current?.click()}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-muted-foreground">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-muted-foreground">
                  {imageFile ? imageFile.name : "Click to upload image (JPG, PNG, WEBP — max 10MB)"}
                </span>
                {imageFile && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImageFile(null); if (imageRef.current) imageRef.current.value = ""; }}
                    className="ml-auto text-xs text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input ref={imageRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setImageFile(f); }} />
            </div>
          )}

          {error   && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <SaveIcon />}
              {saving ? "Saving…" : editingId ? "Update Notice" : "Create Notice"}
            </button>
          </div>
        </div>
      )}

      {/* ── Notices List ── */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-foreground">
            All Notices <span className="text-sm font-normal text-muted-foreground">({notices.length})</span>
          </p>
          <button onClick={fetchNotices} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Refresh</button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border p-4 animate-pulse flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 bg-secondary rounded w-1/2" />
                  <div className="h-3 bg-secondary rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-muted-foreground">
            <PdfIcon />
            <p className="text-sm">No exam notices yet. Click "Add Notice" to create one.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notices.map((n) => (
              <div key={n._id} className="rounded-xl border border-border bg-background p-4 flex flex-col sm:flex-row sm:items-center gap-4">

                {/* Attachment icon */}
                <div className={`w-12 h-12 rounded-lg border flex items-center justify-center flex-shrink-0 ${n.image ? "bg-blue-50 border-blue-100" : "bg-red-50 border-red-100"}`}>
                  {n.image ? (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-blue-500" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-red-500" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{n.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{n.description}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      📅 {fmt(n.examDateFrom)} — {fmt(n.examDateTo)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Added {fmt(n.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={n.pdf?.viewLink ?? (n.image ? `/api/drive-image?id=${n.image.fileId}` : "#")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-border text-foreground text-xs font-medium transition-colors"
                  >
                    <ViewIcon /> {n.image ? "View Image" : "View PDF"}
                  </a>
                  <button
                    onClick={() => openEdit(n)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
                  >
                    <EditIcon /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(n._id)}
                    disabled={deletingId === n._id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {deletingId === n._id
                      ? <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      : <TrashIcon />}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
