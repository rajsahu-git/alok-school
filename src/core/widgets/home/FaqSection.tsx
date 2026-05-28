"use client";

import { useState } from "react";
import Image from "next/image";

const faqs = [
  {
    q: "What makes Alok Sansthan a good choice for English-medium education?",
    a: "Alok Sansthan offers English-medium education with a focus on reading, writing and communication skills. Following CBSE curricula, it provides a balanced academic foundation with supportive teachers and practical teaching methods, making it a trusted choice.",
  },
  {
    q: "Why is Alok Sansthan considered a top performing school in Rajsamand?",
    a: "The school consistently delivers excellent academic results, reflecting its commitment to quality education, structured learning, and strong academic guidance.",
  },
  {
    q: "Which syllabus does the school follow (CBSE / RBSE)?",
    a: "Alok Sansthan follows the CBSE (Central Board of Secondary Education) syllabus from Pre-Primary through Senior Secondary classes.",
  },
  {
    q: "Up to which classes does Alok Sansthan provide education?",
    a: "We provide education from Nursery (Pre-Primary) all the way up to Class XII (Senior Secondary), covering all major streams.",
  },
  {
    q: "What facilities are available to support overall student development?",
    a: "The school provides modern classrooms, well-equipped labs, a library, playgrounds, and dedicated spaces for arts and activities, creating a balanced environment for academic and overall growth.",
  },
  {
    q: "How can I apply for admission at Alok Sansthan?",
    a: "You can apply online through our website's Admission section or visit the school office directly. Our team will guide you through the process.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-14 bg-white">
      <div className="container">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* LEFT — Accordion */}
          <div className="flex-1 space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-primary font-bold text-base w-6 shrink-0">{i + 1}</span>
                    <span className="flex-1 text-base md:text-lg font-medium text-foreground leading-snug">
                      {faq.q}
                    </span>
                    <span className="text-primary font-bold text-xl shrink-0 leading-none">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-0 border-t border-gray-100">
                      <p className="text-base text-foreground/75 leading-relaxed pl-10">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>


        </div>
      </div>
    </section>
  );
}
