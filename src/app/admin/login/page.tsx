const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const FRONTEND = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";

export default function AdminLoginPage() {
  console.log("hello.")
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="bg-card rounded-2xl shadow-lg border border-border w-full max-w-sm p-8 flex flex-col items-center gap-6">

        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
              className="w-8 h-8 text-primary" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2z" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-xs text-muted-foreground mt-1">Alok Sansthan — Restricted Access</p>
          </div>
        </div>

        <div className="w-full h-px bg-border" />

        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          Sign in with your authorized Google account to access the admin dashboard.
        </p>

        {/* Google Button */}
        <a
          href={`${API}/api/auth/google?failureRedirect=${FRONTEND}/auth/failure`}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-card hover:bg-secondary active:scale-95 transition-all duration-200 px-5 py-3 shadow-sm"
        >
          <svg viewBox="0 0 48 48" className="w-5 h-5 flex-shrink-0">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span className="text-sm font-semibold text-foreground">Continue with Google</span>
        </a>

        <p className="text-xs text-muted-foreground text-center">
          Only authorized administrators can access this area.
        </p>
      </div>
    </div>
  );
}
