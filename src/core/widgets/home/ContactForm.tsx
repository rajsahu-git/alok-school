"use client";

import React, { useState } from "react";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="bg-primary py-16">
      <div className="container">
        {/* Outer card with subtle border */}
        <div className="rounded-2xl border border-white/10 p-6 md:p-10">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">

            {/* ── Left: info ── */}
            <div className="w-full lg:w-[40%] text-primary-foreground">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Connected</h2>
              <p className="text-white/85 text-base md:text-lg leading-relaxed mb-10">
                Kindly fill the form for any query. Our dedicated team will respond promptly
                to ensure your journey with us is completely seamless.
              </p>

              {/* Phone */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-0.5">Call Us</p>
                  <p className="text-white font-semibold text-sm">+00952 224205</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-0.5">Email</p>
                  <p className="text-white font-semibold text-sm">admissions@alokschool.org</p>
                </div>
              </div>
            </div>

            {/* ── Right: form card ── */}
            <div className="w-full lg:w-[60%] bg-card rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-primary mb-6">Send us a message</h3>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-primary font-semibold text-lg">Message sent!</p>
                  <p className="text-muted-foreground text-sm">We&apos;ll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                        className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we assist you today?"
                      required
                      rows={5}
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all duration-200"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
