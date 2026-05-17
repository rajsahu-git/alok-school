"use client";

import { useState, useRef } from "react";
import PageHero from "@/core/widgets/shared/PageHero";

// ─── Types ────────────────────────────────────────────────────────────────────

const POSITIONS = ["Teacher", "PGT", "TGT", "PRT", "Lab Assistant", "Librarian", "Accountant", "Office Staff", "Other"];

const EMPTY_ACADEMIC = { qualification: "", mainSubjects: "", schoolOrCollege: "", boardOrUniversity: "", yearOfPassing: "", percentageOfMarks: "", division: "" };
const EMPTY_WORK     = { organizationName: "", fromDate: "", toDate: "", subjects: "", classes: "", otherResponsibilities: "" };
const EMPTY_CHILD    = { name: "", gender: "", age: "", presentClass: "", currentSchool: "" };

// ─── Section Heading ──────────────────────────────────────────────────────────

function SectionHead({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-6 bg-primary rounded-full" />
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">{title}</h3>
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors";
const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CareerPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  // Position
  const [position, setPosition]   = useState("");
  const [subject, setSubject]     = useState("");

  // Personal
  const [personal, setPersonal] = useState({
    salutation: "", firstName: "", middleName: "", lastName: "",
    dateOfBirth: "", gender: "", placeOfBirth: "", maritalStatus: "",
    religion: "", nationality: "", email: "", mobileNumber: "",
  });

  // Address
  const [presentAddr, setPresentAddr] = useState({ address: "", city: "", state: "", pinCode: "" });
  const [sameAddress, setSameAddress] = useState(false);
  const [permAddr, setPermAddr]       = useState({ address: "", city: "", state: "", pinCode: "" });

  // Family
  const [family, setFamily] = useState({
    fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: "",
    spouseName: "", spouseJobTransferable: false, spouseQualification: "",
    spouseProfession: "", spouseOrganization: "", spouseDesignation: "",
  });

  // Children
  const [children, setChildren] = useState([{ ...EMPTY_CHILD }]);

  // Academics
  const [academics, setAcademics] = useState([{ ...EMPTY_ACADEMIC }]);

  // Work Experience
  const [workExp, setWorkExp] = useState([{ ...EMPTY_WORK }]);

  // Total Experience
  const [totalExp, setTotalExp] = useState({ completedYears: "", teaching: "", administration: "", otherExperience: "" });

  // Current Job
  const [currentJob, setCurrentJob] = useState({
    institutionName: "", address: "", contactNumber: "", presentOrPreviousDesignation: "",
    dateOfJoining: "", placeOfPosting: "", totalEarning: "", basicSalary: "",
    allowance: "", otherBenefits: "", underServiceBond: false, expectedSalary: "", computerProficiency: "",
  });

  // Documents
  const [resume, setResume]               = useState<File | null>(null);
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview]   = useState<string | null>(null);
  const resumeRef = useRef<HTMLInputElement>(null);
  const photoRef  = useRef<HTMLInputElement>(null);

  // Declaration
  const [agreed, setAgreed] = useState(false);

  // ── Helpers ──
  const setP = (k: keyof typeof personal) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setPersonal((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError("Please agree to the declaration before submitting."); return; }

    setSubmitting(true); setError(null);
    try {
      const fd = new FormData();
      const data = {
        position, subject,
        personalInformation: personal,
        presentAddress: presentAddr,
        permanentAddress: sameAddress ? { ...presentAddr, sameAsPresentAddress: true } : { ...permAddr, sameAsPresentAddress: false },
        children,
        familyInformation: family,
        academicQualifications: academics,
        workExperiences: workExp,
        totalExperience: totalExp,
        currentJobInformation: currentJob,
        declaration: { agreed, submittedAt: new Date().toISOString() },
      };
      fd.append("data", JSON.stringify(data));
      if (resume)        fd.append("resume", resume);
      if (passportPhoto) fd.append("passportPhoto", passportPhoto);

      const res = await fetch("/api/career", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Submission failed.");
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setSubmitting(false); }
  };

  if (success) return (
    <>
      <PageHero title="Career" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Career" }]} />
      <section className="py-20 bg-background">
        <div className="container max-w-lg flex flex-col items-center gap-5 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Application Submitted!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Thank you for applying at Alok School. We have received your application and will review it shortly. You will be contacted on your registered email/mobile.
          </p>
          <button onClick={() => setSuccess(false)} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Submit Another Application
          </button>
        </div>
      </section>
    </>
  );

  return (
    <>
      <PageHero title="Career" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Career" }]} />

      <section className="py-14 bg-background">
        <div className="container max-w-5xl">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">

            {/* Header */}
            <div className="bg-primary/5 border-b border-border px-6 py-5">
              <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>Career Application Form</h2>
              <p className="text-sm text-muted-foreground mt-1">Fill in all details carefully. Fields marked <span className="text-red-500">*</span> are required.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-8">

              {/* ── Position ── */}
              <div>
                <SectionHead title="Position Applied For" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Position <span className="text-red-500">*</span></label>
                    <select value={position} onChange={(e) => setPosition(e.target.value)} required className={inputCls}>
                      <option value="">— Select Position —</option>
                      {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Subject (if applicable)</label>
                    <input type="text" placeholder="e.g. Mathematics, Science" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* ── Personal Information ── */}
              <div>
                <SectionHead title="Personal Information" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Salutation</label>
                    <select value={personal.salutation} onChange={setP("salutation")} className={inputCls}>
                      <option value="">—</option>
                      {["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>First Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="First name" value={personal.firstName} onChange={setP("firstName")} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Middle Name</label>
                    <input type="text" placeholder="Middle name" value={personal.middleName} onChange={setP("middleName")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Last Name</label>
                    <input type="text" placeholder="Last name" value={personal.lastName} onChange={setP("lastName")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Date of Birth <span className="text-red-500">*</span></label>
                    <input type="date" value={personal.dateOfBirth} onChange={setP("dateOfBirth")} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Gender <span className="text-red-500">*</span></label>
                    <select value={personal.gender} onChange={setP("gender")} required className={inputCls}>
                      <option value="">— Select —</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Place of Birth</label>
                    <input type="text" placeholder="City, State" value={personal.placeOfBirth} onChange={setP("placeOfBirth")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Marital Status</label>
                    <select value={personal.maritalStatus} onChange={setP("maritalStatus")} className={inputCls}>
                      <option value="">— Select —</option>
                      {["Single", "Married", "Divorced", "Widowed"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Religion</label>
                    <input type="text" placeholder="Religion" value={personal.religion} onChange={setP("religion")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Nationality</label>
                    <input type="text" placeholder="Nationality" value={personal.nationality} onChange={setP("nationality")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email <span className="text-red-500">*</span></label>
                    <input type="email" placeholder="Email address" value={personal.email} onChange={setP("email")} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Mobile Number <span className="text-red-500">*</span></label>
                    <input type="tel" placeholder="Mobile number" value={personal.mobileNumber} onChange={setP("mobileNumber")} required className={inputCls} />
                  </div>
                </div>
              </div>

              {/* ── Present Address ── */}
              <div>
                <SectionHead title="Present Address" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Address</label>
                    <input type="text" placeholder="Street address" value={presentAddr.address} onChange={(e) => setPresentAddr((a) => ({ ...a, address: e.target.value }))} className={inputCls} />
                  </div>
                  {(["city", "state", "pinCode"] as const).map((k) => (
                    <div key={k}>
                      <label className={labelCls}>{k === "pinCode" ? "Pin Code" : k.charAt(0).toUpperCase() + k.slice(1)}</label>
                      <input type="text" placeholder={k === "pinCode" ? "Pin Code" : k.charAt(0).toUpperCase() + k.slice(1)} value={presentAddr[k]} onChange={(e) => setPresentAddr((a) => ({ ...a, [k]: e.target.value }))} className={inputCls} />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Permanent Address ── */}
              <div>
                <SectionHead title="Permanent Address" />
                <label className="flex items-center gap-2 mb-4 cursor-pointer">
                  <input type="checkbox" checked={sameAddress} onChange={(e) => setSameAddress(e.target.checked)} className="w-4 h-4 accent-primary" />
                  <span className="text-sm text-muted-foreground">Same as Present Address</span>
                </label>
                {!sameAddress && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Address</label>
                      <input type="text" placeholder="Street address" value={permAddr.address} onChange={(e) => setPermAddr((a) => ({ ...a, address: e.target.value }))} className={inputCls} />
                    </div>
                    {(["city", "state", "pinCode"] as const).map((k) => (
                      <div key={k}>
                        <label className={labelCls}>{k === "pinCode" ? "Pin Code" : k.charAt(0).toUpperCase() + k.slice(1)}</label>
                        <input type="text" placeholder={k === "pinCode" ? "Pin Code" : k.charAt(0).toUpperCase() + k.slice(1)} value={permAddr[k]} onChange={(e) => setPermAddr((a) => ({ ...a, [k]: e.target.value }))} className={inputCls} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Academic Qualifications ── */}
              <div>
                <SectionHead title="Academic Qualifications" />
                <div className="flex flex-col gap-4">
                  {academics.map((row, i) => (
                    <div key={i} className="rounded-xl border border-border p-4 flex flex-col gap-3 bg-secondary/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Qualification {i + 1}</span>
                        {i > 0 && <button type="button" onClick={() => setAcademics((a) => a.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:text-red-600">Remove</button>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(["qualification", "mainSubjects", "schoolOrCollege", "boardOrUniversity", "yearOfPassing", "percentageOfMarks", "division"] as const).map((k) => (
                          <div key={k}>
                            <label className={labelCls}>{k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</label>
                            <input type="text" value={row[k]} onChange={(e) => setAcademics((a) => a.map((r, j) => j === i ? { ...r, [k]: e.target.value } : r))} className={inputCls} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => setAcademics((a) => [...a, { ...EMPTY_ACADEMIC }])}
                    className="self-start text-xs text-primary font-medium hover:underline flex items-center gap-1">
                    + Add Qualification
                  </button>
                </div>
              </div>

              {/* ── Work Experience ── */}
              <div>
                <SectionHead title="Work Experience" />
                <div className="flex flex-col gap-4">
                  {workExp.map((row, i) => (
                    <div key={i} className="rounded-xl border border-border p-4 flex flex-col gap-3 bg-secondary/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Experience {i + 1}</span>
                        {i > 0 && <button type="button" onClick={() => setWorkExp((w) => w.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:text-red-600">Remove</button>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(["organizationName", "fromDate", "toDate", "subjects", "classes", "otherResponsibilities"] as const).map((k) => (
                          <div key={k}>
                            <label className={labelCls}>{k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</label>
                            <input type={k.includes("Date") ? "date" : "text"} value={row[k]} onChange={(e) => setWorkExp((w) => w.map((r, j) => j === i ? { ...r, [k]: e.target.value } : r))} className={inputCls} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => setWorkExp((w) => [...w, { ...EMPTY_WORK }])}
                    className="self-start text-xs text-primary font-medium hover:underline flex items-center gap-1">
                    + Add Experience
                  </button>
                </div>
              </div>

              {/* ── Total Experience ── */}
              <div>
                <SectionHead title="Total Experience" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {(["completedYears", "teaching", "administration", "otherExperience"] as const).map((k) => (
                    <div key={k}>
                      <label className={labelCls}>{k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</label>
                      <input type="text" placeholder="e.g. 5 years" value={totalExp[k]} onChange={(e) => setTotalExp((t) => ({ ...t, [k]: e.target.value }))} className={inputCls} />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Current Job ── */}
              <div>
                <SectionHead title="Current / Previous Job Information" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(["institutionName", "address", "contactNumber", "presentOrPreviousDesignation", "dateOfJoining", "placeOfPosting", "totalEarning", "basicSalary", "allowance", "otherBenefits", "expectedSalary", "computerProficiency"] as const).map((k) => (
                    <div key={k}>
                      <label className={labelCls}>{k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</label>
                      <input type={k.includes("Date") ? "date" : "text"} value={currentJob[k] as string} onChange={(e) => setCurrentJob((c) => ({ ...c, [k]: e.target.value }))} className={inputCls} />
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="bond" checked={currentJob.underServiceBond} onChange={(e) => setCurrentJob((c) => ({ ...c, underServiceBond: e.target.checked }))} className="w-4 h-4 accent-primary" />
                    <label htmlFor="bond" className="text-sm text-muted-foreground cursor-pointer">Under Service Bond</label>
                  </div>
                </div>
              </div>

              {/* ── Documents ── */}
              <div>
                <SectionHead title="Upload Documents" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Resume */}
                  <div>
                    <label className={labelCls}>Resume / CV (PDF only)</label>
                    <div onClick={() => resumeRef.current?.click()}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all">
                      <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span className="text-sm text-muted-foreground truncate">{resume ? resume.name : "Click to upload PDF"}</span>
                      {resume && <button type="button" onClick={(e) => { e.stopPropagation(); setResume(null); }} className="ml-auto text-xs text-red-500">Remove</button>}
                    </div>
                    <input ref={resumeRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setResume(f); }} />
                  </div>

                  {/* Passport Photo */}
                  <div>
                    <label className={labelCls}>Passport Photo (JPG/PNG)</label>
                    <div onClick={() => photoRef.current?.click()}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all">
                      {photoPreview
                        ? <img src={photoPreview} alt="photo" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                        : <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                      }
                      <span className="text-sm text-muted-foreground truncate">{passportPhoto ? passportPhoto.name : "Click to upload photo"}</span>
                      {passportPhoto && <button type="button" onClick={(e) => { e.stopPropagation(); setPassportPhoto(null); setPhotoPreview(null); }} className="ml-auto text-xs text-red-500">Remove</button>}
                    </div>
                    <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setPassportPhoto(f); setPhotoPreview(URL.createObjectURL(f)); } }} />
                  </div>
                </div>
              </div>

              {/* ── Declaration ── */}
              <div className="border-t border-border pt-6">
                <div className="bg-secondary rounded-xl p-5 mb-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    I hereby declare that all the information furnished above is true and correct to the best of my knowledge and belief.
                    I understand that any false or misleading information may result in disqualification or termination of employment.
                  </p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setError(null); }} className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    I <span className="text-primary font-semibold">confirm</span> that the above information is correct and I agree to the declaration.
                  </span>
                </label>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button type="submit" disabled={submitting || !agreed}
                className="self-start flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity">
                {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {submitting ? "Submitting…" : "Submit Application"}
              </button>

            </form>
          </div>
        </div>
      </section>
    </>
  );
}
