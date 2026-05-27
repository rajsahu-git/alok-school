"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthFailureInner() {
  const params = useSearchParams();
  const message = params.get("message") ?? "Your Google account is not authorized to access the admin panel.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center text-center gap-6 max-w-md w-full">

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black text-foreground">Access Denied</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">{message}</p>
          <p className="text-muted-foreground text-sm">Please contact the administrator to get access.</p>
        </div>

        {/* Error badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200">
          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          <span className="text-xs font-medium text-red-600">401 Unauthorized</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">

          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Home
          </Link>
        </div>

        <div className="text-xs text-muted-foreground">
          Need access?{" "}
          <p className="text-primary hover:underline font-medium">
            Contact the administrator
          </p>
        </div>

      </div>
    </div>
  );
}

export default function AuthFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthFailureInner />
    </Suspense>
  );
}
