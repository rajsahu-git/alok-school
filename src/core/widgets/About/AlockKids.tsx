import Image from "next/image";
import PageHero from "@/core/widgets/shared/PageHero";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8M8 11h5" />
      </svg>
    ),
    title: "Language Development",
    desc: "It is important that children understand communication not just through speaking but also by using the body language and gestures.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
        <path d="M9.5 3.5A9 9 0 0 1 21 12" />
      </svg>
    ),
    title: "Knowledge Development",
    desc: "It is crucial that a child's learning, understanding, problem solving, reasoning and memory skills are enhanced through various activities.",
    featured: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Personal Awareness",
    desc: "Habits are formed in this stage. It is imperative that children learn not only about themselves but also develop independence, safety & hygiene.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Reading, Writing & Mathematics",
    desc: "Coupled with opportunities to enjoy and excel in the arts, physical education by family, friends and teachers. All the great things about our Kids Planet by Alok sporting and a modern English language.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Socio-Emotional Awareness",
    desc: "It is very important that children learn to build positive relationships with their Alok Institution. During the two years of pre-school education, children explore and understand the physical world around them through various play way methods. Special emphasis is laid on muscular development, co-ordination of hand and eye, control of limbs sensory perceptions and social skills.",
    featured: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <circle cx="12" cy="5" r="3" /><path d="M6.5 8a5.5 5.5 0 0 0 0 11h11a5.5 5.5 0 0 0 0-11" />
        <path d="M12 8v5m0 0-2-2m2 2 2-2" />
      </svg>
    ),
    title: "Physical Education Development",
    desc: "At the very early age the child should be able to use his or her hands not only to eat and dress but also to draw, play, write, be creative and inventive and in the process develop aesthetic skills. Developing simple skills how to sit, stand walk and run keep balance and change position.",
  },
];

function AlockKids() {
  return (
    <div className="bg-background">
      <PageHero
        title="Alok Kids"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Alok Kids" }]}
      />

      {/* ── Section 1: Hero intro ── */}
      <section className="py-14">
        <div className="container">

          {/* Tagline */}
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-accent">
              Together we can &quot;sow the seeds of success&quot;!
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mt-3 max-w-3xl mx-auto leading-relaxed">
              Every Child is Unique. One&apos;s goals and aspirations are different from another&apos;s.
              That&apos;s why we believe that it is important to reach out and give personalized
              attention to each child to make each one feel that she or he is the only one.
            </p>
          </div>

          {/* Two-col: text + circular image */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-10">
            <div>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify">
                At <strong className="text-foreground">Kids Planet</strong>: The classes adopt play way and
                activity-oriented approach with emphasis on the improvement of speaking, reading and
                writing skills. The program then detects flaws in the child&apos;s pronunciation of
                words during the course of the dialogue and prompts the child to correct the usage
                immediately, without which it won&apos;t respond to the child&apos;s innate curious questions.
                Thus the kids learn the science of accurate pronunciation effortlessly even when their
                counterparts are still grappling over mastery in speech. We want learning to be fun,
                and for every child to do the very best they can. We provide a broad and balanced
                education the highest academic expectations in:{" "}
                <strong className="text-foreground">
                  Audio visual learning, Play way learning, Developing Food habits
                </strong>
              </p>
            </div>

            {/* Circular collage image */}
            <div className="flex justify-center">
              <div className="relative w-72 h-72 md:w-80 md:h-80">
                {/* Decorative ring */}
                <div className="absolute -inset-3 rounded-full border-4 border-accent/30" />
                <div className="absolute -inset-6 rounded-full border-2 border-primary/10" />
                <div className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-card">
                  <img
                    src={`/api/drive-image?id=1cGCANb0h3wK5qa6y8ndl7kZqmbinDcOC`}
                    alt="Alok Kids Planet"
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                    style={{ display: "block" }}
                  />
                </div>
                {/* Label badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wider whitespace-nowrap">
                  ALOK KIDS PLANET
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Features grid ── */}
      <section className="py-14 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className={`rounded-2xl p-7 flex flex-col gap-4 shadow-sm border border-border transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                  f.featured ? "bg-secondary" : "bg-card"
                }`}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AlockKids;
