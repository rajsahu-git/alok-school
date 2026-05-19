import ActivitySection from '@/core/widgets/activities/ActivitySection';
import { fetchActivityImages } from '@/lib/activityApi';

export default async function YogaPage() {
  const images = await fetchActivityImages('6a0c102a53f42b31d19e638f');
  return (
    <ActivitySection
      title="Yoga"
      breadcrumbLabel="Yoga"
      description="Yoga is an integral part of the holistic education at Alok School. Regular yoga sessions help students develop physical strength, mental clarity, and emotional balance. Rooted in ancient Indian tradition, our yoga program teaches breathing techniques, asanas, and mindfulness practices that equip students with lifelong tools for health and well-being. Yoga also helps improve concentration and academic performance."
      images={images}
    />
  );
}
