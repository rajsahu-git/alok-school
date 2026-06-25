'use client';

import { useEffect } from 'react';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <body className="min-h-screen flex items-center justify-center bg-background">
        <title>Something Went Wrong</title>
        <div className="container py-16 flex flex-col items-center text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Something Went Wrong
          </h1>
          <p className="mt-3 max-w-md text-sm md:text-base text-muted-foreground">
            The site ran into an unexpected problem. Please try again, or email us at{' '}
            <a href="mailto:alokrajsamand@alokschool.org" className="text-primary underline">
              alokrajsamand@alokschool.org
            </a>
            .
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => unstable_retry()}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
            <a
              href="/"
              className="px-6 py-3 rounded-full border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
