"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NoticeItem {
  _id: string;
  title: string;
  description?: string;
  link?: string;
  image?: { fileId: string; viewLink: string };
  pdf?: { fileId: string; fileName: string; viewLink: string };
  isActive: boolean;
  createdAt: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const TrashIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
const EditIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const PlusIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const SaveIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>;
const ViewIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const EMPTY = { title: "", description: "", link: "" };
const inputCls = "w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";
const labelCls = "text-xs font-medium text-muted-foreground mb-1.5 block";

// ─── Component ────────────────────────────────────────────────────────────────

export default function NoticeManager() {
  const [notices, setNotices]       = useState<NoticeItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [showForm, setShowForm]     = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);
  const [form, setForm]             = useState(EMPTY);
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile]       = useState<File | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const pdfRef   = useRef<HTMLInputElement>(null);

  // ── Fetch ──
  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<{ notices: NoticeItem[] }>("/notice");
      setNotices(data.notices ?? []);
    } catch { setError("Failed to load notices."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  // ── Form helpers ──
  const resetForm = () => {
    setForm(EMPTY); setImageFile(null); setImagePreview(null); setPdfFile(null);
    setEditingId(null); setShowForm(false); setError(null); setSuccess(null);
    if (imageRef.current) imageRef.current.value = "";
    if (pdfRef.current) pdfRef.current.value = "";
  };

  const openEdit = (n: NoticeItem) => {
    setEditingId(n._id);
    setForm({ title: n.title, description: n.description ?? "", link: n.link ?? "" });
    setImagePreview(n.image?.fileId ? `/api/drive-image?id=${n.image.fileId}` : null);
    setImageFile(null); setPdfFile(null);
    setShowForm(true); setError(null); setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value })); setError(null);
  };

  // ── Save ──
  const handleSave = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    setSaving(true); setError(null); setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      if (form.description) fd.append("description", form.description.trim());
      if (form.link)        fd.append("link", form.link.trim());
      if (imageFile)        fd.append("image", imageFile);
      if (pdfFile)          fd.append("pdf", pdfFile);

      if (editingId) {
        await apiClient.put(`/notice/${editingId}`, fd);
        setSuccess("Notice updated!");
      } else {
        await apiClient.post("/notice", fd);
        setSuccess("Notice created!");
      }
      resetForm(); await fetchNotices();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally { setSaving(false); }
  };

  // ── Toggle active ──
  const handleToggle = async (n: NoticeItem) => {
    setTogglingId(n._id);
    try {
      const fd = new FormData();
      fd.append("isActive", String(!n.isActive));
      await apiClient.put(`/notice/${n._id}`, fd);
      setNotices((p) => p.map((x) => x._id === n._id ? { ...x, isActive: !x.isActive } : x));
    } catch { alert("Failed to update."); }
    finally { setTogglingId(null); }
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/notice/${id}`);
      setNotices((p) => p.filter((x) => x._id !== id));
    } catch { alert("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  const activeCount = notices.filter((n) => n.isActive).length;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notice Manager</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create and manage school notices with image, PDF and links</p>
        </div>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <PlusIcon /> Add Notice
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-primary/10 text-primary p-4 flex flex-col gap-1">
          <span className="text-2xl font-black">{notices.length}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">Total</span>
        </div>
        <div className="rounded-xl bg-green-100 text-green-700 p-4 flex flex-col gap-1">
          <span className="text-2xl font-black">{activeCount}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">Active</span>
        </div>
        <div className="rounded-xl bg-secondary text-muted-foreground p-4 flex flex-col gap-1">
          <span className="text-2xl font-black">{notices.length - activeCount}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">Inactive</span>
        </div>
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{editingId ? "Edit Notice" : "Add New Notice"}</p>
            <button onClick={resetForm} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          </div>

          {/* Title */}
          <div>
            <label className={labelCls}>Title <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g. School Holiday Notice" value={form.title} onChange={set("title")} className={inputCls} />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={3} placeholder="Notice details..." value={form.description} onChange={set("description")} className={inputCls + " resize-none"} />
          </div>

          {/* Link */}
          <div>
            <label className={labelCls}>External Link (optional)</label>
            <input type="url" placeholder="https://..." value={form.link} onChange={set("link")} className={inputCls} />
          </div>

          {/* Image + PDF uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Image */}
            <div>
              <label className={labelCls}>Notice Image (optional)</label>
              <div onClick={() => imageRef.current?.click()}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all">
                {imagePreview
                  ? <img src={imagePreview} alt="preview" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                  : <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                }
                <span className="text-sm text-muted-foreground truncate">{imageFile ? imageFile.name : "Upload image"}</span>
                {imageFile && <button type="button" onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }} className="ml-auto text-xs text-red-500">Remove</button>}
              </div>
              <input ref={imageRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} />
            </div>

            {/* PDF */}
            <div>
              <label className={labelCls}>PDF Attachment (optional)</label>
              <div onClick={() => pdfRef.current?.click()}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all">
                <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                <span className="text-sm text-muted-foreground truncate">{pdfFile ? pdfFile.name : "Upload PDF"}</span>
                {pdfFile && <button type="button" onClick={(e) => { e.stopPropagation(); setPdfFile(null); if (pdfRef.current) pdfRef.current.value = ""; }} className="ml-auto text-xs text-red-500">Remove</button>}
              </div>
              <input ref={pdfRef} type="file" accept="application/pdf" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setPdfFile(f); }} />
            </div>
          </div>

          {error   && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <SaveIcon />}
              {saving ? "Saving…" : editingId ? "Update Notice" : "Create Notice"}
            </button>
          </div>
        </div>
      )}

      {/* ── List ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            All Notices <span className="text-muted-foreground font-normal">({notices.length})</span>
          </p>
          <button onClick={fetchNotices} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Refresh</button>
        </div>

        {loading ? (
          <div className="flex flex-col">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-secondary flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3.5 bg-secondary rounded w-1/3" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-muted-foreground">
            <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No notices yet. Click "Add Notice" to create one.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {notices.map((n) => {
              const imgSrc = n.image?.fileId ? `/api/drive-image?id=${n.image.fileId}` : null;
              return (
                <div key={n._id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors">
                  {/* Icon / Image */}
                  <div className="flex-shrink-0">
                    {imgSrc
                      ? <img src={imgSrc} alt={n.title} className="w-12 h-12 rounded-lg object-cover border border-border" />
                      : <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{n.title}</p>
                    {n.description && <p className="text-xs text-muted-foreground line-clamp-1">{n.description}</p>}
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{fmt(n.createdAt)}</span>
                      {n.pdf && (
                        <a href={n.pdf.viewLink} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                          <ViewIcon /> PDF
                        </a>
                      )}
                      {n.link && (
                        <a href={n.link} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-primary font-medium hover:underline truncate max-w-[120px]">
                          🔗 Link
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground hidden sm:block">Active</span>
                      <button onClick={() => handleToggle(n)} disabled={togglingId === n._id}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${n.isActive ? "bg-green-500" : "bg-border"} disabled:opacity-50`}>
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${n.isActive ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                    <button onClick={() => openEdit(n)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors">
                      <EditIcon /> Edit
                    </button>
                    <button onClick={() => handleDelete(n._id)} disabled={deletingId === n._id}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-colors disabled:opacity-50">
                      {deletingId === n._id ? <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <TrashIcon />}
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
