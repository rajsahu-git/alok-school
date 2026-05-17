import { notFound } from 'next/navigation';
import PageHero from '@/core/widgets/shared/PageHero';
import TeamProfile from '@/core/widgets/academic/TeamProfile';
import { fetchById, fetchByCategory } from '@/lib/teamApi';

export default async function CoordinatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [member, all] = await Promise.all([fetchById(id), fetchByCategory('coordinator')]);
  if (!member) notFound();
  const others = all.filter((m) => m._id !== id).slice(0, 10);
  return (
    <>
      <PageHero
        title={member.name}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Academic', href: '/academic' },
          { label: 'Coordinators', href: '/academic/team/coordinator' },
          { label: member.name },
        ]}
      />
      <TeamProfile member={member} others={others} backHref="/academic/team/coordinator" backLabel="Coordinators" />
    </>
  );
}
