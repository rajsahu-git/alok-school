import React from "react";
import Link from "next/link";

const quickLinks = [
  { label: "Online Admission", href: "/admission" },
  { label: "Fee Structure", href: "/admission/fee-structure" },
  { label: "Rules & Regulations", href: "/admission/rules" },
  { label: "Transfer Certificate", href: "/online/tc" },
  { label: "Alumni Registration", href: "/online/alumni" },
  { label: "School Uniform", href: "/online/uniform" },
  { label: "Career", href: "/career" },
];

const exploreLinks = [
  { label: "Origin & History", href: "/about-us/origin" },
  { label: "Vision & Mission", href: "/about-us/vision-mission" },
  { label: "Infrastructure", href: "/infrastructure/facilities" },
  { label: "Transport", href: "/infrastructure/transport" },
  { label: "Library", href: "/infrastructure/library" },
  { label: "Lab", href: "/infrastructure/lab" },
  { label: "Activities", href: "/activities" },
  { label: "Image Gallery", href: "/gallery/images" },
];

const Footer = () => {
  return (
    <footer>
      {/* Top accent line */}
      <div className="h-1 bg-primary" />

      {/* Main footer body */}
      <div className="bg-secondary py-14">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* ── Col 1: Brand + About ── */}
            <div className="flex flex-col gap-4">
              <img
                src="https://rajsamand.alokschool.org/wp-content/uploads/2021/06/alokh-logo.png"
                alt="Alok School"
                className="w-36"
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Alok Institution is committed to providing quality education that nurtures young minds and shapes future leaders with values, knowledge, and skills.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-4 mt-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
                  </svg>
                </a>
              </div>
            </div>

            {/* ── Col 2: Quick Links ── */}
            <div>
              <h4 className="text-foreground font-bold text-sm uppercase tracking-widest mb-5 pb-2 border-b border-border">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    <Link href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 3: Explore ── */}
            <div>
              <h4 className="text-foreground font-bold text-sm uppercase tracking-widest mb-5 pb-2 border-b border-border">
                Explore
              </h4>
              <ul className="space-y-2.5">
                {exploreLinks.map((link) => (
                  <li key={link.href} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    <Link href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 4: Contact ── */}
            <div>
              <h4 className="text-foreground font-bold text-sm uppercase tracking-widest mb-5 pb-2 border-b border-border">
                Contact Us
              </h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-0.5">Call Us</p>
                    <p className="text-sm text-muted-foreground">+02952 224225</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-0.5">Email</p>
                    <p className="text-sm text-muted-foreground">alokrajsamand@alokschool.org</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-0.5">Location</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      New Shiv Nagar Colony,<br />Jawad Bypass Road,<br />Rajsamand (Raj.)
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="bg-primary py-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-primary-foreground text-xs">
            © {new Date().getFullYear()} Alok Institution. All rights reserved.
          </p>
          <p className="text-primary-foreground text-xs">
            Developed By : Site Creation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
