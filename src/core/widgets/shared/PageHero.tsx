import React from "react";
import Link from "next/link";
import SVGComponent from "./BookSvg";

/* ── Doodle: left side — globe + rocket + stars ── */
const LeftDoodle = () => (
  <SVGComponent />
);

/* ── Doodle: right side — open book + pencil + stars ── */


/* ── Props ── */
interface PageHeroProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}

const PageHero = ({ title, breadcrumbs }: PageHeroProps) => {
  return (
    <div className="relative bg-secondary overflow-hidden">
      {/* Doodle left */}
      <div className="absolute hidden md:flex left-0 top-0 h-full w-[200px] md:w-[260px] pointer-events-none select-none">
        <LeftDoodle />
      </div>

      {/* Doodle right */}
        {/* <div className="absolute right-0 top-0 h-full w-[200px] md:w-[260px] pointer-events-none select-none">
          <RightDoodle />
        </div> */}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center py-10 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          {title}
        </h1>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <svg
                    className="w-3 h-3 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {crumb.label} 
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default PageHero;
