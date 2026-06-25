"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TCFile {
  fileId: string;
  fileName: string;
  viewLink: string;
  directLink: string;
}

interface TC {
  _id: string;
  scholarNumber: string;
  name: string;
  fatherName: string;
  dob: string;
  lastClass: string;
  tcFile: TCFile;
  createdAt: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const TrashIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
const EditIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const PlusIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const SaveIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>;
const ViewIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt     = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const toInput = (d: string) => new Date(d).toISOString().split("T")[0];
const EMPTY   = { scholarNumber: "", name: "", fatherName: "", dob: "", lastClass: "" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function TCManager() {
  const [tcs, setTcs]               = useState<TC[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [showForm, setShowForm]     = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [form, setForm]             = useState(EMPTY);
  const [tcFile, setTcFile]         = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Fetch ──
  const fetchTCs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<{ tcs: TC[] }>("/tc");
      setTcs(data.tcs ?? []);
    } catch { setError("Failed to load TCs."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTCs(); }, [fetchTCs]);

  // ── Form helpers ──
  const resetForm = () => {
    setForm(EMPTY); setTcFile(null); setEditingId(null);
    setShowForm(false); setError(null); setSuccess(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const openEdit = (tc: TC) => {
    setEditingId(tc._id);
    setForm({ scholarNumber: tc.scholarNumber, name: tc.name, fatherName: tc.fatherName, dob: toInput(tc.dob), lastClass: tc.lastClass });
    setTcFile(null);
    setShowForm(true); setError(null); setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value })); setError(null);
  };

  // ── Save ──
  const handleSave = async () => {
    if (!form.scholarNumber.trim() ) {
      setError("All fields are required."); return;
    }
    if (!editingId && !tcFile) { setError("TC file is required."); return; }

    setSaving(true); setError(null); setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("scholarNumber", form.scholarNumber.trim());
      fd.append("name", form.name.trim());
      fd.append("fatherName", form.fatherName.trim());
      fd.append("dob", form.dob);
      fd.append("lastClass", form.lastClass.trim());
      if (tcFile) fd.append("tcFile", tcFile);

      if (editingId) {
        await apiClient.put(`/tc/${editingId}`, fd);
        setSuccess("TC updated successfully!");
      } else {
        await apiClient.post("/tc", fd);
        setSuccess("TC added successfully!");
      }
      resetForm(); await fetchTCs();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally { setSaving(false); }
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this Transfer Certificate?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/tc/${id}`);
      setTcs((p) => p.filter((t) => t._id !== id));
    } catch { alert("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  const filtered = tcs.filter((t) => {
    const q = search.toLowerCase();
    return !q || t.scholarNumber.toLowerCase().includes(q) || t.name.toLowerCase().includes(q) || t.fatherName.toLowerCase().includes(q);
  });

  const inputCls = "px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transfer Certificate Manager</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Add, update and manage student transfer certificates</p>
        </div>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <PlusIcon /> Add TC
          </button>
        )}
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{editingId ? "Edit Transfer Certificate" : "Add New Transfer Certificate"}</p>
            <button onClick={resetForm} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { k: "scholarNumber", label: "Scholar Number *",  placeholder: "e.g. 2024001" },
              { k: "name",          label: "Student Name",    placeholder: "e.g. Rahul Sharma" },
              { k: "fatherName",    label: "Father's Name",   placeholder: "e.g. Suresh Sharma" },
              { k: "lastClass",     label: "Last Class",      placeholder: "e.g. Class X" },
            ].map(({ k, label, placeholder }) => (
              <div key={k} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">{label}</label>
                <input type="text" placeholder={placeholder} value={form[k as keyof typeof EMPTY]} onChange={set(k as keyof typeof EMPTY)} className={inputCls} />
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Date of Birth</label>
              <input type="date" value={form.dob} onChange={set("dob")} className={inputCls} />
            </div>

            {/* TC File Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                TC File (PDF only) {!editingId && <span className="text-red-500">*</span>}
                {editingId && <span className="text-muted-foreground"> (leave empty to keep existing)</span>}
              </label>
              <div onClick={() => fileRef.current?.click()}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-muted-foreground flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span className="text-sm text-muted-foreground truncate">
                  {tcFile ? tcFile.name : "Click to upload PDF only (max 10MB)"}
                </span>
                {tcFile && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); setTcFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="ml-auto text-xs text-red-500 hover:text-red-600 flex-shrink-0">Remove</button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="application/pdf" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setTcFile(f); }} />
            </div>
          </div>

          {error   && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <SaveIcon />}
              {saving ? "Saving…" : editingId ? "Update TC" : "Add TC"}
            </button>
          </div>
        </div>
      )}

      {/* ── List ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            All TCs <span className="text-muted-foreground font-normal">({filtered.length})</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search by name or scholar no..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary w-64" />
            </div>
            <button onClick={fetchTCs} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Refresh</button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-secondary flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3.5 bg-secondary rounded w-1/3" />
                  <div className="h-3 bg-secondary rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No transfer certificates found.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 text-left">
                    {["Scholar No.", "Student Name", "Father's Name", "DOB", "Last Class", "TC File", "Added On", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tc, i) => (
                    <tr key={tc._id} className={`border-t border-border hover:bg-secondary/30 transition-colors ${i % 2 === 0 ? "" : "bg-secondary/10"}`}>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-1 rounded font-semibold">{tc.scholarNumber}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{tc.name}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{tc.fatherName}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmt(tc.dob)}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{tc.lastClass}</td>
                      <td className="px-4 py-3">
                        <a href={tc.tcFile.viewLink} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                          <ViewIcon /> View File
                        </a>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmt(tc.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(tc)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors">
                            <EditIcon /> Edit
                          </button>
                          <button onClick={() => handleDelete(tc._id)} disabled={deletingId === tc._id}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-colors disabled:opacity-50">
                            {deletingId === tc._id
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
              {filtered.map((tc) => (
                <div key={tc._id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-1 rounded font-semibold">{tc.scholarNumber}</span>
                    <span className="text-xs text-muted-foreground">{fmt(tc.createdAt)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-foreground">{tc.name}</p>
                    <p className="text-xs text-muted-foreground">Father: {tc.fatherName}</p>
                    <p className="text-xs text-muted-foreground">DOB: {fmt(tc.dob)} · {tc.lastClass}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={tc.tcFile.viewLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-medium">
                      <ViewIcon /> View TC
                    </a>
                    <button onClick={() => openEdit(tc)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                      <EditIcon /> Edit
                    </button>
                    <button onClick={() => handleDelete(tc._id)} disabled={deletingId === tc._id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-medium disabled:opacity-50">
                      {deletingId === tc._id ? <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <TrashIcon />}
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
