"use client";

import { useAuth } from "@/core/context/AuthContext";
import Link from "next/link";

export default function RoleGuard({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            You don&apos;t have permission to view this page. This area is restricted to authorized roles only.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs font-medium text-red-600 capitalize">Your role: {user?.role ?? "unknown"}</span>
        </div>
        <Link href="/admin" className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
