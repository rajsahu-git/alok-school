import ActivitySection from '@/core/widgets/activities/ActivitySection';
import { fetchActivityImages } from '@/lib/activityApi';

export default async function MartialArtPage() {
  const images = await fetchActivityImages('6a0c105053f42b31d19e6392');
  return (
    <ActivitySection
      title="Martial Art"
      breadcrumbLabel="Martial Art"
      description="Martial arts training at Alok School instills discipline, self-defense skills, and mental fortitude in students. Our certified instructors teach various forms of martial arts that build physical strength, agility, and focus. Beyond the physical benefits, martial arts training develops respect, perseverance, and self-confidence — qualities that serve students well in every aspect of life."
      images={images}
    />
  );
}
