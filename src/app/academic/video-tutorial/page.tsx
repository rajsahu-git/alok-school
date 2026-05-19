import PageHero from '@/core/widgets/shared/PageHero';

const VIDEOS = [
  {
    id: 'XW0bwVVGfb4',
    title: 'Alok School Video Tutorial',
    description: 'Watch this video tutorial from Alok School Rajsamand.',
  },
];

export default function VideoTutorialPage() {
  return (
    <>
      <PageHero
        title="Video Tutorial"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Academic', href: '/academic' },
          { label: 'Video Tutorial' },
        ]}
      />

      <section className="py-14 bg-background">
        <div className="container flex flex-col gap-10">

          {/* Heading */}
          <div className="text-center">

            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="block w-12 h-px bg-accent" />
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              <span className="block w-12 h-px bg-accent" />
            </div>
            <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
              Explore our educational video tutorials to enhance your learning experience.
            </p>
          </div>

          {/* Videos */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 max-w-5xl mx-auto w-full">
            {VIDEOS.map((video) => (
              <div key={video.id} className="flex flex-col gap-3">
                <div className="rounded-2xl overflow-hidden border border-border shadow-md aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                {/* <div className="px-1">
                  <h3 className="text-sm font-bold text-foreground">{video.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{video.description}</p>
                </div> */}
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
