import PageHero from "@/core/widgets/shared/PageHero";

const MISSION_IMG = "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/unnamed_1_zsknt1.webp";
const VISION_IMG  = "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/IMG-20260122-WA0035_xvxdyb.jpg";

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 mb-10">
      <h2
        className="text-2xl md:text-3xl font-bold text-primary"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {label}
      </h2>
      <div className="flex items-center gap-3">
        <span className="block w-10 h-px bg-accent" />
        <span className="w-2 h-2 rounded-full bg-accent inline-block" />
        <span className="block w-10 h-px bg-accent" />
      </div>
    </div>
  );
}

export default function VisionMission() {
  return (
    <div className="bg-background">
      <PageHero
        title="Vision & Mission"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about-us" },
          { label: "Vision & Mission" },
        ]}
      />

      <section className="py-14">
        <div className="container flex flex-col gap-16">

          {/* ── Intro ── */}
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              We respect the environment — everything it does and eco-friendly work culture
              practices. Students learn Green, energy-saving practices and create awareness all
              over the society through a league of social service and environmental awareness.
              The message is taken to every home, local community and beyond. This is quite in
              tune with the needs and requirements of today's advanced education system world
              over. Our Institution's academic and non-academic initiatives have already been
              accredited by the state and nation.
            </p>
          </div>

          {/* ── Our Mission ── */}
          <div className="flex flex-col gap-10">
            <SectionDivider label="Our Mission" />
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

              {/* Text */}
              <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <div className="w-12 h-1 bg-primary rounded-full" />
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify">
                  Alok envisions a society where Indian values are the foundation stones of the
                  pillars of tomorrow. Our value-based approach to human development makes us
                  stand apart from the crowd. We believe and follow that instead of cutthroat
                  competition, the need of the hour is to join hands and make a bridge for
                  everyone. And this is how leaders are made.
                </p>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify">
                  Our mission is to nurture young minds with knowledge, character and
                  compassion — preparing them to be responsible citizens who contribute
                  meaningfully to society and the nation.
                </p>
                {/* Highlight box */}
                <div className="border-l-4 border-primary bg-secondary rounded-r-xl px-5 py-4 mt-2">
                  <p className="text-sm font-semibold text-primary italic">
                    "Igniting young minds with eternal values of India to build a better tomorrow."
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border aspect-video">
                  <img
                    src={MISSION_IMG}
                    alt="Our Mission"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-5">
                    <span className="text-white text-xl font-bold tracking-widest uppercase">
                      Mission
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* ── Our Vision ── */}
          <div className="flex flex-col gap-10">
            <SectionDivider label="Our Vision" />
            <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-12">

              {/* Text */}
              <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <div className="w-12 h-1 bg-accent rounded-full" />
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify">
                  Our vision is to provide an excellent learning environment to students where
                  they can excel in their respective interest zone, identify their own potential
                  and accelerate the same.
                </p>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify">
                  We strive to be a globally recognised institution that blends the richness of
                  Indian heritage with modern educational practices — producing well-rounded
                  individuals who are academically excellent, morally upright and socially
                  responsible.
                </p>
                {/* Highlight box */}
                <div className="border-l-4 border-accent bg-secondary rounded-r-xl px-5 py-4 mt-2">
                  <p className="text-sm font-semibold text-accent-foreground italic">
                    "To be a beacon of excellence — shaping future leaders who serve humanity with integrity."
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border aspect-video">
                  <img
                    src={VISION_IMG}
                    alt="Our Vision"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-5">
                    <span className="text-white text-xl font-bold tracking-widest uppercase">
                      Vision
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Core Values ── */}
          <div className="flex flex-col gap-8">
            <SectionDivider label="Our Core Values" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: "🎓", title: "Academic Excellence", desc: "Fostering a culture of curiosity, critical thinking and lifelong learning." },
                { icon: "🤝", title: "Integrity",           desc: "Building character through honesty, transparency and ethical conduct." },
                { icon: "🌱", title: "Sustainability",      desc: "Instilling eco-consciousness and responsibility towards the environment." },
                { icon: "🌍", title: "Global Outlook",      desc: "Preparing students to thrive in a diverse and interconnected world." },
              ].map((v) => (
                <div key={v.title} className="bg-card rounded-xl border border-border p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
                  <span className="text-3xl">{v.icon}</span>
                  <h4 className="text-sm font-bold text-foreground">{v.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
