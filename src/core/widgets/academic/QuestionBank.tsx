"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageHero from "@/core/widgets/shared/PageHero";

interface QuestionBank {
  _id: string;
  title: string;
  class: string;
  pdf?: { fileId: string; fileName: string; viewLink: string; directLink: string };
  createdAt: string;
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function QuestionBank() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const activeClass = searchParams.get("questionBankClass") ?? "";

  const [allBanks, setAllBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/question-bank")
      .then((r) => r.json())
      .then((d) => {
        const all: QuestionBank[] = d.QuestionBanks ?? [];
        setAllBanks(all);
        if (!searchParams.get("questionBankClass") && all.length > 0) {
          const first = all[0].class;
          router.replace(`/academic/question-bank?questionBankClass=${encodeURIComponent(first)}`);
        }
      })
      .catch(() => setAllBanks([]))
      .finally(() => setLoading(false));
  }, []);

  const availableClasses = [...new Set(allBanks.map((b) => b.class))];
  const banks = allBanks.filter((b) => b.class === activeClass);

  const setClass = (cls: string) => {
    const params = new URLSearchParams();
    if (cls) params.set("questionBankClass", cls);
    router.push(`/academic/question-bank${cls ? `?${params}` : ""}`);
  };

  return (
    <>
      <PageHero
        title="Question Bank"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Academic", href: "/academic" },
          { label: "Question Bank" },
        ]}
      />

      <section className="py-14 bg-background">
        <div className="container flex flex-col gap-10">

          {/* Class filter tabs */}
          <div className="flex flex-wrap gap-2">
            {availableClasses.map((cls) => (
              <button
                key={cls}
                onClick={() => setClass(cls)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  activeClass === cls
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse flex gap-5">
                  <div className="w-14 h-14 rounded-xl bg-secondary flex-shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 bg-secondary rounded w-1/2" />
                    <div className="h-3 bg-secondary rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : banks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
              <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No question banks available{activeClass ? ` for ${activeClass}` : ""}.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {banks.map((b) => (
                <div key={b._id}
                  className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-5 shadow-sm hover:shadow-md transition-shadow duration-300 hover:border-primary/30">

                  {/* PDF icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                      className="w-7 h-7 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground">{b.title}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">
                        {b.class}
                      </span>
                      <span className="text-xs text-muted-foreground">Added {fmt(b.createdAt)}</span>
                    </div>
                  </div>

                  {/* Download */}
                  {b.pdf?.viewLink && (
                    <a
                      href={b.pdf.viewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}
