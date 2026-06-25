import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist or has moved.',
};

const quickLinks = [
  { label: 'Admission', href: '/admission' },
  { label: 'Academics', href: '/academic/team' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

export default function NotFound() {
  return (
    <section className="bg-background min-h-[70vh] flex items-center">
      <div className="container py-16 flex flex-col items-center text-center">
        <p className="text-7xl md:text-8xl font-extrabold text-primary">404</p>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold text-foreground">
          Page Not Found
        </h1>
        <p className="mt-3 max-w-md text-sm md:text-base text-muted-foreground">
          The page you&apos;re looking for may have been moved, renamed, or no longer exists.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-full border border-border text-sm text-foreground hover:bg-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
