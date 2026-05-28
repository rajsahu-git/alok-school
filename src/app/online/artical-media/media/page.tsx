import { fetchActivityImages } from '@/lib/activityApi';
import TabNav from '@/core/widgets/academic/TabNav';
import PageHero from '@/core/widgets/shared/PageHero';
import MediaGrid from '@/core/widgets/academic/MediaGrid';

export default async function MediaPage() {
  const images = await fetchActivityImages('6a1826c218979b1cd6f095ed');

  return (
    <>
      <PageHero
        title="Newspaper Coverage"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Newspaper Coverage' }]}
      />
      <section className="max-w-6xl mx-auto px-4 py-10">
        {/* <TabNav /> */}
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No media available yet.</p>
          </div>
        ) : (
          <MediaGrid images={images} />
        )}
      </section>
    </>
  );
}
