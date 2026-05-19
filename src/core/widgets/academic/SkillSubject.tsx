import PageHero from "@/core/widgets/shared/PageHero";

const CLASS_6_8 = [
  { code: "901", name: "Artificial Intelligence – Class VI Only" },
];

const CLASS_10 = [
  { code: "241", name: "Mathematics Basic" },
  { code: "417", name: "Artificial Intelligence" },
  { code: "041", name: "Mathematics" },
  { code: "086", name: "Science" },
  { code: "087", name: "Social Science" },
  { code: "002", name: "Hindi Course-A" },
  { code: "184", name: "English Lang & Lit." },
  { code: "402", name: "Information Technology" },
];

const CLASS_12 = [
  { code: "301", name: "English Core" },
  { code: "001", name: "English Elective" },
  { code: "028", name: "Political Science" },
  { code: "041", name: "Mathematics" },
  { code: "049", name: "Painting" },
  { code: "048", name: "Physical Education" },
  { code: "500", name: "Work Experience" },
  { code: "841", name: "Yoga" },
  { code: "042", name: "Physics" },
  { code: "502", name: "Health & Physical Education" },
  { code: "503", name: "General Studies" },
  { code: "029", name: "Geography" },
  { code: "302", name: "Hindi Core" },
  { code: "027", name: "History" },
  { code: "065", name: "Informatics Prac.(New)" },
  { code: "066", name: "Entrepreneurship" },
  { code: "055", name: "Accountancy" },
  { code: "808", name: "Agriculture" },
  { code: "241", name: "Applied Mathematics" },
  { code: "807", name: "Beauty & Wellness" },
  { code: "044", name: "Biology" },
  { code: "054", name: "Business Studies" },
  { code: "043", name: "Chemistry" },
  { code: "083", name: "Computer Science (New)" },
  { code: "030", name: "Economics" },
];

function SubjectItem({ code, name }: { code: string; name: string }) {
  return (
    <p className="text-sm text-foreground">
      <span className="font-semibold text-primary">{code}</span>
      <span className="text-muted-foreground mx-1">—</span>
      {name}
    </p>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-base font-bold text-foreground underline underline-offset-4 text-center mb-5">
      {title}
    </h3>
  );
}

export default function SkillSubject() {
  return (
    <>
      <PageHero
        title="Skill Subject"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Academic", href: "/academic" },
          { label: "Skill Subject" },
        ]}
      />

      <section className="py-14 bg-background">
        <div className="container flex flex-col gap-10">

          {/* Heading */}
          <div className="text-center">
            <h2
              className="text-3xl md:text-4xl font-black text-primary uppercase tracking-widest"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Subjects Offered
            </h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="block w-12 h-px bg-accent" />
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              <span className="block w-12 h-px bg-accent" />
            </div>
          </div>

          {/* Two column cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">

            {/* Left card — Class 6-8 + Class 10 */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-8 flex flex-col gap-8">

              {/* Class 6 to 8 */}
              <div>
                <SectionTitle title="Skill subjects offered for class 6 to 8" />
                <div className="flex flex-col gap-2">
                  {CLASS_6_8.map((s) => <SubjectItem key={s.code} {...s} />)}
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Class 10 */}
              <div>
                <SectionTitle title="Subjects offered for class 10" />
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {CLASS_10.map((s) => <SubjectItem key={s.code + s.name} {...s} />)}
                </div>
              </div>
            </div>

            {/* Right card — Class 12 */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
              <SectionTitle title="Subjects offered for class 12" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {CLASS_12.map((s) => <SubjectItem key={s.code + s.name} {...s} />)}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
