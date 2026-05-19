import PageHero from "@/core/widgets/shared/PageHero";

const LIBRARY_SECTIONS = [
  {
    title: "Library Collection",
    image: "/library.jpg",
    description:
      "The library at Alok School houses a vast collection of books, journals, and digital resources catering to diverse academic needs and interests. From textbooks and reference materials to fiction and non-fiction literature, our library provides students with access to knowledge across various subjects and disciplines. Regular updates ensure the collection remains current and relevant to the curriculum and student interests.",
  },
  {
    title: "Reading Spaces",
    image: "/art_room.jpg",
    description:
      "Our library features comfortable and well-lit reading areas designed to encourage focused study and leisurely reading. With individual study carrels, group discussion tables, and cozy reading corners, students can choose the environment that best suits their learning style. The peaceful atmosphere promotes concentration and helps students develop effective study habits.",
  },
  {
    title: "Digital Resources",
    image: "/computer_lab.jpg",
    description:
      "Alok School's library embraces technology with access to e-books, online databases, and educational software. Students can conduct research, access scholarly articles, and utilize digital learning tools through our computer stations and Wi-Fi connectivity. The digital resources complement our physical collection and prepare students for the information-driven world.",
  },
];

export default function Library() {
  return (
    <div>
      <PageHero
        title="Library"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Infrastructure", href: "/infrastructure" },
          { label: "Library" },
        ]}
      />

      <section className="py-14 bg-background">
        <div className="container flex flex-col gap-16">

          {/* Section heading */}
          <div className="text-center">

            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="block w-12 h-px bg-accent" />
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              <span className="block w-12 h-px bg-accent" />
            </div>
            <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
              Alok School's library is a hub of knowledge and learning, providing students with
              resources to support their academic journey and foster a love for reading.
            </p>
          </div>

          {/* Library sections — alternating layout */}
          {LIBRARY_SECTIONS.map((section, i) => (
            <div
              key={section.title}
              className={`flex flex-col lg:flex-row gap-10 items-center ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2 flex-shrink-0">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full object-cover aspect-[4/3]"
                  />
                  {/* Accent badge */}
                  
                </div>
              </div>

              {/* Text */}
              <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <h3
                  className="text-xl md:text-2xl font-bold text-foreground"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {section.title}
                </h3>
                <div className="w-12 h-1 bg-primary rounded-full" />
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-justify">
                  {section.description}
                </p>
              </div>
            </div>
          ))}

        </div>
      </section>
    </div>
  );
}