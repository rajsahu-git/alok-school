"use client";

import { useState, useRef } from "react";
import PageHero from "@/core/widgets/shared/PageHero";

const EMPTY = {
  fullName: "", gender: "", dob: "", mobileNumber: "", email: "",
  yearOfPassing: "", classStream: "", admissionNumber: "",
  currentProfession: "", cityCountry: "",
  interestedInMentoring: "", receiveAlumniUpdates: "", message: "",
};

export default function AlumaniForm() {
  const [form, setForm]         = useState(EMPTY);
  const [image, setImage]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value })); setError(null);
    };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) { setError("Please confirm that the above information is correct."); return; }

    setSubmitting(true); setError(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (image) fd.append("image", image);

      const res = await fetch("/api/alumni-form", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed.");
      setSuccess(true);
      setForm(EMPTY); setImage(null); setImagePreview(null); setConfirmed(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setSubmitting(false); }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors";
  const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5";

  return (
    <>
      <PageHero
        title="Alumni Registration"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Online", href: "/online" }, { label: "Alumni Registration" }]}
      />

      <section className="py-14 bg-background">
        <div className="container max-w-5xl">

          {success ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-700">Registration Successful!</h3>
              <p className="text-sm text-green-600 max-w-sm">Thank you for registering as an Alok School Alumni. We will review your application and get back to you soon.</p>
              <button onClick={() => setSuccess(false)}
                className="mt-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Register Another
              </button>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-primary/5 border-b border-border px-6 py-5">
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>
                  Alumni Registration Form
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Fill in your details to register as an official Alok School Alumni
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

                {/* Row 1 — Full Name + Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Alumni Full Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Enter your full name" value={form.fullName} onChange={set("fullName")} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Gender</label>
                    <select value={form.gender} onChange={set("gender")} className={inputCls}>
                      <option value="">— Please choose an option —</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Row 2 — DOB + Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Date of Birth</label>
                    <input type="date" value={form.dob} onChange={set("dob")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Mobile Number <span className="text-red-500">*</span></label>
                    <input type="tel" placeholder="Enter mobile number" value={form.mobileNumber} onChange={set("mobileNumber")} required className={inputCls} />
                  </div>
                </div>

                {/* Row 3 — Email + Year of Passing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>E-mail ID <span className="text-red-500">*</span></label>
                    <input type="email" placeholder="Enter email address" value={form.email} onChange={set("email")} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Year of Passing <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. 2015" value={form.yearOfPassing} onChange={set("yearOfPassing")} required className={inputCls} />
                  </div>
                </div>

                {/* Row 4 — Class/Stream + Admission Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Class / Stream <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Science / Commerce / Arts" value={form.classStream} onChange={set("classStream")} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Admission Number</label>
                    <input type="text" placeholder="Enter admission number" value={form.admissionNumber} onChange={set("admissionNumber")} className={inputCls} />
                  </div>
                </div>

                {/* Row 5 — Current Profession + City & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Current Profession <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. Software Engineer" value={form.currentProfession} onChange={set("currentProfession")} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>City &amp; Country <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. Mumbai, India" value={form.cityCountry} onChange={set("cityCountry")} required className={inputCls} />
                  </div>
                </div>

                {/* Row 6 — Mentoring + Updates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Interested in Mentoring?</label>
                    <select value={form.interestedInMentoring} onChange={set("interestedInMentoring")} className={inputCls}>
                      <option value="">— Please choose an option —</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Receive Alumni Updates?</label>
                    <select value={form.receiveAlumniUpdates} onChange={set("receiveAlumniUpdates")} className={inputCls}>
                      <option value="">— Please choose an option —</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className={labelCls}>Message / Memories</label>
                  <textarea rows={4} placeholder="Share your memories or a message for current students..." value={form.message} onChange={set("message")}
                    className={inputCls + " resize-none"} />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className={labelCls}>Upload Recent Photograph</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
                    onClick={() => fileRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-primary/5"}`}
                  >
                    {imagePreview ? (
                      <div className="flex flex-col items-center gap-3">
                        <img src={imagePreview} alt="preview" className="w-24 h-24 rounded-full object-cover border-2 border-primary" />
                        <p className="text-xs text-muted-foreground">{image?.name}</p>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setImage(null); setImagePreview(null); }}
                          className="text-xs text-red-500 hover:text-red-600 font-medium">Remove</button>
                      </div>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <p className="text-sm font-semibold text-primary">Drag &amp; Drop Files Here</p>
                        <p className="text-xs text-muted-foreground">or</p>
                        <p className="text-xs text-primary font-medium underline">Browse Files</p>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                </div>

                {/* Confirmation checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={confirmed} onChange={(e) => { setConfirmed(e.target.checked); setError(null); }}
                    className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    I confirm that the above <span className="text-primary font-semibold">information</span> is correct.
                  </span>
                </label>

                {error && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={submitting || !confirmed}
                  className="self-start flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity">
                  {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {submitting ? "Submitting…" : "Register as Alumni"}
                </button>

              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
