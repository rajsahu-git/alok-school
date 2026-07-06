import type { AlumniItem } from "@/app/about-us/our-alumni/page";

function AlumniCard({ a }: { a: AlumniItem }) {
  const photo = `/api/drive-image?id=${a.image.fileId}`;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300">

      {/* Photo */}
      <div className="relative w-full aspect-4/5 shrink-0 bg-secondary/20">
        <img
          src={photo}
          alt={a.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>

      <div className="p-6 flex flex-col items-center text-center w-full">
        {/* Name */}
        <h3 className="text-sm font-bold text-foreground mb-1 leading-snug">{a.name}</h3>

        {/* Position */}
        <p className="text-xs font-semibold tracking-widest text-primary uppercase leading-relaxed mb-1">
          {a.currentPosition}
        </p>

        {/* Batch */}
        <p className="text-xs text-muted-foreground font-medium">Batch: {a.batch}</p>
      </div>

      {/* Social links */}
      {(a.linkedin || a.github || a.twitter) && (
        <div className="flex items-center justify-center gap-3 pb-6 pt-3 border-t border-border w-full px-6">
          {a.linkedin && (
            <a href={a.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          )}
          {a.github && (
            <a href={a.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
          )}
          {a.twitter && (
            <a href={a.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"
              className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function OurAlumni({ alumni }: { alumni: AlumniItem[] }) {
  return (
    <section className="py-14 bg-background">
      <div className="container">

        {/* Section heading */}
        {/* <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-primary tracking-wide"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Our Alumni
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="block w-12 h-px bg-accent" />
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            <span className="block w-12 h-px bg-accent" />
          </div>
          <p className="text-muted-foreground text-sm mt-4 max-w-xl mx-auto leading-relaxed">
            Our alumni have gone on to achieve remarkable success across diverse fields —
            a true reflection of the values and education imparted at Alok Institution.
          </p>
        </div> */}

        {/* Empty state */}
        {alumni.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm">No alumni profiles available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {alumni.map((a) => <AlumniCard key={a._id} a={a} />)}
          </div>
        )}

      </div>
    </section>
  );
}
