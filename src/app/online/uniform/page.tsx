import PageHero from '@/core/widgets/shared/PageHero';

export default function UniformPage() {
  return (
    <>
      <PageHero
        title="School Uniform"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Online', href: '/online' },
          { label: 'School Uniform' },
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
              The following pages contain the official uniform guidelines for Alok School students.
              Please ensure the uniform is worn as per the prescribed standards.
            </p>
          </div>

          {/* Images */}
          <div className="flex flex-col lg:flex-row justify-center 
  gap-6 max-w-4xl mx-auto w-full">
            {['/uniform_page-0001.jpg', '/uniform_page-0002.jpg'].map((src, i) => (
              <div key={src} className="rounded-2xl overflow-hidden border border-border shadow-md">
                <div className="bg-secondary px-4 py-2.5 border-b border-border flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs font-semibold text-muted-foreground">Page {i + 1}</span>
                </div>
                <img
                  src={src}
                  alt={`Uniform Details Page ${i + 1}`}
                  className="w-full object-contain"
                />
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
