"use client";

import { useState } from "react";

const contactItems = [
  {
    label: "Call Us",
    value: "+91941 4232523",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "Business Hours",
    value: "Mon - Sat 9 AM - 2 PM",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: "alokrajsamand@alokschool.org",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "Location",
    value: "New Shiv Nagar Colony Jawad By Pass Road\nRajsamand (Raj.) Pin Code-313342",
    icon: (
      <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  const displayAddress = 'Alok School Rajsamand';
 const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(displayAddress)}&output=embed`;
  return (
    <section className="bg-background py-16">
      <div className="container">

        {/* Page title */}
        <h1 className="text-3xl md:text-4xl font-bold text-primary text-center tracking-widest uppercase mb-12">
          Contact
        </h1>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">

          {/* Left: contact info */}
          <div>
            <h3 className="text-primary font-semibold text-lg mb-6">Contact us</h3>
            <ul className="space-y-6">
              {contactItems.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-0.5">{item.label}</p>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          <div>
            <h3 className="text-foreground font-semibold text-lg mb-6">Talk to a Human</h3>

            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-primary font-semibold">Message sent!</p>
                <p className="text-muted-foreground text-sm">We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Message"
                  required
                  rows={5}
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all duration-200"
                >
                  Send a message
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Google Map embed */}
        <div className="w-full rounded-2xl overflow-hidden shadow-md border border-border">
          <iframe
            title="Alok Institution Location"
            src={mapUrl}
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </section>
  );
};

export default Contact;
