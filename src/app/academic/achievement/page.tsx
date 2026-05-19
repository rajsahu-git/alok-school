import Achievement from '@/core/widgets/academic/Achievement';
import PageHero from '@/core/widgets/shared/PageHero';

interface AchievementItem {
  _id: string;
  image: { fileId: string; viewLink: string; directLink: string };
  createdAt: string;
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

async function getAchievements(): Promise<AchievementItem[]> {
  try {
    const res = await fetch(`${BASE}/api/achievement`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.achievements ?? [];
  } catch { return []; }
}

export default async function AchievementPage() {
  const achievements = await getAchievements();
  return (
    <>
      <PageHero
        title=" Our Achievements"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Academic', href: '/academic' },
          { label: 'Achievement' },
        ]}
      />
      <Achievement achievements={achievements} />
    </>
  );
}
