import PageHero from '@/core/widgets/shared/PageHero';

interface MandatoryDisclosure {
  _id: string;
  title?: string;
  file: { fileId: string; fileName: string; viewLink: string; directLink: string };
  createdAt: string;
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

async function getDisclosures(): Promise<MandatoryDisclosure[]> {
  try {
    const res = await fetch(`${BASE}/api/mandatory-disclosure`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.disclosures ?? [];
  } catch { return []; }
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default async function MandatoryDisclosurePage() {
  const disclosures = await getDisclosures();

  return (
    <>
      <PageHero
        title="Mandatory Disclosure"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Mandatory Disclosure' }]}
      />

      <section className="py-14 bg-background">
        <div className="container flex flex-col gap-4">
          {disclosures.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
              <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">Mandatory disclosure documents are not available at the moment.</p>
            </div>
          ) : (
            disclosures.map((d) => (
              <div key={d._id}
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
                  <h3 className="text-sm font-bold text-foreground">{d.title || 'Mandatory Disclosure'}</h3>
                  <span className="text-xs text-muted-foreground">Added {fmt(d.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <a
                    href={`/api/drive-pdf?id=${d.file.fileId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12S5.25 5.25 12 5.25 21.75 12 21.75 12 18.75 18.75 12 18.75 2.25 12 2.25 12z" />
                      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    View
                  </a>
                  <a
                    href={`/api/drive-pdf?id=${d.file.fileId}&dl=1`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
