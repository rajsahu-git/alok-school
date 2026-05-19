import Image from "next/image";
import PageHero from "@/core/widgets/shared/PageHero";

const ADMINS = [
  {
    name: "Mr. Manoj Kumawat",
    role: "Administrator",
    image: "/manoj_new.png",
    quote:
      '"Alok Institution believes that the school has the most important role in shaping human potential. A modern school must, therefore act as a light house of society, providing meaningful education, spiritual direction, guidance and leadership traits to students."',
  },
  {
    name: "Mr. Dhruv Kumawat",
    role: "Associate Administrator",
    image: "/dhruv.png",
    quote:
      'At Alok, along with good education we also teach students the values and ethics which helps in overall growth of a student because there are 2 educations, one teaches us "how to make a living" and the other "how to live" & we focus on both.',
  },
];

function Administrator() {
  return (
    <div>
      <PageHero
        title="Administrator"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about-us" },
          { label: "Administrator" },
        ]}
      />

      <section className="py-16 bg-background">
        <div className="container">

          {/* Heading */}
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold text-primary"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Our Administrator
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="block w-12 h-px bg-accent" />
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              <span className="block w-12 h-px bg-accent" />
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {ADMINS.map((admin) => (
              <div
                key={admin.name}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col"
              >
                {/* Image area with secondary bg */}
                <div className="bg-secondary flex justify-center pt-10 pb-6 px-8">
                  <div className="relative w-48 h-60 rounded-xl overflow-hidden shadow-lg border-4 border-white">
                    <img
                      src={admin.image}
                      alt={admin.name}
                      
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                {/* Accent line */}
                <div className="h-1 w-full bg-primary" />

                {/* Content */}
                <div className="flex flex-col gap-5 p-7 flex-1">
                  {/* Quote mark */}
                  <svg className="w-8 h-8 text-accent opacity-60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-justify">
                    {admin.quote}
                  </p>

                  {/* Divider */}
                  <div className="w-12 h-0.5 bg-accent rounded-full" />

                  {/* Name + Role */}
                  <div className="flex flex-wrap gap-3 mt-auto">
                    <span
                      className="px-5 py-2 rounded-full text-xs font-bold tracking-widest text-white uppercase"
                      style={{ backgroundColor: "#7c3aed" }}
                    >
                      {admin.name}
                    </span>
                    <span
                      className="px-5 py-2 rounded-full text-xs font-bold tracking-widest text-white uppercase"
                      style={{ backgroundColor: "#059669" }}
                    >
                      {admin.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}

export default Administrator;
