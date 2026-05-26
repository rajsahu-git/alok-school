"use client";

import { useEffect, useState, useCallback, useRef, TouchEvent } from "react";

function useTouchSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const startX = useRef<number | null>(null);
  return {
    onTouchStart: (e: TouchEvent) => { startX.current = e.touches[0].clientX; },
    onTouchEnd: (e: TouchEvent) => {
      if (startX.current === null) return;
      const diff = startX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? onSwipeLeft() : onSwipeRight();
      startX.current = null;
    },
  };
}

interface PopupItem {
  _id: string;
  image: { fileId: string };
  isActive: boolean;
}

interface PopupResponse {
  count: number;
  showPop: boolean;
  popups: PopupItem[];
}

const CLASSES = ["Nursery", "Pre-Primary", "Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII", "Class IX", "Class X", "Class XI", "Class XII"];

const EMPTY = { studentName: "", classSeekingAdmission: "", parentName: "", contactNumber: "", email: "", address: "" };

export default function SitePopup() {
  const [visible, setVisible]         = useState(false);
  const [slides, setSlides]           = useState<string[]>([]);
  const [showAdmission, setShowAdmission] = useState(false);
  const [current, setCurrent]         = useState(0);

  // Admission form state
  const [form, setForm]       = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/popup")
      .then((r) => r.ok ? r.json() : null)
      .then((data: PopupResponse | null) => {
        if (!data) return;
        const activePopups = data.popups.filter((p) => p.isActive);
        if (!data.showPop || activePopups.length === 0) {
          setShowAdmission(true);
        } else {
          setSlides(activePopups.map((p) => `/api/drive-image?id=${p.image.fileId}`));
        }
        setTimeout(() => setVisible(true), 800);
      })
      .catch(() => {});
  }, []);

  const goNext = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const swipe = useTouchSwipe(goNext, goPrev);

  useEffect(() => {
    if (!visible || showAdmission || slides.length <= 1) return;
    const timer = setInterval(goNext, 3000);
    return () => clearInterval(timer);
  }, [visible, showAdmission, slides.length, goNext]);

  const close = () => setVisible(false);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value })); setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName || !form.classSeekingAdmission || !form.parentName || !form.contactNumber || !form.email || !form.address) {
      setFormError("Please fill all required fields."); return;
    }
    setSubmitting(true); setFormError(null);
    try {
      const res = await fetch("/api/admission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, gender: "other", dob: "2000-01-01", city: "N/A", state: "N/A", pincode: "000000" }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setSubmitted(true);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Submission failed.");
    } finally { setSubmitting(false); }
  };

  if (!visible) return null;

  const inputCls = "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      style={{ animation: "popup-fade-in 0.4s ease" }}
      onClick={close}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-backdrop-blur py-10 max-h-[90vh] overflow-y-auto"
        style={{ animation: "popup-scale-in 0.4s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={close}
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white hover:opacity-80 transition-opacity shadow">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ── Image Slider ── */}
        {!showAdmission && slides.length > 0 && (
          <div className="relative overflow-hidden" {...swipe}>
            <div className="relative w-full" style={{ maxHeight: 520 }}>
              {slides.map((src, i) => (
                <img key={src} src={src} alt="Announcement"
                  className="w-full object-contain block"
                  style={{
                    maxHeight: 510,
                    position: i === 0 ? "relative" : "absolute",
                    top: 0, left: 0,
                    opacity: i === current ? 1 : 0,
                    transition: "opacity 0.6s ease-in-out",
                    pointerEvents: i === current ? "auto" : "none",
                  }}
                />
              ))}
            </div>
            {slides.length > 1 && (
              <>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {slides.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-5" : "bg-white/50 w-2"}`} />
                  ))}
                </div>
                <button onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
                  className="absolute hidden left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 lg:flex items-center justify-center text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={goNext}
                  className="absolute hidden right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 lg:flex items-center justify-center text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}
          </div>
        )}

        {/* ── Admission Form ── */}
        {showAdmission && (
          <div className="p-6 flex flex-col gap-4">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Application Submitted!</h3>
                  <p className="text-sm text-muted-foreground mt-1">Our team will contact you shortly.</p>
                </div>
                <button onClick={close} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Close</button>
              </div>
            ) : (
              <>
                {/* Heading */}
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wide">Admission Open 2025–26</p>
                  <h3 className="text-xl font-black text-foreground mt-1 leading-tight">
                    Apply Now at <span className="text-primary">Alok School</span>
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground font-medium">Student's Name <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Student's Name" value={form.studentName} onChange={set("studentName")} className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground font-medium">Class Seeking Admission <span className="text-red-500">*</span></label>
                      <select value={form.classSeekingAdmission} onChange={set("classSeekingAdmission")} className={inputCls}>
                        <option value="">— Please choose —</option>
                        {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground font-medium">Parent's Name <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Parent's Name" value={form.parentName} onChange={set("parentName")} className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground font-medium">Contact Number <span className="text-red-500">*</span></label>
                      <input type="tel" placeholder="Contact Number" value={form.contactNumber} onChange={set("contactNumber")} className={inputCls} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground font-medium">E-mail Id <span className="text-red-500">*</span></label>
                    <input type="email" placeholder="E-mail Id" value={form.email} onChange={set("email")} className={inputCls} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground font-medium">Your Address <span className="text-red-500">*</span></label>
                    <textarea rows={2} placeholder="Your Address" value={form.address} onChange={set("address")} className={inputCls + " resize-none"} />
                  </div>

                  {formError && <p className="text-xs text-red-500">{formError}</p>}

                  <button type="submit" disabled={submitting}
                    className="self-start flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity">
                    {submitting && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {submitting ? "Submitting…" : "Submit"}
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes popup-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes popup-scale-in {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
