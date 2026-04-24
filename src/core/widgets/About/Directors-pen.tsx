import Image from "next/image";

const DirectorsPen = () => {
  return (
    <section className="bg-background py-16">
      <div className="container">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12 tracking-wide font-serif">
          Director&apos;s Pen
        </h2>

        {/* Main card: name + quote left, image right */}
        <div className="flex flex-col lg:flex-row gap-10 mb-10">

          {/* Left */}
          <div className="w-full lg:w-[55%]">
            {/* Name badge */}
            <div className="inline-block bg-[#7c5cbf] text-white text-sm font-semibold px-5 py-2 rounded-lg mb-6">
              Dr. Pradeep Kumawat
            </div>

            {/* Quote */}
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify mb-5">
              &ldquo;We believe that{" "}
              <span className="text-primary font-semibold">&lsquo;ignited young minds&rsquo;</span>{" "}
              charged with eternal values of India is the resource the country needs today to
              build a better tomorrow and this is our guiding thought at Alok Institution.&rdquo;
            </p>

            <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify">
              We see the school and our people, as a larger community we have a responsibility
              to the world around us. The Alok Institution prides itself of its infrastructure
              capability to bring about the change in all stages of school education.
            </p>
          </div>

          {/* Right: image */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
            <div className="rounded-2xl overflow-hidden shadow-md border border-border w-full max-w-sm">
              <Image
                src="https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png"
                alt="Dr. Pradeep Kumawat - Director"
                width={480}
                height={380}
                className="w-full h-64 md:h-72 object-cover object-top grayscale"
              />
            </div>
          </div>

        </div>

        {/* Full-width paragraphs */}
        <div className="space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
          <p>
            Alok Institution is an Institution that encourages community living, in which
            teachers are friends, philosophers and guides.
          </p>
          <p>
            Alok Institution is a place where living, learning and socializing are merged into
            one providing maximum exposure for interaction between the students and the faculty
            members.
          </p>
        </div>

      </div>
    </section>
  );
};

export default DirectorsPen;
