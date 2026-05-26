import Link from 'next/link';
import type { TeamMember } from '@/lib/teamApi';
import { getImgUrl } from '@/lib/teamApi';

const SCALLOP =
  "polygon(50% 0%,56% 2%,62% 0%,67% 4%,73% 3%,77% 8%,83% 8%,86% 14%,92% 15%,94% 21%,99% 24%,100% 30%,100% 37%,99% 43%,100% 49%,98% 55%,100% 61%,97% 67%,97% 73%,93% 78%,91% 84%,86% 88%,83% 93%,77% 96%,73% 100%,67% 100%,62% 98%,56% 100%,50% 98%,44% 100%,38% 100%,33% 97%,27% 96%,23% 92%,17% 89%,14% 84%,9% 80%,7% 74%,3% 70%,1% 64%,0% 58%,1% 52%,0% 46%,1% 40%,0% 34%,2% 28%,5% 22%,9% 17%,13% 12%,18% 8%,23% 5%,29% 3%,35% 1%,41% 0%,47% 2%)";

interface TeamProfileProps {
  member: TeamMember;
  others: TeamMember[];
  backHref: string;
  backLabel: string;
}

export default function TeamProfile({ member, others, backHref, backLabel }: TeamProfileProps) {
  const photo = getImgUrl(member.image);

  return (
    <section className="py-14 bg-background">
      <div className="container flex flex-col gap-14">

        {/* ── Main profile ── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {/* Left — full body photo */}
          <div className="flex-shrink-0 flex justify-center w-full lg:w-auto">
            <div className="relative w-64 md:w-72">
              <img
                src={photo}
                alt={member.name}
                className="w-full object-cover object-top rounded-2xl"
                style={{ minHeight: 380 }}
              />
            </div>
          </div>

          {/* Right — info */}
          <div className="flex flex-col gap-6 flex-1 pt-2">

            {/* Name + designation */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
                {member.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Designation – {member.designation}
              </p>
            </div>

            {/* Info card */}
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-5 shadow-sm">
              {/* Accent bar */}
              <div className="w-8 h-1 bg-primary rounded-full" />

              {/* Education */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-bold text-foreground w-32 flex-shrink-0">Education</span>
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wide">
                  {member.education}
                </span>
              </div>

              {/* Experience */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-bold text-foreground w-32 flex-shrink-0">Experience</span>
                <span className="text-sm font-semibold text-primary">{member.experience}</span>
              </div>

              {/* Email */}
              {member.email && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm font-bold text-foreground w-32 flex-shrink-0">Email</span>
                  <a href={`mailto:${member.email}`} className="text-sm text-primary hover:underline">{member.email}</a>
                </div>
              )}

              {/* Phone */}
              {member.phone && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm font-bold text-foreground w-32 flex-shrink-0">Phone</span>
                  <span className="text-sm font-semibold text-primary">{member.phone}</span>
                </div>
              )}

              {/* Bio */}
              {member.bio && (
                <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
                  <span className="text-sm font-bold text-foreground">About</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              )}
            </div>

            {/* Back link */}
            <Link href={backHref}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to {backLabel}
            </Link>
          </div>
        </div>

        {/* ── Other members ── */}
        

      </div>
    </section>
  );
}
