"use client";

import { useState } from "react";

const CLASSES = ["Nursery", "Pre-Primary", "Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII", "Class IX", "Class X", "Class XI", "Class XII"];

const EMPTY = {
  studentName: "", classSeekingAdmission: "", parentName: "", contactNumber: "",
  email: "", address: "", city: "", state: "", pincode: "",
  dateOfBirth: "", gender: "", previousSchool: "", message: "",
};

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Submit Enquiry & Application",
    desc: "Parents can begin by filling out the admission enquiry or application form with basic student and parent details.",
  },
  {
    num: "02",
    title: "Interaction & Assessment",
    desc: "The student may be invited for an age-appropriate interaction or assessment, along with a discussion with parents to understand learning needs.",
  },
  {
    num: "03",
    title: "Confirmation & Admission",
    desc: "Upon selection, parents will receive admission confirmation. Completion of documentation and fee formalities secures the seat.",
  },
];

const DOCUMENTS = [
  "Copy of Aadhaar Card of the student / Passport (for international students)",
  "Two passport-size photographs of the student",
  "Birth Certificate (mandatory for LKG to Grade V)",
  "Original Transfer Certificate from the previous school",
  "Report Card / Mark Sheet of the last attended class",
  "Medical fitness certificate (if applicable)",
];

export default function AdmissionForm() {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError(null);
    try {
      const res = await fetch("/api/admission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed.");
      setSuccess(true);
      setForm(EMPTY);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors";
  const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5";

  return (
    <div className="bg-background">

      {/* ── Form Section ── */}
      <section className="py-14">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-12 items-start">

            {/* Left — Form */}
            <div className="flex-1 w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>
                  Admissions <span className="text-primary">Enquiry</span>
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Alok School Admission Enquiry — Get Details and Apply Now
                </p>
              </div>

              {success ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-8 flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-green-700">Application Submitted!</h3>
                  <p className="text-sm text-green-600">Thank you for your enquiry. Our team will contact you shortly.</p>
                  <button onClick={() => setSuccess(false)}
                    className="mt-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Student's Name <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Enter student's full name" value={form.studentName} onChange={set("studentName")} required className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Class Seeking Admission <span className="text-red-500">*</span></label>
                      <select value={form.classSeekingAdmission} onChange={set("classSeekingAdmission")} required className={inputCls}>
                        <option value="">— Please choose an option —</option>
                        {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Parent's Name <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Enter parent's full name" value={form.parentName} onChange={set("parentName")} required className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Contact Number <span className="text-red-500">*</span></label>
                      <input type="tel" placeholder="Enter contact number" value={form.contactNumber} onChange={set("contactNumber")} required className={inputCls} />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Email ID <span className="text-red-500">*</span></label>
                      <input type="email" placeholder="Enter email address" value={form.email} onChange={set("email")} required className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Date of Birth <span className="text-red-500">*</span></label>
                      <input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} required className={inputCls} />
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Gender <span className="text-red-500">*</span></label>
                      <select value={form.gender} onChange={set("gender")} required className={inputCls}>
                        <option value="">— Select Gender —</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Previous School</label>
                      <input type="text" placeholder="Enter previous school name" value={form.previousSchool} onChange={set("previousSchool")} className={inputCls} />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className={labelCls}>Address <span className="text-red-500">*</span></label>
                    <textarea rows={2} placeholder="Enter full address" value={form.address} onChange={set("address")} required className={inputCls + " resize-none"} />
                  </div>

                  {/* Row 5 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>City <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="City" value={form.city} onChange={set("city")} required className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>State <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="State" value={form.state} onChange={set("state")} required className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Pincode <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Pincode" value={form.pincode} onChange={set("pincode")} required className={inputCls} />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className={labelCls}>Message</label>
                    <textarea rows={3} placeholder="Any additional information or queries..." value={form.message} onChange={set("message")} className={inputCls + " resize-none"} />
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <button type="submit" disabled={submitting}
                    className="self-start flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity">
                    {submitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                    {submitting ? "Submitting…" : "Submit"}
                  </button>
                </form>
              )}
            </div>

            {/* Right — Images */}
            <div className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0 pt-16">
              <div className="rounded-[2rem] overflow-hidden border-4 border-primary/20 shadow-lg aspect-[3/4]">
                <img src="https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/unnamed_1_zsknt1.webp"
                  alt="Students" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-[2rem] overflow-hidden border-4 border-accent/30 shadow-lg aspect-[3/4] -mt-16 ml-10">
                <img src="https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/IMG-20260122-WA0035_xvxdyb.jpg"
                  alt="School" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Admission Process ── */}
      <section className="py-14 bg-secondary">
        <div className="container flex flex-col gap-10">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>
              Admissions <span className="text-primary">Process</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
              Admissions at Alok School, India follow a transparent and well-defined process designed to ensure
              the right academic fit for every child.
            </p>
          </div>

          <div className="flex flex-col gap-0 max-w-2xl mx-auto w-full">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.num} className="flex gap-6 items-start">
                {/* Number + line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <span className="text-3xl font-black text-primary/30 leading-none">{step.num}</span>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-primary/20 my-2" style={{ minHeight: 40 }} />
                  )}
                </div>
                {/* Card */}
                <div className="bg-card rounded-xl border border-border p-5 flex gap-4 items-start mb-4 shadow-sm flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-1">{step.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Documents Required ── */}
      <section className="py-14">
        <div className="container">
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0 lg:w-56">
              <h3 className="text-xl font-bold text-foreground leading-snug" style={{ fontFamily: "Georgia, serif" }}>
                Documents Required at the{" "}
                <span className="text-primary">Time of Admission</span>
              </h3>
            </div>
            <div className="flex-1">
              <ul className="flex flex-col gap-3">
                {DOCUMENTS.map((doc, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    </span>
                    <span className="text-sm text-foreground leading-relaxed">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
