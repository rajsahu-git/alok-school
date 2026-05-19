"use client";

import { useState } from "react";
import PageHero from "@/core/widgets/shared/PageHero";

const LABS = [
  {
    title: "Chemistry Lab",
    image: "/chemistry.jpg",
    description:
      "The Chemistry Lab at Alok School is a fully equipped, safe, and modern facility where students explore the fascinating world of chemical reactions, compounds, and scientific principles. With well-stocked reagent shelves, modern apparatus, and proper safety equipment, students conduct experiments that bring textbook concepts to life. Under expert supervision, learners develop analytical thinking, precision, and a deep appreciation for the science that shapes our world.",
  },
  {
    title: "Physics Lab",
    image: "/physics_lab.jpg",
    description:
      "Our Physics Lab provides students with hands-on experience in understanding the fundamental laws of nature. Equipped with instruments for optics, mechanics, electricity, and magnetism experiments, the lab enables students to verify theoretical concepts through practical investigation. The well-designed workspace encourages curiosity and scientific inquiry, helping students build a strong foundation for higher studies in science and engineering.",
  },
  {
    title: "Computer Lab",
    image: "/computer_lab.jpg",
    description:
      "The Computer Lab at Alok School is a state-of-the-art facility equipped with the latest hardware and software to prepare students for the digital age. With high-speed internet connectivity and modern workstations, students learn programming, digital literacy, and essential computer skills. The lab supports curriculum-based learning as well as coding clubs and technology projects that nurture future innovators and tech leaders.",
  },
  {
    title: "Biology Lab",
    image: "/biolgy-lab1.jpg",
    description:
      "The Biology Lab offers students an immersive learning environment to explore the living world through observation and experimentation. Equipped with microscopes, specimens, models, and dissection tools, students study cells, tissues, organisms, and ecosystems up close. The lab fosters scientific curiosity and a deeper understanding of life sciences, inspiring students to pursue careers in medicine, biotechnology, and environmental science.",
  },
  {
    title: "Jr. Computer Lab",
    image: "/jr.-computer-lab-scaled.jpg",
    description:
      "The Junior Computer Lab is specially designed for younger students to take their first steps into the world of technology in a fun and engaging environment. With age-appropriate software, educational games, and guided activities, students develop basic computer skills, digital awareness, and logical thinking from an early age. The lab ensures that every student at Alok School is digitally empowered right from the beginning of their academic journey.",
  },
];

export default function Lab() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div>
      <PageHero
        title="Labs"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Infrastructure", href: "/infrastructure" },
          { label: "Labs" },
        ]}
      />

      <section className="py-14 bg-background">
        <div className="container flex flex-col gap-16">

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary" style={{ fontFamily: "Georgia, serif" }}>
              Our Laboratories
            </h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="block w-12 h-px bg-accent" />
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              <span className="block w-12 h-px bg-accent" />
            </div>
            <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
              Our well-equipped laboratories provide students with hands-on learning experiences that bridge
              theory and practice across science and technology.
            </p>
          </div>

          {/* Labs — alternating layout */}
          {LABS.map((lab, i) => (
            <div
              key={lab.title}
              className={`flex flex-col lg:flex-row gap-10 items-center ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Image — clickable */}
              <div className="w-full lg:w-1/2 flex-shrink-0">
                <div
                  className="relative rounded-2xl overflow-hidden shadow-lg border border-border cursor-zoom-in group"
                  onClick={() => setLightbox(lab.image)}
                >
                  <img
                    src={lab.image}
                    alt={lab.title}
                    className="w-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Number badge */}
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {/* Zoom hint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <h3 className="text-xl md:text-2xl font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>
                  {lab.title}
                </h3>
                <div className="w-12 h-1 bg-primary rounded-full" />
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-justify">
                  {lab.description}
                </p>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightbox}
            alt="Lab"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
