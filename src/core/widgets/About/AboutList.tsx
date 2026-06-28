import React from 'react'

const cards = [
  {
    title: "History",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    link: "#history",
  },
  {
    title: "Directors' Pen",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>
    ),
    link: "#directors-pen",
  },
  {
    title: "Principal's Pen",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
    link: "#principals-pen",
  },
  {
    title: "Our Administrator",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    link: "#administrator",
  },
  {
    title: "Our Alumni",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    link: "#alumni",
  },
  {
    title: "Vision & Mission",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    link: "#vision-mission",
  },
  {
    title: "Alok Kids",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M8 21v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" />
        <path d="M4 21v-4a2 2 0 0 1 2-2h2" />
        <path d="M16 21v-4a2 2 0 0 1 2-2h2" />
        <path d="M12 14v-2" />
        <circle cx="12" cy="8" r="2" />
      </svg>
    ),
    link: "#alok-kids",
  },
  {
    title: "WHY ALOK?",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    link: "#why-alok",
  },
]

function AboutList() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        {/* <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="block w-10 h-px bg-accent" />
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
              About Us
            </span>
            <span className="block w-10 h-px bg-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Discover Our Legacy
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            Explore our journey, values, and the people who make Alok Institution a place of excellence.
          </p>
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <a
              key={card.title}
              href={card.link}
              className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-accent mb-5 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                {card.icon}
              </div>
              <h3 className="text-sm font-bold tracking-[0.1em] text-primary">
                {card.title}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutList