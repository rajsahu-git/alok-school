"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DisclosureFile {
  fileId: string;
  fileName: string;
  viewLink: string;
  directLink: string;
}

interface Disclosure {
  _id: string;
  title?: string;
  file: DisclosureFile;
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function MandatoryDisclosureManager() {
  const [disclosures, setDisclosures] = useState<Disclosure[]>([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [togglingId, setTogglingId]   = useState<string | null>(null);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [showForm, setShowForm]       = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [success, setSuccess]         = useState<string | null>(null);
  const [title, setTitle]             = useState("");
  const [file, setFile]               = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Fetch ──
  const fetchDisclosures = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<{ disclosures: Disclosure[] }>("/mandatory-disclosure");
      setDisclosures(data.disclosures ?? []);
    } catch { setError("Failed to load mandatory disclosures."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDisclosures(); }, [fetchDisclosures]);

  // ── Form helpers ──
  const resetForm = () => {
    setTitle(""); setFile(null); setEditingId(null);
    setShowForm(false); setError(null); setSuccess(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const openEdit = (d: Disclosure) => {
    setEditingId(d._id);
    setTitle(d.title ?? "");
    setFile(null);
    setShowForm(true); setError(null); setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Save ──
  const handleSave = async () => {
    if (!editingId && !file) { setError("PDF file is required."); return; }

    setSaving(true); setError(null); setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      if (file) fd.append("file", file);

      if (editingId) {
        await apiClient.put(`/mandatory-disclosure/${editingId}`, fd);
        setSuccess("Mandatory disclosure updated successfully!");
      } else {
        await apiClient.post("/mandatory-disclosure", fd);
        setSuccess("Mandatory disclosure uploaded successfully!");
      }
      resetForm(); await fetchDisclosures();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally { setSaving(false); }
  };

  // ── Toggle active ──
  const handleToggle = async (d: Disclosure) => {
    setTogglingId(d._id);
    try {
      const fd = new FormData();
      fd.append("isActive", String(!d.isActive));
      await apiClient.put(`/mandatory-disclosure/${d._id}`, fd);
      await fetchDisclosures();
    } catch { alert("Failed to update."); }
    finally { setTogglingId(null); }
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this mandatory disclosure?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/mandatory-disclosure/${id}`);
      setDisclosures((p) => p.filter((d) => d._id !== id));
    } catch { alert("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  const activeCount = disclosures.filter((d) => d.isActive).length;
  const inputCls = "px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mandatory Disclosure Manager</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Upload and manage mandatory disclosure PDFs. Only one can be active on the website at a time.</p>
        </div>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <PlusIcon /> Add Disclosure
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-primary/10 text-primary p-4 flex flex-col gap-1">
          <span className="text-2xl font-black">{disclosures.length}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">Total</span>
        </div>
        <div className="rounded-xl bg-green-100 text-green-700 p-4 flex flex-col gap-1">
          <span className="text-2xl font-black">{activeCount}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">Active</span>
        </div>
        <div className="rounded-xl bg-secondary text-muted-foreground p-4 flex flex-col gap-1">
          <span className="text-2xl font-black">{disclosures.length - activeCount}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">Inactive</span>
        </div>
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{editingId ? "Edit Mandatory Disclosure" : "Add New Mandatory Disclosure"}</p>
            <button onClick={resetForm} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Title</label>
              <input type="text" placeholder="e.g. Mandatory Disclosure 2026-27" value={title}
                onChange={(e) => { setTitle(e.target.value); setError(null); }} className={inputCls} />
            </div>

            {/* File Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                PDF File {!editingId && <span className="text-red-500">*</span>}
                {editingId && <span className="text-muted-foreground"> (leave empty to keep existing)</span>}
              </label>
              <div onClick={() => fileRef.current?.click()}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-muted-foreground flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span className="text-sm text-muted-foreground truncate">
                  {file ? file.name : "Click to upload PDF only (max 10MB)"}
                </span>
                {file && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="ml-auto text-xs text-red-500 hover:text-red-600 flex-shrink-0">Remove</button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="application/pdf" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
            </div>
          </div>

          {error   && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <SaveIcon />}
              {saving ? "Saving…" : editingId ? "Update Disclosure" : "Add Disclosure"}
            </button>
          </div>
        </div>
      )}

      {/* ── List ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            All Disclosures <span className="text-muted-foreground font-normal">({disclosures.length})</span>
          </p>
          <button onClick={fetchDisclosures} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Refresh</button>
        </div>

        {loading ? (
          <div className="flex flex-col">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-secondary flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3.5 bg-secondary rounded w-1/3" />
                  <div className="h-3 bg-secondary rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : disclosures.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No mandatory disclosures uploaded yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 text-left">
                    {["Title", "Status", "File", "Added On", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {disclosures.map((d, i) => (
                    <tr key={d._id} className={`border-t border-border hover:bg-secondary/30 transition-colors ${i % 2 === 0 ? "" : "bg-secondary/10"}`}>
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{d.title || "Untitled"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(d)}
                          disabled={togglingId === d._id}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${d.isActive ? "bg-green-500" : "bg-border"} disabled:opacity-50`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${d.isActive ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <a href={d.file.viewLink} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                          <ViewIcon /> View File
                        </a>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmt(d.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(d)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors">
                            <EditIcon /> Edit
                          </button>
                          <button onClick={() => handleDelete(d._id)} disabled={deletingId === d._id}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-colors disabled:opacity-50">
                            {deletingId === d._id
                              ? <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                              : <TrashIcon />}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col divide-y divide-border">
              {disclosures.map((d) => (
                <div key={d._id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{d.title || "Untitled"}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.isActive ? "bg-green-500 text-white" : "bg-secondary text-muted-foreground border border-border"}`}>
                      {d.isActive ? "● Active" : "○ Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Added {fmt(d.createdAt)}</p>
                  <div className="flex items-center gap-2">
                    <a href={d.file.viewLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-medium">
                      <ViewIcon /> View
                    </a>
                    <button onClick={() => handleToggle(d)} disabled={togglingId === d._id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-700 text-xs font-medium disabled:opacity-50">
                      {d.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => openEdit(d)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                      <EditIcon /> Edit
                    </button>
                    <button onClick={() => handleDelete(d._id)} disabled={deletingId === d._id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-medium disabled:opacity-50">
                      {deletingId === d._id ? <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <TrashIcon />}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
