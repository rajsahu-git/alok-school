import type { ExamNotice } from '@/app/academic/examination/page';

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function isUpcoming(dateTo: string) {
  return new Date(dateTo) >= new Date();
}

function Description({ text }: { text: string }) {
  const points = text.split(/(?=\(\d+\))/g).map((s) => s.trim()).filter(Boolean);

  if (points.length > 1) {
    return (
      <ul className="text-xs text-muted-foreground leading-relaxed flex flex-col gap-1 list-none">
        {points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    );
  }

  return <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{text}</p>;
}

export default function Examination({ notices }: { notices: ExamNotice[] }) {
  const upcoming = notices.filter((n) => isUpcoming(n.examDateTo));
  const past     = notices.filter((n) => !isUpcoming(n.examDateTo));

  return (
    <section className="py-14 bg-background">
      <div className="container flex flex-col gap-12">

        {/* Intro */}
        <div className="max-w-2xl">
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Stay updated with all examination schedules and announcements. Download the
            official PDF notice for detailed timetables and instructions.
          </p>
        </div>

        {notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No examination notices available at the moment.</p>
          </div>
        ) : (
          <>
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
                    Upcoming Examinations
                  </h2>
                  <span className="flex items-center gap-1.5 text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                    {upcoming.length} Active
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {upcoming.map((n) => <NoticeCard key={n._id} notice={n} active />)}
                </div>
              </div>
            )}

            {/* Past */}
            {past.length > 0 && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
                    Past Examinations
                  </h2>
                  <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                    {past.length} Records
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {past.map((n) => <NoticeCard key={n._id} notice={n} active={false} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function NoticeCard({ notice: n, active }: { notice: ExamNotice; active: boolean }) {
  return (
    <div className={`rounded-xl border bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-5 shadow-sm hover:shadow-md transition-shadow duration-300 ${active ? 'border-primary/30' : 'border-border'}`}>

      {/* Left — PDF icon */}
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? 'bg-primary/10' : 'bg-secondary'}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
          className={`w-7 h-7 ${active ? 'text-primary' : 'text-muted-foreground'}`}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>

      {/* Middle — Info */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold text-foreground">{n.title}</h3>
          {active ? (
            <span className="text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Upcoming</span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wide bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">Completed</span>
          )}
        </div>
        <Description text={n.description} />
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-foreground font-medium">
            <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {fmt(n.examDateFrom)} — {fmt(n.examDateTo)}
          </span>
        </div>
      </div>

      {/* Right — Download */}
      <a
        href={n.pdf?.viewLink ?? (n.image ? `/api/drive-image?id=${n.image.fileId}` : '#')}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          active
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'bg-secondary text-foreground hover:bg-border'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        View / Download
      </a>
    </div>
  );
}
