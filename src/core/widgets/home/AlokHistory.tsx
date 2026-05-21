"use client";
import React from "react";
import Image from "next/image";

const AlokHistory = () => {
  return (
    <section className="bg-background py-16 ">
      <div className="container  mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Image */}
          <div className="w-full lg:w-[45%] flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden border-2 border-accent/40 shadow-lg">
              <Image
                src="https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png"
                alt="Shri Shyamlal Kumawat - Founder Chairman"
                width={560}
                height={640}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Gold corner accent */}
              <span className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-accent rounded-tl-lg" />
              <span className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-accent rounded-br-lg" />
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-[55%]">
            {/* Label */}
            <div className="flex items-center gap-3 mb-3">
              <span className="block w-8 h-px bg-accent" />
              <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
                Our Legacy
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 leading-tight">
              Origin &amp; History
            </h2>

            {/* Sanskrit quote */}
            <blockquote className="border-l-4 border-accent pl-4 mb-6">
              <p className="text-accent font-semibold text-base md:text-lg italic leading-relaxed">
                &ldquo;ॐ आदित्यागम् पूर्णसुखाभिरामम् समस्तसाक्षिम् तमसः परस्तात्।&rdquo;
              </p>
            </blockquote>

            {/* Body text */}
            <div className="space-y-4 text-foreground/75 text-base md:text-lg leading-relaxed mb-8">
              <p>
                The founder-chairman Shri Shyamlal Kumawat laid the foundation of Alok
                Institution on 29th June 1967 at Panchwati to make a purposeful contribution
                to society by providing valuable educational services to the student fraternity.
              </p>
              <p>
                The Institution was initiated under the aegis of Rashtriya Shiksha Samiti,
                Udaipur and has grown with a vision that created one of the greatest educational
                places in the history of school education. With the blessings of almighty God,
                the visionary Shri Shyamlal Kumawat started from a humble beginning with only
                111 students and a handful of faculty.
              </p>
            </div>

            {/* CTA */}
            <a
              href="/history"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors duration-200"
            >
              Read Full History
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

/* ── Kids Planet promo strip ── */
const AlokKidsPlanet = () => {
  return (
    <section className="bg-secondary py-14">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left — text */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold text-primary leading-snug mb-5">
              Together we can &ldquo;sow the seeds of success&rdquo;!
            </h2>
            <p className="text-foreground/75 text-base md:text-lg leading-relaxed mb-8 text-justify">
              Every Child is Unique. One&rsquo;s goals and aspirations are different from
              another&rsquo;s. That&rsquo;s why we believe that it is important to reach out
              and give personalized attention to each child to make each one feel that she or
              he is the only..
            </p>
            <a
              href="/kids-planet"
              className="inline-flex items-center gap-3 border-2 border-primary text-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            >
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:text-foreground flex-shrink-0">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              Read more
            </a>
          </div>

          {/* Right — image collage */}
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/unnamed_1_zsknt1.webp"
                alt="Alok Kids Planet"
                width={640}
                height={420}
                className="w-full h-auto object-cover"
              />
              {/* Label overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-4 py-2">
                <span className="text-white text-sm font-bold tracking-widest uppercase">
                  Alok Kids Planet
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export { AlokKidsPlanet };
export default AlokHistory;
