import Image from "next/image";

const milestones = [
  { year: "1967", label: "Foundation", desc: "Established at Panchwati, Udaipur with 111 students." },
  { year: "1976", label: "2nd Branch", desc: "Hiran Magri, Sector-11 — sky-high ideals, committed to excellence." },
  { year: "1984", label: "3rd Branch", desc: "Fathepura, Udaipur — expanding the vision across the region." },
  { year: "2001", label: "4th Branch", desc: "Rajsamand district — serving a wider student community." },
];

const Origin = () => {
  return (
    <div>

      {/* ── Part 1: About the Institution ── */}
      <section className="bg-background py-16">
        <div className="container">

          {/* Heading */}
          <div className="mb-12">
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">About the Institution</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-1">
              <span className="text-foreground">Alok </span>
              <span className="text-primary">Sansthan</span>
            </h2>
            <div className="w-16 h-1 bg-primary rounded mt-3" />
          </div>

          {/* Two-col: image + intro text */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-14">
            <div className="relative">
              <img
                src="/acharya ji.png"
                alt="Alok Institution Building"
               
                className="w-full h-auto object-cover rounded-3xl shadow-lg"
                
              />
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-4 bg-primary text-primary-foreground rounded-2xl px-5 py-3 shadow-xl">
                <p className="text-2xl font-bold leading-none">55+</p>
                <p className="text-xs mt-0.5 text-white/80">Years of Excellence</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify mb-6">
                Shri Shyamlal Kumawat started from a humble beginning with only 111 students
                and a handful of faculty with limited accessories at a place called Panchwati
                in city of Udaipur, Rajasthan. Leading through the path of progress this
                institution opened another branch in July 1976 at Hiran Magri, sector-11 with
                the sky high ideals and committed to excellence, now it has taken the shape of
                a vibrant, dynamic and responsible institution in Rajasthan.
              </p>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify">
                Today, Alok institution stands apart and well above the rest on a distinguished
                platform, as an epitome of success — justifiably rated among the best
                institutions of Rajasthan offering highly effective, result-oriented school
                education at all levels.
              </p>
            </div>
          </div>

          {/* Timeline milestones */}
          <div className="relative">
            {/* Horizontal line */}
            <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-border z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {milestones.map((m, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  {/* Dot */}
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm z-10 mb-3 shadow-md">
                    {m.year}
                  </div>
                  <p className="font-bold text-foreground text-sm mb-1">{m.label}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom paragraph */}
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify mt-12">
            It has a proud 55-year tradition of excellence in serving &amp; guiding students
            in fulfilling their dream to build bright careers. Since its beginning, its
            objective is to enable each student to be an excellent youth for the nation with
            moral values and superior character, and to achieve success in learning &amp;
            knowledge with overall development of children through education.
          </p>

        </div>
      </section>

      {/* ── Wave ── */}
      <div className="bg-background leading-none -mb-px">
        <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
          <path
            d="M0,35 C180,70 360,0 540,35 C720,70 900,0 1080,35 C1260,70 1380,10 1440,35 L1440,70 L0,70 Z"
            fill="var(--primary)"
          />
        </svg>
      </div>

      {/* ── Part 2: Founder ── */}
      <section className="bg-primary py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: content */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-8 h-px bg-accent" />
                <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">Founder</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-6 leading-snug">
                Late. Shri Shyamlal Kumawat
              </h2>

              {/* Quote block */}
              <blockquote className="border-l-4 border-accent pl-5 mb-6">
                <p className="text-accent italic text-sm md:text-base font-medium leading-relaxed">
                  &ldquo;Education is not just about academics — it is about shaping character,
                  values, and the future of our nation.&rdquo;
                </p>
              </blockquote>

              <p className="text-white/75 text-sm md:text-base leading-relaxed text-justify mb-5">
                The founder-chairman Shri Shyamlal Kumawat laid the foundation of Alok
                Institution on 29th June 1967 at Panchwati to make a purposeful contribution
                to society by providing valuable educational services to the student fraternity.
              </p>
              <p className="text-white/75 text-sm md:text-base leading-relaxed text-justify">
                The Institution was initiated under the aegis of Rashtriya Shiksha Samiti,
                Udaipur and has grown with a vision that created one of the greatest educational
                places in the history of school education of Rajasthan.
              </p>
            </div>

            {/* Right: image with decorative ring */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative ring */}
                <div className="absolute -inset-3 rounded-3xl border-2 border-accent/30" />
                <div className="absolute -inset-6 rounded-3xl border border-accent/15" />
                <img
                   src="/acharya ji.png"
                  alt="Late. Shri Shyamlal Kumawat"
                  width={380}
                  height={460}
                  className="relative w-64 md:w-80 h-auto object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Origin;
