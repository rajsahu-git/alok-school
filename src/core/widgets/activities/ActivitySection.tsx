import PageHero from '@/core/widgets/shared/PageHero';
import Link from 'next/link';

interface GalleryImage {
  _id: string;
  fileId: string;
  fileName: string;
  viewLink: string;
}

interface ActivitySectionProps {
  title: string;
  description: string;
  images: GalleryImage[];
  breadcrumbLabel: string;
}

export default function ActivitySection({ title, description, images, breadcrumbLabel }: ActivitySectionProps) {
  const heroImage   = images[0] ? `/api/drive-image?id=${images[0].fileId}` : null;
  const galleryImgs = images.slice(1);

  return (
    <>
      <PageHero
        title={breadcrumbLabel}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Activities', href: '/activities' },
          { label: breadcrumbLabel },
        ]}
      />

      <section className="py-14 bg-background">
        <div className="container flex flex-col gap-14">

          {/* ── Hero: image left + text right ── */}
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="w-full lg:w-1/2 flex-shrink-0">
              {heroImage ? (
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <img src={heroImage} alt={title} className="w-full object-cover aspect-[4/3]" />
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary/20 rounded-xl -z-10" />
                </div>
              ) : (
                <div className="w-full aspect-[4/3] rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground text-sm">
                  No image available
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
                Our <span className="text-primary">{title}</span>
              </h2>
              <div className="w-12 h-1 bg-primary rounded-full" />
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-justify">
                {description}
              </p>
              {images.length > 0 && (
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full w-fit">
                  {images.length} Photos
                </span>
              )}
            </div>
          </div>

          {/* ── Gallery grid ── */}
          {galleryImgs.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>Gallery</h3>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <span className="block w-8 h-px bg-accent" />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                  <span className="block w-8 h-px bg-accent" />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImgs.map((img) => (
                  <a key={img._id} href={img.viewLink} target="_blank" rel="noopener noreferrer"
                    className="group rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="aspect-[4/3] overflow-hidden bg-secondary">
                      <img src={`/api/drive-image?id=${img.fileId}`} alt={img.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {images.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">No images available yet.</p>
            </div>
          )}



        </div>
      </section>
    </>
  );
}
