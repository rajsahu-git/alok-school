import PageHero from '@/core/widgets/shared/PageHero';

export default function CalendarPage() {
  return (
    <>
      <PageHero
        title="Annual Calendar"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Academic', href: '/academic' },
          { label: 'Annual Calendar' },
        ]}
      />

      <section className="py-14 bg-background">
        <div className="container flex flex-col gap-8">

          {/* Heading */}
          <div className="text-center">

            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="block w-12 h-px bg-accent" />
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              <span className="block w-12 h-px bg-accent" />
            </div>
            <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
              The official academic calendar for the session 2025–26 including holidays, examination schedules and important events.
            </p>
          </div>

          {/* Image */}
          <div className="max-w-5xl mx-auto w-full rounded-2xl overflow-hidden border border-border shadow-md">
            <div className="bg-secondary px-4 py-2.5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-semibold text-muted-foreground">Annual Calendar 2025–26</span>
              </div>
              <a
                href="/anual_celender.jpg"
                download="Annual-Calendar-2025-26.jpg"
                className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </a>
            </div>
            <img
              src="/anual_celender.jpg"
              alt="Annual Calendar 2025-26"
              className="w-full object-contain"
            />
          </div>

        </div>
      </section>
    </>
  );
}
