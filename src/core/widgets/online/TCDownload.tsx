"use client";

import { useState } from "react";

const TC_SAMPLE_IMG = "/t.c_sample.jpeg";

interface TCResult {
  _id: string;
  scholarNumber: string;
  name: string;
  fatherName: string;
  dob: string;
  lastClass: string;
  tcFile: { fileId: string; viewLink: string; directLink: string; fileName: string };
}

export default function TCDownload() {
  const [scholarNumber, setScholarNumber] = useState("");
  const [loading, setLoading]             = useState(false);
  const [result, setResult]               = useState<TCResult | null>(null);
  const [error, setError]                 = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarNumber.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      // Use GET /api/tc?scholarNumber=xxx to get TC data as JSON
      const res = await fetch(`/api/tc?scholarNumber=${encodeURIComponent(scholarNumber.trim())}`);
      if (!res.ok) { setError("Something went wrong. Please try again."); return; }
      const data = await res.json();
      const tc = (data.tcs ?? [])[0];
      if (!tc) { setError("No Transfer Certificate found for this Scholar Number."); return; }
      setResult(tc);
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <section className="py-14 bg-background">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* ── Left: TC Sample Image ── */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="text-center mb-2">
              <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>
                TC Sample
              </h2>
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="block w-8 h-px bg-accent" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                <span className="block w-8 h-px bg-accent" />
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border shadow-md">
              <img
                src={TC_SAMPLE_IMG}
                alt="Transfer Certificate Sample"
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* ── Right: Search Form ── */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>
                Download Transfer Certificate
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="block w-8 h-px bg-accent" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                <span className="block w-8 h-px bg-accent" />
              </div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Enter your Scholar Number to search and download your Transfer Certificate issued by Alok School.
              </p>
            </div>

            {/* Form */}
            <div className="bg-card rounded-2xl border border-border p-6 flex flex-col gap-5 shadow-sm">
              <form onSubmit={handleSearch} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Scholar Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your Scholar Number"
                    value={scholarNumber}
                    onChange={(e) => { setScholarNumber(e.target.value); setError(null); setResult(null); }}
                    className="px-4 py-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !scholarNumber.trim()}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )
                  }
                  {loading ? "Searching…" : "Search TC"}
                </button>
              </form>

              {/* Result */}
              {result && result.tcFile && (
                <div className="flex flex-col gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-green-700">Transfer Certificate Found!</p>
                  </div>

                  {/* TC Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Scholar Number", value: result.scholarNumber },
                      { label: "Student Name",   value: result.name },
                      { label: "Father's Name",  value: result.fatherName },
                      { label: "Date of Birth",  value: fmt(result.dob) },
                      { label: "Last Class",     value: result.lastClass },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-secondary rounded-xl px-4 py-3">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
                        <p className="text-sm font-medium text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Download buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={result.tcFile.viewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-secondary text-sm font-semibold hover:bg-border hover:text-black transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View TC & Download
                    </a>
                    
                  </div>
                </div>
              )}
            </div>

            {/* Info note */}
            <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your Scholar Number is mentioned on your school ID card or any official document issued by Alok School.
                For assistance, contact the school office at <span className="text-primary font-medium">02952-224225</span>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
