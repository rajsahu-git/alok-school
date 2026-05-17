import { notFound } from 'next/navigation';
import PageHero from '@/core/widgets/shared/PageHero';
import TeamProfile from '@/core/widgets/academic/TeamProfile';
import { fetchById, fetchByCategory } from '@/lib/teamApi';

export default async function TeacherProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [member, all] = await Promise.all([fetchById(id), fetchByCategory('teaching')]);
  if (!member) notFound();
  const others = all.filter((m) => m._id !== id).slice(0, 10);
  return (
    <>
      <PageHero
        title={member.name}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Academic', href: '/academic' },
          { label: 'Our Teachers', href: '/academic/team/teachers' },
          { label: member.name },
        ]}
      />
      <TeamProfile member={member} others={others} backHref="/academic/team/teachers" backLabel="Our Teachers" />
    </>
  );
}
