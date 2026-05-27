"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const TrashIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>;

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function ContactManager() {
  const [messages, setMessages]     = useState<ContactMessage[]>([]);
  const [loading, setLoading]       = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expanded, setExpanded]     = useState<string | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [filterRead, setFilterRead] = useState<"all" | "read" | "unread">("all");

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<{ contacts: ContactMessage[] } | ContactMessage[]>("/contact");
      const list = Array.isArray(data) ? data : (data.contacts ?? []);
      setMessages(list);
    } catch { setError("Failed to load messages."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/contact/${id}`);
      setMessages((p) => p.filter((x) => x._id !== id));
    } catch { alert("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  const handleMarkRead = async (msg: ContactMessage) => {
    try {
      await apiClient.put(`/contact/${msg._id}`, { isRead: !msg.isRead });
      setMessages((p) => p.map((x) => x._id === msg._id ? { ...x, isRead: !x.isRead } : x));
    } catch { alert("Failed to update."); }
  };

  const filtered = messages.filter((m) => {
    if (filterRead === "read"   && !m.isRead) return false;
    if (filterRead === "unread" &&  m.isRead) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) &&
        !m.email.toLowerCase().includes(search.toLowerCase()) &&
        !m.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contact Messages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Messages submitted via the contact forms</p>
        </div>
        <button onClick={fetchMessages} className="text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg transition-colors">
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-primary/10 text-primary p-4 flex flex-col gap-1">
          <span className="text-2xl font-black">{messages.length}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">Total</span>
        </div>

      </div>

      {/* Filters */}


      {/* List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            Messages <span className="text-muted-foreground font-normal">({filtered.length})</span>
          </p>
        </div>

        {error ? (
          <div className="flex items-center justify-center py-14 text-sm text-red-500">{error}</div>
        ) : loading ? (
          <div className="flex flex-col">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-4 border-b border-border animate-pulse">
                <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3.5 bg-secondary rounded w-1/4" />
                  <div className="h-3 bg-secondary rounded w-1/3" />
                  <div className="h-3 bg-secondary rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-muted-foreground">
            <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-sm">No messages found.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {filtered.map((m) => (
              <div key={m._id} className={`flex flex-col gap-3 px-5 py-4 hover:bg-secondary/20 transition-colors ${!m.isRead ? "border-l-4 border-l-orange-400" : ""}`}>

                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary uppercase">{m.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{m.name}</p>
                        {!m.isRead && <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">NEW</span>}
                      </div>
                      <a href={`mailto:${m.email}`} className="text-xs text-primary hover:underline">{m.email}</a>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">{fmt(m.createdAt)}</span>
                </div>

                {/* Message preview / expanded */}
                <p className={`text-sm text-muted-foreground leading-relaxed ${expanded === m._id ? "" : "line-clamp-2"}`}>
                  {m.message}
                </p>
                {m.message.length > 120 && (
                  <button onClick={() => setExpanded(expanded === m._id ? null : m._id)}
                    className="text-xs text-primary hover:underline self-start">
                    {expanded === m._id ? "Show less" : "Read more"}
                  </button>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* <button onClick={() => handleMarkRead(m)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      m.isRead
                        ? "bg-secondary text-muted-foreground hover:bg-border"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {m.isRead ? "Mark Unread" : "Mark Read"}
                  </button>
                  <a href={`mailto:${m.email}`}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Reply
                  </a> */}
                  <button onClick={() => handleDelete(m._id)} disabled={deletingId === m._id}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-colors disabled:opacity-50 ml-auto">
                    {deletingId === m._id ? <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <TrashIcon />}
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
