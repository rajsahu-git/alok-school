"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AlumniFormEntry {
  _id: string;
  fullName: string;
  gender: string;
  dob: string;
  mobileNumber: string;
  email: string;
  yearOfPassing: string;
  classStream: string;
  admissionNumber?: string;
  currentProfession: string;
  cityCountry: string;
  interestedInMentoring: boolean;
  receiveAlumniUpdates: boolean;
  message?: string;
  image?: { fileId: string; viewLink: string; directLink: string };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const STATUS_STYLES: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-500",
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ entry, onClose }: { entry: AlumniFormEntry; onClose: () => void }) {
  const photo = entry.image?.fileId ? `/api/drive-image?id=${entry.image.fileId}` : null;

  const fields = [
    { label: "Full Name",             value: entry.fullName },
    { label: "Gender",                value: entry.gender.charAt(0).toUpperCase() + entry.gender.slice(1) },
    { label: "Date of Birth",         value: fmt(entry.dob) },
    { label: "Mobile Number",         value: entry.mobileNumber },
    { label: "Email",                 value: entry.email },
    { label: "Year of Passing",       value: entry.yearOfPassing },
    { label: "Class / Stream",        value: entry.classStream },
    { label: "Admission Number",      value: entry.admissionNumber || "—" },
    { label: "Current Profession",    value: entry.currentProfession },
    { label: "City & Country",        value: entry.cityCountry },
    { label: "Interested in Mentoring", value: entry.interestedInMentoring ? "Yes" : "No" },
    { label: "Receive Alumni Updates",  value: entry.receiveAlumniUpdates ? "Yes" : "No" },
    { label: "Submitted On",          value: fmt(entry.createdAt) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            {photo ? (
              <img src={photo} alt={entry.fullName} className="w-10 h-10 rounded-full object-cover border border-border" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {entry.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-foreground">{entry.fullName}</h2>
              <p className="text-xs text-muted-foreground">{entry.classStream} · {entry.yearOfPassing}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[entry.status]}`}>
              {entry.status}
            </span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary hover:bg-border flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Photo */}
          {photo && (
            <div className="flex justify-center">
              <img src={photo} alt={entry.fullName} className="w-28 h-28 rounded-full object-cover border-4 border-secondary shadow" />
            </div>
          )}

          {/* Fields grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map(({ label, value }) => (
              <div key={label} className="bg-secondary rounded-xl px-4 py-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-sm font-medium text-foreground break-words">{value}</p>
              </div>
            ))}
          </div>

          {/* Message */}
          {entry.message && (
            <div className="border-l-4 border-primary bg-secondary rounded-r-xl px-5 py-4">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Message / Memories</p>
              <p className="text-sm text-foreground leading-relaxed">{entry.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AlumniFormsManager() {
  const [forms, setForms]           = useState<AlumniFormEntry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected]     = useState<AlumniFormEntry | null>(null);

  const fetchForms = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await apiClient.get<{ forms: AlumniFormEntry[] }>("/alumni-form");
      setForms(data.forms ?? []);
    } catch { setError("Failed to load alumni forms."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchForms(); }, [fetchForms]);

  // ── Stats ──
  const stats = [
    { label: "Total",    count: forms.length,                                    color: "bg-primary/10 text-primary" },
    { label: "Pending",  count: forms.filter((f) => f.status === "pending").length,  color: "bg-yellow-100 text-yellow-700" },
    { label: "Approved", count: forms.filter((f) => f.status === "approved").length, color: "bg-green-100 text-green-700" },
    { label: "Rejected", count: forms.filter((f) => f.status === "rejected").length, color: "bg-red-100 text-red-500" },
  ];

  // ── Filter ──
  const filtered = forms.filter((f) => {
    const q = search.toLowerCase();
    const matchSearch = !q || f.fullName.toLowerCase().includes(q) ||
      f.email.toLowerCase().includes(q) || f.mobileNumber.includes(q) ||
      f.cityCountry.toLowerCase().includes(q) || f.yearOfPassing.includes(q);
    const matchStatus = filterStatus === "all" || f.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alumni Registrations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">View all alumni registration form submissions</p>
        </div>
        <button onClick={fetchForms} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-4 flex flex-col gap-1 ${s.color}`}>
            <span className="text-2xl font-black">{s.count}</span>
            <span className="text-xs font-semibold uppercase tracking-wide">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search by name, email, phone, city, year..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            Submissions <span className="text-muted-foreground font-normal">({filtered.length})</span>
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border animate-pulse">
                <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3.5 bg-secondary rounded w-1/3" />
                  <div className="h-3 bg-secondary rounded w-1/4" />
                </div>
                <div className="h-6 w-16 bg-secondary rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-red-500 text-center py-10">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm">No alumni registrations found.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 text-left">
                    {["Alumni", "Year", "Stream", "Profession", "City", "Mentoring", "Submitted", "Status", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((f, i) => {
                    const photo = f.image?.fileId ? `/api/drive-image?id=${f.image.fileId}` : null;
                    return (
                      <tr key={f._id} className={`border-t border-border hover:bg-secondary/30 transition-colors ${i % 2 === 0 ? "" : "bg-secondary/10"}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            {photo ? (
                              <img src={photo} alt={f.fullName} className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-border" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                                {f.fullName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground whitespace-nowrap">{f.fullName}</span>
                              <span className="text-xs text-muted-foreground">{f.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{f.yearOfPassing}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{f.classStream}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap max-w-[140px] truncate">{f.currentProfession}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{f.cityCountry}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${f.interestedInMentoring ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"}`}>
                            {f.interestedInMentoring ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmt(f.createdAt)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[f.status]}`}>
                            {f.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => setSelected(f)}
                            className="text-xs text-primary font-medium hover:underline whitespace-nowrap">
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col divide-y divide-border">
              {filtered.map((f) => {
                const photo = f.image?.fileId ? `/api/drive-image?id=${f.image.fileId}` : null;
                return (
                  <div key={f._id} className="p-4 flex items-start gap-3">
                    {photo ? (
                      <img src={photo} alt={f.fullName} className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-border" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                        {f.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{f.fullName}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${STATUS_STYLES[f.status]}`}>
                          {f.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{f.classStream} · {f.yearOfPassing}</p>
                      <p className="text-xs text-muted-foreground">{f.currentProfession} · {f.cityCountry}</p>
                      <p className="text-xs text-muted-foreground">{f.email}</p>
                      <button onClick={() => setSelected(f)}
                        className="text-xs text-primary font-medium hover:underline text-left mt-1">
                        View Details →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && <DetailModal entry={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
