import Link from "next/link";

interface Folder {
  _id: string;
  name: string;
  viewLink: string;
  coverImage?: string;
  createdAt: string;
}

export default function ImageGallery({ folders }: { folders: Folder[] }) {
  return (
    <section className="bg-background min-h-screen py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">Our Gallery</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Explore our collection of memories, events, and campus life.
          </p>
        </div>

        {folders.length === 0 && (
          <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">
            No folders found.
          </div>
        )}

        {folders.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {folders.map((folder) => (
              <Link
                key={folder._id}
                href={`/gallery/${folder._id}`}
                className="group rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {folder.coverImage ? (
                    <img
                      src={`/api/drive-image?id=${folder.coverImage.match(/[?&]id=([^&]+)/)?.[1]}`}
                      alt={folder.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      No cover
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="px-4 py-3">
                  <h3 className="font-semibold text-foreground capitalize truncate">{folder.name}</h3>
                  {/* <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(folder.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                  </p> */}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
