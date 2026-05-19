import Image from 'next/image'
import React from 'react'

function Principals_pen() {
  return (
    <section className="bg-background py-16">
      <div className="container">

        {/* Heading */}


        {/* Main card: name + quote left, image right */}
        <div className="flex flex-col lg:flex-row gap-10 mb-10">

          {/* Left */}
          <div className="w-full lg:w-[55%]">
            {/* Name badge */}
            <div className="inline-block bg-[#7c5cbf] text-white text-sm font-semibold px-5 py-2 rounded-lg mb-6">
             Mr. Lalit Goswami
            </div>

            {/* Quote */}
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify mb-5">
              {/* &ldquo;We believe that{" "} */}
              {/* <span className="text-primary font-semibold">&lsquo;ignited young minds&rsquo;</span>{" "} */}
           “The people of fine character live by their values. They are honest and are committed to truthfulness, word and deed. Alok is committed & has sole aim  to mould such future citizens ”  said by  Founder Chairman , Alok Institution Shri Shyamlal Kumawat .
            </p>

            <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify">
Our school is oriented to the total formation of a child and to adaptations of various methods suiting the dynamics of changing world in order to achieve common goals and objectives. It is further characterized by sharing vision, responsibility and above all love and faith in goal in order to achieve it.
            </p>
          </div>

          {/* Right: image */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
            <div className="rounded-2xl overflow-hidden shadow-md border border-border w-full max-w-sm">
              <img
                src={`/PRINCIPAL-SIR.png`}
                
                alt="Lalit kuamr"
   
                className="w-full object-cover object-top "
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
  )
}

export default Principals_pen