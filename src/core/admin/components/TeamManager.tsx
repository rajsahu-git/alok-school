"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamImage { fileId: string; viewLink: string; directLink: string; }
interface TeamMember {
  _id: string;
  name: string;
  category: string;
  designation: string;
  education: string;
  experience: string;
  bio?: string;
  email?: string;
  phone?: string;
  order: number;
  isActive: boolean;
  image: TeamImage;
  createdAt: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const TrashIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
const EditIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const PlusIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const SaveIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>;

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ["teaching", "coordinators", "staff"];
const EMPTY = { name: "", category: "teaching", designation: "", education: "", experience: "", bio: "", email: "", phone: "", order: "0", isActive: "true" };
const imgUrl = (image?: TeamImage) => image?.fileId ? `/api/drive-image?id=${image.fileId}` : null;

// ─── Component ────────────────────────────────────────────────────────────────

export default function TeamManager() {
  const [members, setMembers]       = useState<TeamMember[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [showForm, setShowForm]     = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);
  const [filterCat, setFilterCat]   = useState("All");
  const [form, setForm]             = useState(EMPTY);
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Fetch ──
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<{ members: TeamMember[] }>("/team");
      setMembers(data.members ?? []);
    } catch { setError("Failed to load team members."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  // ── Form helpers ──
  const resetForm = () => {
    setForm(EMPTY); setImageFile(null); setImagePreview(null);
    setEditingId(null); setShowForm(false); setError(null); setSuccess(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const openEdit = (m: TeamMember) => {
    setEditingId(m._id);
    setForm({
      name: m.name, category: m.category, designation: m.designation,
      education: m.education, experience: m.experience, bio: m.bio ?? "",
      email: m.email ?? "", phone: m.phone ?? "",
      order: String(m.order), isActive: String(m.isActive),
    });
    setImagePreview(imgUrl(m.image));
    setImageFile(null);
    setShowForm(true); setError(null); setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value })); setError(null);
  };

  // ── Save ──
  const handleSave = async () => {
    if (!form.name.trim() || !form.category || !form.designation.trim() || !form.education.trim() || !form.experience.trim()) {
      setError("Name, category, designation, education and experience are required."); return;
    }
    if (!editingId && !imageFile) { setError("Photo is required."); return; }

    setSaving(true); setError(null); setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("category", form.category);
      fd.append("designation", form.designation.trim());
      fd.append("education", form.education.trim());
      fd.append("experience", form.experience.trim());
      if (form.bio)   fd.append("bio",   form.bio.trim());
      if (form.email) fd.append("email", form.email.trim());
      if (form.phone) fd.append("phone", form.phone.trim());
      fd.append("order", form.order);
      fd.append("isActive", form.isActive);
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await apiClient.put(`/team/${editingId}`, fd);
        setSuccess("Team member updated!");
      } else {
        await apiClient.post("/team", fd);
        setSuccess("Team member added!");
      }
      resetForm(); await fetchMembers();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally { setSaving(false); }
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/team/${id}`);
      setMembers((p) => p.filter((m) => m._id !== id));
    } catch { alert("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  const filtered = filterCat === "All" ? members : members.filter((m) => m.category === filterCat);
  const cats = ["All", ...Array.from(new Set(members.map((m) => m.category)))];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Manager</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage teachers, staff and management members</p>
        </div>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <PlusIcon /> Add Member
          </button>
        )}
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{editingId ? "Edit Team Member" : "Add New Team Member"}</p>
            <button onClick={resetForm} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          </div>

          {/* Photo */}
          <div className="flex items-center gap-4">
            {imagePreview
              ? <img src={imagePreview} alt="preview" className="w-20 h-20 rounded-full object-cover border-2 border-border" />
              : <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-xs">No photo</div>
            }
            <button type="button" onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-lg border border-dashed border-border hover:border-primary text-sm text-muted-foreground hover:text-primary transition-all">
              {imagePreview ? "Change Photo" : "Upload Photo *"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; setImageFile(f); setImagePreview(URL.createObjectURL(f)); }} />
          </div>

          {/* Required fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { k: "name",        label: "Full Name *",       placeholder: "e.g. Rajesh Sharma",        type: "input" },
              { k: "designation", label: "Designation *",     placeholder: "e.g. Senior Teacher",       type: "input" },
              { k: "education",   label: "Education *",       placeholder: "e.g. M.Sc., B.Ed.",         type: "input" },
              { k: "experience",  label: "Experience *",      placeholder: "e.g. 10 years",             type: "input" },
              { k: "email",       label: "Email",             placeholder: "e.g. name@alokschool.org",  type: "input" },
              { k: "phone",       label: "Phone",             placeholder: "e.g. 9876543210",           type: "input" },
              { k: "order",       label: "Display Order",     placeholder: "0",                         type: "input" },
            ].map(({ k, label, placeholder }) => (
              <div key={k} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">{label}</label>
                <input type={k === "order" ? "number" : "text"} placeholder={placeholder}
                  value={form[k as keyof typeof EMPTY]} onChange={set(k as keyof typeof EMPTY)}
                  className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            ))}

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Category *</label>
              <select value={form.category} onChange={set("category")}
                className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* isActive */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select value={form.isActive} onChange={set("isActive")}
                className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Bio (optional)</label>
            <textarea rows={3} placeholder="Short bio about the team member..."
              value={form.bio} onChange={set("bio")}
              className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>

          {error   && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <SaveIcon />}
              {saving ? "Saving…" : editingId ? "Update Member" : "Add Member"}
            </button>
          </div>
        </div>
      )}

      {/* ── List ── */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-base font-semibold text-foreground">
            Team Members <span className="text-sm font-normal text-muted-foreground">({filtered.length})</span>
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {cats.map((c) => (
              <button key={c} onClick={() => setFilterCat(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {c}
              </button>
            ))}
            <button onClick={fetchMembers} className="text-xs text-muted-foreground hover:text-foreground ml-2">Refresh</button>
          </div>
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
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">No team members found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((m) => {
              const photo = imgUrl(m.image);
              return (
                <div key={m._id} className="rounded-xl border border-border bg-background flex flex-col items-center gap-3 p-4 text-center">
                  {/* Photo */}
                  {photo
                    ? <img src={photo} alt={m.name} className="w-20 h-20 rounded-full object-cover border-2 border-border" />
                    : <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-muted-foreground">{m.name.charAt(0)}</div>
                  }

                  {/* Info */}
                  <div className="flex flex-col gap-0.5 w-full">
                    <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                    <p className="text-xs text-primary font-medium truncate">{m.designation}</p>
                    <p className="text-xs text-muted-foreground">{m.education}</p>
                    <p className="text-xs text-muted-foreground">{m.experience} exp.</p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap justify-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{m.category}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${m.isActive ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"}`}>
                      {m.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full mt-1">
                    <button onClick={() => openEdit(m)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors">
                      <EditIcon /> Edit
                    </button>
                    <button onClick={() => handleDelete(m._id)} disabled={deletingId === m._id}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-colors disabled:opacity-50">
                      {deletingId === m._id
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
