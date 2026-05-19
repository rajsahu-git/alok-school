import ActivitySection from '@/core/widgets/activities/ActivitySection';
import { fetchActivityImages } from '@/lib/activityApi';

export default async function LiteraryPage() {
  const images = await fetchActivityImages('6a0c103753f42b31d19e6390');
  return (
    <ActivitySection
      title="Literary Activities"
      breadcrumbLabel="Literary"
      description="Literary activities at Alok School nurture a love for language, reading, and creative expression. Students participate in debates, elocution contests, creative writing competitions, spell bees, and book clubs that sharpen their communication skills and critical thinking. These activities encourage students to articulate their thoughts confidently and develop a lifelong passion for literature and learning."
      images={images}
    />
  );
}
