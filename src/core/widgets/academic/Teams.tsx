'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { TeamMember } from '@/lib/teamApi';
import { getImgUrl } from '@/lib/teamApi';

function MemberCard({ member, href }: { member: TeamMember; href: string }) {
  const photo = getImgUrl(member.image);
  const [loaded, setLoaded] = useState(false);

  return (
    <Link href={href} className="group flex flex-col">
      {/* Full-body image */}
      <div className="relative w-full overflow-hidden rounded-t-xl bg-secondary" style={{ minHeight: 320 }}>
        {/* Skeleton */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-secondary animate-pulse">
            <div className="w-20 h-20 rounded-full bg-border" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-28 h-3 rounded bg-border" />
              <div className="w-20 h-3 rounded bg-border" />
            </div>
          </div>
        )}
        <img
          src={photo}
          alt={member.name}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ minHeight: 320 }}
        />
      </div>

      {/* Info bar */}
      <div className="w-full flex flex-col bg-primary items-center justify-center gap-1.5 px-4 py-4 rounded-b-xl">
        <p className="text-white text-sm font-bold uppercase tracking-wide text-center leading-snug">
          {member.name}
        </p>
        <p className="text-white text-sm font-medium text-center">
          {member.designation}
        </p>
        <span className="text-accent text-xs font-medium text-center mt-1">View Profile</span>
      </div>
    </Link>
  );
}

interface TeamsProps {
  members: TeamMember[];
  title: string;
  basePath: string;
}

export default function Teams({ members, title, basePath }: TeamsProps) {
  console.log(members)
  return (
    <section className="py-14 bg-background">
      <div className="container flex flex-col gap-10">

        {/* Heading */}

        {/* Grid */}
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm">No members found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...members].sort((a, b) => new Date(b.order).getTime() - new Date(a.order).getTime()).map((m) => (
              <MemberCard key={m._id} member={m} href={`${basePath}/${m._id}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
