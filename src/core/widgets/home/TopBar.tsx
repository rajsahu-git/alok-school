"use client";

const INFO_ITEMS = [
  { icon: "📋", text: "Affiliation no. 1730193" },
  { icon: "🏫", text: "School code. 10541" },
  { icon: "📞", text: "02952-224225" },
  { icon: "✉️", text: "alokrajsamand@alokschool.org" },
];

// Duplicate for seamless loop
const MARQUEE_ITEMS = [...INFO_ITEMS, ...INFO_ITEMS];

export default function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground text-xs w-full z-50">
      <div className="flex items-stretch min-h-[36px]">

        {/* ── Mandatory Disclosure Button ── */}
        <a
          href="/mandatory-disclosure.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors font-bold text-[11px] sm:text-xs whitespace-nowrap border-r-2 border-primary-foreground/30 tracking-wide uppercase cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden sm:inline">Mandatory Disclosure</span>
          <span className="sm:hidden">Disclosure</span>
        </a>

        {/* ── Running Marquee ── */}
        <div className="flex-1 overflow-hidden flex items-center">
          <div className="flex animate-marquee whitespace-nowrap gap-0">
            {MARQUEE_ITEMS.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-5 border-r border-primary-foreground/20">
                <span>{item.icon}</span>
                <span className="font-medium">{item.text}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Social Icons ── */}
        <div className="flex-shrink-0 flex items-center gap-0 border-l border-primary-foreground/20">
          <a
            href="https://www.facebook.com/alokrajsamand"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex items-center justify-center w-9 h-full hover:bg-primary-foreground/15 transition-colors border-r border-primary-foreground/20"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/alokschoolrajsamand"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex items-center justify-center w-9 h-full hover:bg-primary-foreground/15 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
          </a>
        </div>

      </div>
    </div>
  );
}
