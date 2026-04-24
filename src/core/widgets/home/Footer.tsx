import React from "react";
import Link from "next/link";

const quickLinks = [
  { label: "Online Admission", href: "/admission" },
  { label: "Examination Announcement", href: "/examination" },
  { label: "Fee Structure", href: "/fee-structure" },
  { label: "Transfer Certificate", href: "/transfer-certificate" },
  { label: "Career", href: "/career" },
  { label: "Mobile App", href: "/mobile-app" },
  { label: "Alumni Registration", href: "/alumni" },
];

const notifications = [
  {
    title: "UNIT TEST – II EXAMINATION TIME TABLE 2025-26",
    date: "Exam Date : 01 Aug 2025 - 07 Aug 2025",
    href: "/exam/unit-test-2",
  },
  {
    title: "UNIT TEST – I EXAMINATION TIME TABLE 2025-26",
    date: "Exam Date : 03 May 2025 - 10 May 2025",
    href: "/exam/unit-test-1",
  },
];

const Footer = () => {
  return (
    <footer>
      {/* Main footer body */}
      <div className="bg-background py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

            {/* ── Col 1: Contact ── */}
            <div>
              <h4 className="text-primary font-bold text-lg mb-5">Contact us</h4>
              <div className="space-y-5 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-0.5">Call Us</p>
                  <p className="text-muted-foreground">+02952 224225</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-0.5">Email</p>
                  <p className="text-muted-foreground">alokrajsamand@alokschool.org</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-0.5">Location</p>
                  <p className="text-muted-foreground leading-relaxed">
                    New Shiv Nagar Colony, Jawad Bypass Road,<br />
                    Rajsamand (Raj.)
                  </p>
                </div>
              </div>
            </div>

            {/* ── Col 2: Quick Links ── */}
            <div>
              <h4 className="text-primary font-bold text-lg mb-5">Quick Links</h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 3: Exam Notifications ── */}
            <div>
              <h4 className="text-primary font-bold text-lg mb-5">Exam Notification</h4>
              <div className="space-y-5">
                {notifications.map((n) => (
                  <div key={n.href} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <Link
                      href={n.href}
                      className="text-sm font-semibold text-primary hover:underline leading-snug block mb-1"
                    >
                      {n.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{n.date}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="bg-primary py-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Copyright */}
          <p className="text-primary-foreground text-xs">
            © Copyrights 2026 All rights reserved
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-5">
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-primary-foreground hover:text-accent transition-colors duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-primary-foreground hover:text-accent transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            {/* Twitter / X */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-primary-foreground hover:text-accent transition-colors duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.37 4.07 3.58 1.64.9a4.52 4.52 0 0 0-.61 2.27c0 1.57.8 2.95 2.01 3.76a4.5 4.5 0 0 1-2.05-.57v.06c0 2.19 1.56 4.02 3.63 4.43a4.55 4.55 0 0 1-2.04.08 4.53 4.53 0 0 0 4.23 3.14A9.07 9.07 0 0 1 0 19.54a12.8 12.8 0 0 0 6.92 2.03c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.17 9.17 0 0 0 23 3z" />
              </svg>
            </a>
          </div>

          {/* Credit */}
          <p className="text-primary-foreground text-xs">
            Developed By : Site Creation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
