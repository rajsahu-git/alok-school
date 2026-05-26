"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PageHero from "@/core/widgets/shared/PageHero";

interface Result {
  _id: string;
  studentName: string;
  sessionYear: string;
  studentClass: string;
  stream: string | null;
  percentage: number;
  image: { fileId: string; viewLink: string; directLink: string };
}

const STREAMS = ["Arts", "Science", "Commerce"] as const;

function StudentGrid({ students, getStreamColor }: { students: Result[]; getStreamColor: (s: string | null) => string }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {students.map((r) => (
        <div key={r._id} className="bg-secondary rounded-2xl shadow-md p-2 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="w-full aspect-square rounded-xl overflow-hidden border-[3px] border-red-700 mb-2">
            <Image
              src={`/api/drive-image?id=${r.image.fileId}`}
              alt={r.studentName}
              width={160}
              height={160}
              className="w-full h-full object-cover object-top"
              unoptimized
            />
          </div>
          <p className="text-sm font-extrabold text-red-700 leading-tight">{r.percentage}%</p>
          <p className="text-[11px] font-bold text-gray-900 uppercase leading-tight mt-0.5">{r.studentName}</p>
          <p className={`text-[10px] font-bold uppercase mt-0.5 text-${getStreamColor(r.stream)}`}>
            {r.stream ?? `Class ${r.studentClass}`}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function ResultSection({ studentClass }: { studentClass: "10th" | "12th" }) {
  const [results, setResults]         = useState<Result[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filterYear, setFilterYear]   = useState("");
  const [filterStream, setFilterStream] = useState("");

  const getStreamColor = (stream: string | null): string => {
    if (!stream) return "gray-500";
    switch (stream.toLowerCase()) {
      case "humanities":
      case "arts":
        return "orange-500";
      case "commerce":
        return "green-600";
      case "science":
        return "blue-600";
      default:
        return "gray-500";
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/result?studentClass=${studentClass}`)
      .then((r) => r.json())
      .then((d) => setResults(d.results ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [studentClass]);

  const uniqueYears = [...new Set(results.map((r) => r.sessionYear))].sort().reverse();

  const is12th = studentClass === "12th";
  const title   = is12th ? "Class XII Results" : "Class X Results";

  const filtered = results.filter((r) => {
    if (filterYear && r.sessionYear !== filterYear) return false;
    if (is12th && filterStream && r.stream?.toLowerCase() !== filterStream.toLowerCase()) return false;
    return true;
  });

  const streamSections = is12th && !filterStream
    ? STREAMS.map((s) => ({ stream: s, students: filtered.filter((r) => r.stream?.toLowerCase() === s.toLowerCase()) }))
      .filter((s) => s.students.length > 0)
    : null;


  return (
    <>
      <PageHero
        title={title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Result", href: "/result" },
          { label: title },
        ]}
      />

      <section className="py-12 bg-background">
        <div className="container flex flex-col gap-8">

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Sessions</option>
              {uniqueYears.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>

            {is12th && (
              <select
                value={filterStream}
                onChange={(e) => setFilterStream(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Streams</option>
                {STREAMS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 py-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-2 flex flex-col items-center animate-pulse">
                  <div className="w-full aspect-square rounded-xl bg-gray-200 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-12 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-16 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-12" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
              <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No results found.</p>
            </div>
          ) : streamSections ? (
            <div className="flex flex-col gap-10 py-6">
              {streamSections.map(({ stream, students }) => (
                <div key={stream}>
                  <h3 className={`text-lg font-bold uppercase mb-4 text-${getStreamColor(stream)}`}>{stream}</h3>
                  <StudentGrid students={students} getStreamColor={getStreamColor} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6">
              <StudentGrid students={filtered} getStreamColor={getStreamColor} />
            </div>
          )}

        </div>
      </section>
    </>
  );
}