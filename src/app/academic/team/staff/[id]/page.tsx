import { notFound } from 'next/navigation';
import PageHero from '@/core/widgets/shared/PageHero';
import TeamProfile from '@/core/widgets/academic/TeamProfile';
import { fetchById, fetchByCategory } from '@/lib/teamApi';

export default async function StaffProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [member, all] = await Promise.all([fetchById(id), fetchByCategory('office staff')]);
  if (!member) notFound();
  const others = all.filter((m) => m._id !== id).slice(0, 10);
  return (
    <>
      <PageHero
        title={member.name}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Academic', href: '/' },
          { label: 'Office Staff', href: '/academic/team/staff' },
          { label: member.name },
        ]}
      />
      <TeamProfile member={member} others={others} backHref="/academic/team/staff" backLabel="Office Staff" />
    </>
  );
}
