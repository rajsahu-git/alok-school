import ActivitySection from '@/core/widgets/activities/ActivitySection';
import { fetchActivityImages } from '@/lib/activityApi';

export default async function CulturalPage() {
  const images = await fetchActivityImages('6a0c101653f42b31d19e638d');
  return (
    <ActivitySection
      title="Cultural Activities"
      breadcrumbLabel="Cultural"
      description="Cultural activities at Alok School celebrate the rich diversity and heritage of India. From vibrant dance performances and music concerts to drama productions and art exhibitions, our students get a platform to express their creativity and talent. These events foster cultural appreciation, boost confidence, and create a sense of unity and pride among the school community."
      images={images}
    />
  );
}
