'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
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
    <section className="bg-background min-h-[70vh] flex items-center">
      <div className="container py-16 flex flex-col items-center text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Something Went Wrong
        </h1>
        <p className="mt-3 max-w-md text-sm md:text-base text-muted-foreground">
          We hit an unexpected error loading this page. Please try again, or head back to the homepage.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => unstable_retry()}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
