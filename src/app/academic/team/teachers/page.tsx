import Teams from '@/core/widgets/academic/Teams';
import PageHero from '@/core/widgets/shared/PageHero';
import { fetchByCategory } from '@/lib/teamApi';

export default async function TeachersPage() {
  const members = await fetchByCategory('teaching');
  return (
    <>
      <PageHero title="Our Teachers" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Academic', href: '/' }, { label: 'Our Teachers' }]} />
      <Teams members={members} title="Our Teachers" basePath="/academic/team/teachers" />
    </>
  );
}
