"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const PHONE = "9414232523"; // replace with actual number

const actions = [
  {
    label: "WhatsApp",
    bg: "bg-[#25D366]",
    href: `https://wa.me/${PHONE}`,
    external: true,
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.829 1.781 6.859L2 30l7.352-1.758A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.834-1.594l-.418-.248-4.363 1.043 1.074-4.25-.273-.435A11.46 11.46 0 0 1 4.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.617c-.344-.172-2.035-1.004-2.35-1.117-.316-.115-.547-.172-.777.172-.23.344-.893 1.117-1.094 1.348-.2.23-.402.258-.746.086-.344-.172-1.453-.535-2.766-1.707-1.023-.912-1.713-2.039-1.914-2.383-.2-.344-.021-.53.15-.701.155-.154.344-.402.516-.603.172-.2.23-.344.344-.574.115-.23.058-.43-.029-.602-.086-.172-.777-1.875-1.065-2.566-.28-.672-.564-.58-.777-.59l-.66-.012c-.23 0-.602.086-.918.43s-1.205 1.176-1.205 2.867 1.234 3.326 1.406 3.555c.172.23 2.43 3.711 5.887 5.203.823.355 1.465.567 1.965.727.826.263 1.578.226 2.172.137.662-.099 2.035-.832 2.322-1.635.287-.803.287-1.492.2-1.635-.085-.143-.315-.229-.659-.401z" />
      </svg>
    ),
  },
  {
    label: "Call Us",
    bg: "bg-blue-600",
    href: `tel:+${PHONE}`,
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z" />
      </svg>
    ),
  },
  {
    label: "Admission",
    bg: "bg-primary",
    href: "/admission",
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
        <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z" />
      </svg>
    ),
  },
  {
    label: "contact-us",
    bg: "bg-orange-500",
    href: "/contact",
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
        <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-7 13h-2v-2h2v2zm0-4h-2V7h2v4z" />
      </svg>
    ),
  },
];

export default function FloatingActions() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-6 left-6 z-50 flex  flex-col-reverse items-start gap-3">
      {/* Action buttons */}
      {open && actions.map((a, i) => (
        <div
          key={a.label}
          className="flex items-center gap-2"
          style={{ animation: `fab-in 0.2s ease ${i * 0.05}s both` }}
        >

          {a.external ? (
            <a href={a.href} target="_blank" rel="noopener noreferrer" aria-label={a.label}
              className={`w-11 h-11 rounded-full shadow-lg flex items-center justify-center ${a.bg} hover:opacity-90 transition-opacity`}>
              {a.icon}
            </a>
          ) : (
            <Link href={a.href} aria-label={a.label}
              className={`w-11 h-11 rounded-full shadow-lg flex items-center justify-center ${a.bg} hover:opacity-90 transition-opacity`}>
              {a.icon}
            </Link>
          )}
                    <span className="bg-gray-800 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow whitespace-nowrap">
            {a.label}
          </span>
        </div>
      ))}

      {/* Toggle button */}
      {!open&& <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle contact options"
        className="w-14 h-14 rounded-full bg-[#25D366] shadow-xl flex items-center justify-center hover:bg-[#1ebe5d] transition-all"
      >
        <svg viewBox="0 0 32 32" className={`w-8 h-8 fill-white transition-transform duration-300 ${open ? "scale-0 absolute" : "scale-100"}`}>
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.829 1.781 6.859L2 30l7.352-1.758A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.834-1.594l-.418-.248-4.363 1.043 1.074-4.25-.273-.435A11.46 11.46 0 0 1 4.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.617c-.344-.172-2.035-1.004-2.35-1.117-.316-.115-.547-.172-.777.172-.23.344-.893 1.117-1.094 1.348-.2.23-.402.258-.746.086-.344-.172-1.453-.535-2.766-1.707-1.023-.912-1.713-2.039-1.914-2.383-.2-.344-.021-.53.15-.701.155-.154.344-.402.516-.603.172-.2.23-.344.344-.574.115-.23.058-.43-.029-.602-.086-.172-.777-1.875-1.065-2.566-.28-.672-.564-.58-.777-.59l-.66-.012c-.23 0-.602.086-.918.43s-1.205 1.176-1.205 2.867 1.234 3.326 1.406 3.555c.172.23 2.43 3.711 5.887 5.203.823.355 1.465.567 1.965.727.826.263 1.578.226 2.172.137.662-.099 2.035-.832 2.322-1.635.287-.803.287-1.492.2-1.635-.085-.143-.315-.229-.659-.401z" />
        </svg>
        <svg viewBox="0 0 24 24" className={`w-7 h-7 stroke-white transition-transform duration-300 fill-none ${open ? "scale-100" : "scale-0 absolute"}`} strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>}

      <style>{`
        @keyframes fab-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
