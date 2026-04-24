import React from "react";
import Image from "next/image";
import Link from "next/link";

const images = [
  {
    src: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053861/IMG-20260122-WA0020_kl1rqe.jpg",
    alt: "Cultural Dance Performance",
    tall: true,
  },
  {
    src: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/IMG-20260122-WA0021_ud2n5r.jpg",
    alt: "Students Playing Sports",
    tall: false,
  },
  {
    src: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053861/1000227993_981863f509043ff2e07b9dc4970ad896-7_3_2026_10_18_06_pm_tbpnqc.jpg",
    alt: "Academic Excellence Award",
    tall: false,
  },
  {
    src: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/unnamed_1_zsknt1.webp",
    alt: "Library & Study Area",
    tall: true,
  },
  {
    src: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/1000228002_702927b04699c8c9175768120d5645f5-27_2_2026_6_45_48_pm_skmcqn.jpg",
    alt: "Science Laboratory",
    tall: false,
  },
  {
    src: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053862/1000271794_75b19fed4ec27a229461118b059b7e56-7_3_2026_10_55_52_pm_errw5c.png",
    alt: "Art & Creativity",
    tall: false,
  },
];

const AlokGalllery = () => {
  return (
    <section className="bg-background py-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            Our Gallery
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Glimpses of vibrant campus life, cultural celebrations, and academic excellence.
          </p>
        </div>

        {/* Grid — 3 columns, rows use row-span for masonry feel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[220px]">

          {/* Col 1 — tall top, short bottom */}
          <div className="row-span-2 rounded-2xl overflow-hidden relative group">
            <Image src={images[0].src} alt={images[0].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:1024px) 50vw, 33vw" />
          </div>
          <div className="row-span-1 rounded-2xl overflow-hidden relative group">
            <Image src={images[4].src} alt={images[4].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:1024px) 50vw, 33vw" />
          </div>

          {/* Col 3 top — tall */}
          <div className="row-span-2 rounded-2xl overflow-hidden relative group">
            <Image src={images[3].src} alt={images[3].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:1024px) 50vw, 33vw" />
          </div>

          {/* Col 2 bottom */}
          <div className="row-span-1 rounded-2xl overflow-hidden relative group">
            <Image src={images[1].src} alt={images[1].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:1024px) 50vw, 33vw" />
          </div>

          {/* Col 1 bottom */}
          <div className="row-span-1 rounded-2xl overflow-hidden relative group">
            <Image src={images[2].src} alt={images[2].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:1024px) 50vw, 33vw" />
          </div>

          {/* Col 3 bottom */}
          <div className="row-span-1 rounded-2xl overflow-hidden relative group">
            <Image src={images[5].src} alt={images[5].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:1024px) 50vw, 33vw" />
          </div>

        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 rounded-full text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
          >
            Explore Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AlokGalllery;
