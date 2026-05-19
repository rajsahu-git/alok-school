import ActivitySection from '@/core/widgets/activities/ActivitySection';
import { fetchActivityImages } from '@/lib/activityApi';

export default async function ToursPage() {
  const images = await fetchActivityImages('6a0c104553f42b31d19e6391');
  return (
    <ActivitySection
      title="Tours and Picnic"
      breadcrumbLabel="Tours and Picnic"
      description="Educational tours and picnics at Alok School provide students with experiential learning opportunities beyond the classroom. From heritage site visits and nature trails to industrial tours and adventure camps, these excursions broaden students' horizons and deepen their understanding of the world. They also strengthen bonds of friendship and create cherished memories that last a lifetime."
      images={images}
    />
  );
}
