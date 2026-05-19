import PageHero from "@/core/widgets/shared/PageHero";

const FACILITIES = [
  {
    title: "Assembly Hall",
    image: "/Assembly Hall.jpg",
    description:
      "The Assembly Hall at Alok School is the heart of our daily school life. Every morning, students and teachers gather here to begin the day with prayers, motivational talks, and important announcements. The hall fosters a sense of unity, discipline, and shared purpose among the entire school community. It is also used for special ceremonies, award functions, and inter-house competitions that celebrate student achievements.",
  },
  {
    title: "Ground",
    image: "/ground.jpg",
    description:
      "Our expansive school ground provides students with ample space for physical activity, sports, and recreation. The well-maintained ground hosts cricket, football, athletics, and various outdoor games throughout the year. Regular sports periods and inter-school tournaments are conducted here, encouraging students to stay active, develop sportsmanship, and build physical fitness. The ground is a place where champions are made and lifelong memories are created.",
  },
  {
    title: "Parking",
    image: "/parking.jpg",
    description:
      "Alok School provides a spacious and well-organized parking facility for parents, staff, and visitors. The dedicated parking area ensures smooth traffic flow during school hours, especially during peak drop-off and pick-up times. With clearly marked zones and security supervision, the parking facility prioritizes the safety and convenience of everyone visiting the campus, making the school experience hassle-free for all.",
  },
  {
    title: "Art Room",
    image: "/art_room.jpg",
    description:
      "The Art Room at Alok School is a vibrant creative space where students explore their artistic talents and imagination. Equipped with all necessary art supplies, the room encourages students to experiment with painting, sketching, craft, and various art forms. Under the guidance of experienced art teachers, students develop fine motor skills, aesthetic sensibility, and creative thinking. The art room regularly produces stunning works that adorn the school's walls and exhibitions.",
  },
  {
    title: "Auditorium",
    image: "/auditorium.jpg",
    description:
      "The state-of-the-art Auditorium at Alok School is a world-class venue for cultural events, seminars, and performances. With modern acoustics, professional lighting, and comfortable seating, it provides the perfect stage for students to showcase their talents. From annual day celebrations and drama productions to guest lectures and inter-school competitions, the auditorium is the premier venue for all major school events that bring the community together.",
  },
  {
    title: "Exhibition Hall",
    image: "/exhibition_hall.jpg",
    description:
      "The Exhibition Hall serves as a dynamic showcase of student creativity, innovation, and academic excellence. Throughout the year, it hosts science exhibitions, art displays, project presentations, and cultural showcases that highlight the diverse talents of our students. The hall provides a platform for students to present their work to peers, parents, and distinguished guests, building confidence and communication skills while celebrating intellectual curiosity.",
  },
  {
    title: "Annual Function",
    image: "/annual_function.jpg",
    description:
      "The Annual Function is the most celebrated event in the Alok School calendar, bringing together students, parents, teachers, and dignitaries for a grand celebration of achievement and talent. The event features spectacular cultural performances, prize distribution ceremonies, and recognition of academic and co-curricular excellence. It is a proud occasion that reflects the school's commitment to holistic education and the all-round development of every student.",
  },
  {
    title: "Reception",
    image: "/reception.jpeg",
    description:
      "The Reception at Alok School is the welcoming face of our institution, designed to create a warm and professional first impression for all visitors. Staffed by courteous and knowledgeable personnel, the reception efficiently handles inquiries, admissions, and visitor management. The modern and well-organized reception area reflects the school's values of hospitality, professionalism, and commitment to providing excellent service to students, parents, and guests.",
  },
];

export default function Facilities() {
  return (
    <div>
      <PageHero
        title="Facilities"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Infrastructure", href: "/infrastructure" },
          { label: "Facilities" },
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
              Alok School is equipped with world-class facilities designed to provide students with the best
              possible environment for learning, growth, and overall development.
            </p>
          </div>

          {/* Facilities list — alternating layout */}
          {FACILITIES.map((facility, i) => (
            <div
              key={facility.title}
              className={`flex flex-col lg:flex-row gap-10 items-center ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2 flex-shrink-0">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border">
                  <img
                    src={facility.image}
                    alt={facility.title}
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
                  {facility.title}
                </h3>
                <div className="w-12 h-1 bg-primary rounded-full" />
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-justify">
                  {facility.description}
                </p>
              </div>
            </div>
          ))}

        </div>
      </section>
    </div>
  );
}
