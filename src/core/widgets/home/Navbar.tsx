"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
    
    { name: "Home", href: "/" },
    
  {
    name: "About Us",
    href: "/about-us",
    children: [
      { name: "Origin & History", href: "/about-us/origin" },
      { name: "Directors' Pen", href: "/about-us/directors-pen" },
      { name: "Principals' Pen", href: "/about-us/principals-pen" },
      { name: "Our Administrator", href: "/about-us/administrator" },
      { name: "Our Alumni", href: "/about-us/our-alumni" },
      { name: "Vision & Mission", href: "/about-us/vision-mission" },
      { name: "Alok Kids", href: "/about-us/alok-kids" },
      { name: "WHY ALOK ?", href: "/about-us/why-alok" },
    ],
  },
  {
    name: "Gallery",
    href: "/gallery",
    children: [
      { name: "Image Gallery", href: "/gallery/images" },
      { name: "Video Gallery", href: "/gallery/videos" },
    ],
  },
  {
    name: "Admission",
    href: "/admission",
    children: [
      { name: "Registration Form", href: "/admission/registration" },
      { name: "Fee Structure", href: "/admission/fee-structure" },
      { name: "Rules & Regulations", href: "/admission/rules" },
    ],
  },
  {
    name: "Academic",
    href: "/academic",
    children: [
      { name: "Examination Announcement", href: "/academic/examination" },
      { name: "Achievement", href: "/academic/achievement" },
      {
        name: "Our Team",
        href: "/academic/team",
        children: [
          { name: "Our Teacher", href: "/academic/team/teachers" },
          { name: "Office Staff", href: "/academic/team/staff" },
        ],
      },
      { name: "Coordinators", href: "/academic/coordinators" },
      { name: "Mobile App", href: "/academic/mobile-app" },
      { name: "Video Tutorial", href: "/academic/video-tutorial" },
      { name: "Skill Subject", href: "/academic/skill-subject" },
      { name: "Annual Calendar", href: "/academic/calendar" },
    ],
  },
  {
    name: "Infrastructure",
    href: "/infrastructure",
    children: [
      { name: "Facilities", href: "/infrastructure/facilities" },
      { name: "Transport", href: "/infrastructure/transport" },
      { name: "Lab", href: "/infrastructure/lab" },
      { name: "Library", href: "/infrastructure/library" },
    ],
  },
  {
    name: "Activities",
    href: "/activities",
    children: [
      { name: "Social", href: "/activities/social" },
      { name: "Cultural", href: "/activities/cultural" },
      { name: "Sports", href: "/activities/sports" },
      { name: "Yoga", href: "/activities/yoga" },
      { name: "Literary", href: "/activities/literary" },
      { name: "Tours and Picnic", href: "/activities/tours" },
      { name: "Martial Art", href: "/activities/martial-art" },
    ],
  },
  {
    name: "Online",
    href: "/online",
    children: [
      { name: "Transfer Certificate", href: "/online/tc" },
      { name: "Career", href: "/online/career" },
      { name: "Admission", href: "/online/admission" },
      { name: "Alumni Registration", href: "/online/alumni" },
      { name: "School Uniform", href: "/online/uniform" },
    ],
  },
  { name: "Result", href: "/result" },
  { name: "Contact", href: "/contact" },
];

function Navbar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuLeave = () => {
    setOpenMenu(null);
    setOpenSubMenu(null);
  };

  const renderDropdown = (items: typeof navItems[0][], level: number = 0) => {
    return (
      <div
        className={`absolute top-full left-0 ${
          level > 0 ? "left-full top-0 ml-1" : ""
        } bg-background border border-border shadow-lg min-w-[200px] ${
          level > 0 ? "shadow-xl" : ""
        }`}
      >
        {items.map((item) => (
          <div
            key={item.name}
            className="relative group"
            onMouseEnter={() => item.children && level === 0 && setOpenSubMenu(item.name)}
            onMouseLeave={() => item.children && level === 0 && setOpenSubMenu(null)}
          >
            {item.children ? (
              <>
                <div
                  className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer ${
                    level > 0 ? "text-muted-foreground" : "text-foreground"
                  } hover:bg-secondary hover:text-foreground whitespace-nowrap`}
                >
                  <span>{item.name}</span>
                  {level === 0 && (
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
                {level === 0 && openSubMenu === item.name && (
                  <div className="left-full top-0 ml-1 absolute bg-background border border-border shadow-lg min-w-[200px]">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={`block px-4 py-2 text-sm hover:bg-secondary hover:text-foreground ${
                  level > 0 ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderMobileMenu = (items: typeof navItems[0][], level: number = 0) => {
    return items.map((item) => {
      const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + "/") : false;
      return (
      <div key={item.name} className="w-full">
        {item.children ? (
          <div className="flex flex-col">
<button
              className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm hover:bg-secondary border-l-[3px] ${isActive ? "text-primary font-medium border-primary" : "text-foreground border-transparent"}`}
              onClick={() => setOpenSubMenu(openSubMenu === item.name ? null : item.name)}
            >
              <span>{item.name}</span>
              <svg className={`w-4 h-4 transition-transform ${openSubMenu === item.name ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {openSubMenu === item.name && (
              <div className="pl-4 bg-secondary/30">
                {item.children.map((child) =>
                  child.children ? (
                    <div key={child.name}>
                      <button
                        className="flex items-center justify-between w-full px-4 py-2 text-left text-sm text-muted-foreground"
                        onClick={() => setOpenMenu(openMenu === child.name ? null : child.name)}
                      >
                        <span>{child.name}</span>
                        <svg className={`w-4 h-4 ${openMenu === child.name ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {openMenu === child.name && (
                        <div className="pl-4">
                          {child.children.map((sub) => (
                            <Link key={sub.name} href={sub.href} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link key={child.name} href={child.href} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
                      {child.name}
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        ) : (
          <Link href={item.href} className={`block px-4 py-2 text-sm hover:bg-secondary border-l-[3px] ${isActive ? "text-primary font-medium border-primary" : "text-foreground border-transparent"}`} onClick={() => setMobileOpen(false)}>
            {item.name}
          </Link>
        )}
      </div>
      );
    });
  };

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img className="w-44" src="https://rajsamand.alokschool.org/wp-content/uploads/2021/06/alokh-logo.png" alt="Alok" />
          </Link>

          <div className="hidden lg:flex items-stretch gap-1" onMouseLeave={handleMenuLeave}>
            {navItems.map((item) => {
              const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + "/") : false;
              return (
              <div key={item.name} className="relative flex" onMouseEnter={() => item.children && setOpenMenu(item.name)}>
                {item.children ? (
                  <div className={`flex items-center px-3 py-2 cursor-pointer text-sm font-medium transition-colors border-b-[3px] ${isActive ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}>
                    {item.name}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                ) : (
                  <Link href={item.href} className={`flex items-center px-3 py-2 text-sm font-medium transition-colors border-b-[3px] ${isActive ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}>
                    {item.name}
                  </Link>
                )}
                {item.children && openMenu === item.name && renderDropdown(item.children)}
              </div>
            )})}
          </div>



          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-foreground" aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background max-h-[80vh] overflow-y-auto">
          <div className="container py-4 flex flex-col gap-1">
            {renderMobileMenu(navItems)}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;