interface AchievementItem {
  _id: string;
  image: { fileId: string; viewLink: string; directLink: string };
  createdAt: string;
}

export default function Achievement({ achievements }: { achievements: AchievementItem[] }) {
  return (
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
            Celebrating the milestones and accomplishments of our students and institution.
          </p>
        </div>

        {/* Grid */}
        {achievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <p className="text-sm">No achievements to display yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((a) => (
              <div key={a._id}
                className="rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow duration-300 bg-card">
                <img
                  src={`/api/drive-image?id=${a.image.fileId}`}
                  alt="Achievement"
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
