import ActivitySection from '@/core/widgets/activities/ActivitySection';
import { fetchActivityImages } from '@/lib/activityApi';

export default async function SportsPage() {
  const images = await fetchActivityImages('6a0c101f53f42b31d19e638e');
  return (
    <ActivitySection
      title="Sports"
      breadcrumbLabel="Sports"
      description="Sports at Alok School go beyond physical fitness — they build character, discipline, and the spirit of healthy competition. Our students participate in a wide range of indoor and outdoor sports including cricket, football, basketball, athletics, and more. With professional coaching and state-of-the-art facilities, we nurture champions who represent the school at district, state, and national levels."
      images={images}
    />
  );
}
