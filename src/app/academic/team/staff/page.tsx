import Teams from '@/core/widgets/academic/Teams';
import PageHero from '@/core/widgets/shared/PageHero';
import { fetchByCategory } from '@/lib/teamApi';

export default async function StaffPage() {
  const members = await fetchByCategory('staff');
  return (
    <>
      <PageHero title="Office Staff" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Academic', href: '/' }, { label: 'Office Staff' }]} />
      <Teams members={members} title="Office Staff" basePath="/academic/team/staff" />
    </>
  );
}
