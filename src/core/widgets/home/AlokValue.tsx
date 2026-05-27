import React from "react";

const values = [
  {
    title: "SHIKSHA",
    description:
      "Since our establishment, our ideology and philosophy has remained closely aligned with the progressive vision of modern education.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
        <path d="M6 12v5c3.33 1.67 8.67 1.67 12 0v-5" />
      </svg>
    ),
  },
  {
    title: "SANSKAR",
    description:
      "Our core strength lies in inculcating positive values among students, teaching through righteous actions rather than mere preaching.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: "SANSKRITI",
    description:
      "Known as an ambassador of rich cultural heritage, seamlessly weaving major cultural lessons into our comprehensive curriculum.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: "INDIAN VALUES",
    description:
      "We hold true that morality, ethics, and mutual respect constitute the very foundation that must be preserved at any cost.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <line x1="3" y1="22" x2="21" y2="22" />
        <line x1="6" y1="18" x2="6" y2="11" />
        <line x1="10" y1="18" x2="10" y2="11" />
        <line x1="14" y1="18" x2="14" y2="11" />
        <line x1="18" y1="18" x2="18" y2="11" />
        <polygon points="12 2 20 7 4 7" />
      </svg>
    ),
  },
  {
    title: "DISCIPLINE",
    description:
      "Mastering discipline starts at school. We believe continuous disciplined living from childhood ensures unparalleled success.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
        <path d="M8 12h8" />
        <path d="M7 17l2-2M17 17l-2-2" />
      </svg>
    ),
  },
  {
    title: "SERVICE",
    description:
      "Service learning holds a special place in our curriculum, nurturing profound empathy and a sense of responsibility.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
];

const AlokValue = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="block w-10 h-px bg-accent" />
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
              Our Philosophy
            </span>
            <span className="block w-10 h-px bg-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Shaping Confident leaders for tomorrow 
          </h2>
          <p className="text-foreground/70 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
            Rooted in rich Indian heritage, we cultivate future leaders through a holistic
            approach to education, integrating timeless values with modern learning.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((item) => (
          <div
            key={item.title}
            className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
          >
            {/* Icon circle */}
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-accent mb-5">
              {item.icon}
            </div>

            <h3 className="text-base font-bold tracking-[0.15em] text-primary mb-3">
              {item.title}
            </h3>
            <p className="text-foreground/75 text-base leading-relaxed">{item.description}</p>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
};

export default AlokValue;
