import Teams from '@/core/widgets/academic/Teams';
import PageHero from '@/core/widgets/shared/PageHero';
import { fetchByCategory } from '@/lib/teamApi';

export default async function CoordinatorPage() {
  const members = await fetchByCategory('coordinators');
  return (
    <>
      <PageHero title="Coordinators" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Academic', href: '/' }, { label: 'Coordinators' }]} />
      <Teams members={members} title="Coordinators" basePath="/academic/team/coordinator" />
    </>
  );
}
