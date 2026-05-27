"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

interface AllowedUser {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

const TrashIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>;
const EditIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>;
const PlusIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>;
const SaveIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" /></svg>;

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const EMPTY = { name: "", email: "", isActive: true };
const inputCls = "w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";
const labelCls = "text-xs font-medium text-muted-foreground mb-1.5 block";

export default function UserAccessManager() {
  const [users, setUsers]           = useState<AllowedUser[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [showForm, setShowForm]     = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);
  const [form, setForm]             = useState(EMPTY);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<{ users?: AllowedUser[] } | AllowedUser[]>("/allowed-users");
      const list = Array.isArray(data) ? data : (data.users ?? []);
      setUsers(list);
    } catch { setError("Failed to load users."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const resetForm = () => {
    setForm(EMPTY); setEditingId(null); setShowForm(false); setError(null); setSuccess(null);
  };

  const openEdit = (u: AllowedUser) => {
    setEditingId(u._id);
    setForm({ name: u.name, email: u.email, isActive: u.isActive });
    setShowForm(true); setError(null); setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
    setError(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("name is required."); return; }
    if (!form.email.trim())    { setError("Email is required."); return; }
    setSaving(true); setError(null); setSuccess(null);
    try {
      const payload = { name: form.name.trim(), email: form.email.trim(), isActive: form.isActive };
      if (editingId) {
        await apiClient.put(`/allowed-users/${editingId}`, payload);
        setSuccess("User updated successfully!");
      } else {
        await apiClient.post("/allowed-users", payload);
        setSuccess("User added successfully!");
      }
      resetForm(); await fetchUsers();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally { setSaving(false); }
  };

  const handleToggle = async (u: AllowedUser) => {
    setTogglingId(u._id);
    try {
      await apiClient.put(`/allowed-users/${u._id}`, { isActive: !u.isActive });
      setUsers((p) => p.map((x) => x._id === u._id ? { ...x, isActive: !x.isActive } : x));
    } catch { alert("Failed to update."); }
    finally { setTogglingId(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/allowed-users/${id}`);
      setUsers((p) => p.filter((x) => x._id !== id));
    } catch { alert("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  const activeCount = users.filter((u) => u.isActive).length;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Access Manager</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage allowed users and their access permissions</p>
        </div>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <PlusIcon /> Add User
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-primary/10 text-primary p-4 flex flex-col gap-1">
          <span className="text-2xl font-black">{users.length}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">Total</span>
        </div>
        <div className="rounded-xl bg-green-100 text-green-700 p-4 flex flex-col gap-1">
          <span className="text-2xl font-black">{activeCount}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">Active</span>
        </div>
        <div className="rounded-xl bg-secondary text-muted-foreground p-4 flex flex-col gap-1">
          <span className="text-2xl font-black">{users.length - activeCount}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">Inactive</span>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{editingId ? "Edit User" : "Add New User"}</p>
            <button onClick={resetForm} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>name <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. john_doe" value={form.name} onChange={set("name")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email <span className="text-red-500">*</span></label>
              <input type="email" placeholder="e.g. john@example.com" value={form.email} onChange={set("email")} className={inputCls} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={set("isActive")}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm text-foreground cursor-pointer select-none">
              Active — user can access the admin panel
            </label>
          </div>

          {error   && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <SaveIcon />}
              {saving ? "Saving…" : editingId ? "Update User" : "Add User"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            All Users <span className="text-muted-foreground font-normal">({users.length})</span>
          </p>
          <button onClick={fetchUsers} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Refresh</button>
        </div>

        {loading ? (
          <div className="flex flex-col">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border animate-pulse">
                <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3.5 bg-secondary rounded w-1/4" />
                  <div className="h-3 bg-secondary rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-muted-foreground">
            <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm">No users yet. Click "Add User" to create one.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {users.map((u) => (
              <div key={u._id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors">

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary uppercase">{(u.name ?? u.email ?? "?").charAt(0)}</span>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                  <p className="text-xs text-muted-foreground">{fmt(u.createdAt)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:block">Active</span>
                    <button onClick={() => handleToggle(u)} disabled={togglingId === u._id}
                      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${u.isActive ? "bg-green-500" : "bg-border"} disabled:opacity-50`}>
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${u.isActive ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                  <button onClick={() => openEdit(u)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors">
                    <EditIcon /> Edit
                  </button>
                  <button onClick={() => handleDelete(u._id)} disabled={deletingId === u._id}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-colors disabled:opacity-50">
                    {deletingId === u._id ? <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <TrashIcon />}
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
