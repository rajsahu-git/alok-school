import ActivitySection from '@/core/widgets/activities/ActivitySection';
import { fetchActivityImages } from '@/lib/activityApi';

export default async function SocialPage() {
  const images = await fetchActivityImages('6a0c100353f42b31d19e638c');
  return (
    <ActivitySection
      title="Social Activities"
      breadcrumbLabel="Social"
      description="At Alok School, social activities play a vital role in shaping responsible and compassionate citizens. Our students actively participate in community service, awareness drives, and social welfare programs that instill values of empathy, teamwork, and civic responsibility. These initiatives help students connect with the world beyond the classroom and develop a strong sense of social consciousness."
      images={images}
    />
  );
}
