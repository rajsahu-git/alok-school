import PageHero from '@/core/widgets/shared/PageHero';

export default function FeeStructurePage() {
  return (
    <>
      <PageHero
        title="Fee Structure"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admission', href: '/admission' },
          { label: 'Fee Structure' },
        ]}
      />

      <section className="py-14 bg-background">
        <div className="container flex flex-col gap-8">

          {/* Heading */}
          <div className="text-center">
            {/* <h2 className="text-2xl md:text-3xl font-bold text-primary" style={{ fontFamily: 'Georgia, serif' }}>
              Fee Structure 2025–26
            </h2> */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="block w-12 h-px bg-accent" />
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              <span className="block w-12 h-px bg-accent" />
            </div>
            <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
              The following is the official fee structure for the academic year 2025–26.
              For any queries, please contact the school office.
            </p>
          </div>

          {/* Image */}
          <div className="max-w-4xl mx-auto w-full rounded-2xl overflow-hidden border border-border shadow-md">
            <div className="bg-secondary px-4 py-2.5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs font-semibold text-muted-foreground">Fee Structure 2025–26</span>
              </div>
              {/* <a
                href="/Fee-Structure-2025-26-updated-1-1_page-0001-1.jpg"
                download="Fee-Structure-2025-26.jpg"
                className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </a> */}
            </div>
            <img
              src="/Fee-Structure-2025-26-updated-1-1_page-0001-1.jpg"
              alt="Fee Structure 2025-26"
              className="w-full object-contain"
            />
          </div>

          {/* Note */}
          <div className="max-w-4xl mx-auto w-full flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl px-5 py-4">
            <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Fee structure is subject to revision. For the latest information or any queries regarding fees,
              please contact the school office at <span className="text-primary font-medium">02952-224225</span> or
              email us at <span className="text-primary font-medium">alokrajsamand@alokschool.org</span>.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
