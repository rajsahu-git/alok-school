"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Admission {
  _id: string;
  studentName: string;
  classSeekingAdmission: string;
  parentName: string;
  contactNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  dateOfBirth: string;
  gender: string;
  previousSchool?: string;
  message?: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const STATUS_STYLES: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  reviewed: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-500",
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ admission, onClose }: { admission: Admission; onClose: () => void }) {
  const fields = [
    { label: "Student Name",        value: admission.studentName },
    { label: "Class Seeking",       value: admission.classSeekingAdmission },
    { label: "Date of Birth",       value: fmt(admission.dateOfBirth) },
    { label: "Gender",              value: admission.gender.charAt(0).toUpperCase() + admission.gender.slice(1) },
    { label: "Parent Name",         value: admission.parentName },
    { label: "Contact Number",      value: admission.contactNumber },
    { label: "Email",               value: admission.email },
    { label: "Address",             value: `${admission.address}, ${admission.city}, ${admission.state} - ${admission.pincode}` },
    { label: "Previous School",     value: admission.previousSchool || "—" },
    { label: "Message",             value: admission.message || "—" },
    { label: "Applied On",          value: fmt(admission.createdAt) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold text-foreground">{admission.studentName}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Admission Enquiry Details</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[admission.status]}`}>
              {admission.status}
            </span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary hover:bg-border flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1 bg-secondary rounded-xl p-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
              <span className="text-sm text-foreground font-medium break-words">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdmissionsManager() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClass, setFilterClass]   = useState("all");
  const [selected, setSelected]     = useState<Admission | null>(null);

  const fetchAdmissions = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await apiClient.get<{ admissions: Admission[] }>("/admission");
      setAdmissions(data.admissions ?? []);
    } catch { setError("Failed to load admissions."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAdmissions(); }, [fetchAdmissions]);

  // ── Filters ──
  const classes = ["all", ...Array.from(new Set(admissions.map((a) => a.classSeekingAdmission)))];

  const filtered = admissions.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.studentName.toLowerCase().includes(q) ||
      a.parentName.toLowerCase().includes(q) || a.contactNumber.includes(q) ||
      a.email.toLowerCase().includes(q) || a.city.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    const matchClass  = filterClass  === "all" || a.classSeekingAdmission === filterClass;
    return matchSearch && matchStatus && matchClass;
  });

  // ── Stats ──
  const stats = [
    { label: "Total",    count: admissions.length,                                    color: "bg-primary/10 text-primary" },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admissions Manager</h1>
          <p className="text-sm text-muted-foreground mt-0.5">View and manage all admission enquiries</p>
        </div>
        <button onClick={fetchAdmissions} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
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
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Status filter */}
        {/* <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select> */}

        {/* Class filter */}
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
          {classes.map((c) => <option key={c} value={c}>{c === "all" ? "All Classes" : c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            Enquiries <span className="text-muted-foreground font-normal">({filtered.length})</span>
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border animate-pulse">
                <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No admissions found.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 text-left">
                    {["Student", "Class", "Parent", "Contact", "City", "Applied On", "Status", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <tr key={a._id} className={`border-t border-border hover:bg-secondary/30 transition-colors ${i % 2 === 0 ? "" : "bg-secondary/10"}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                            {a.studentName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground whitespace-nowrap">{a.studentName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{a.classSeekingAdmission}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{a.parentName}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{a.contactNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{a.city}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmt(a.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[a.status]}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(a)}
                          className="text-xs text-primary font-medium hover:underline whitespace-nowrap">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col divide-y divide-border">
              {filtered.map((a) => (
                <div key={a._id} className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                    {a.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">{a.studentName}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${STATUS_STYLES[a.status]}`}>
                        {a.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{a.classSeekingAdmission} · {a.city}</p>
                    <p className="text-xs text-muted-foreground">{a.parentName} · {a.contactNumber}</p>
                    <p className="text-xs text-muted-foreground">{fmt(a.createdAt)}</p>
                    <button onClick={() => setSelected(a)}
                      className="text-xs text-primary font-medium hover:underline text-left mt-1">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && <DetailModal admission={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
