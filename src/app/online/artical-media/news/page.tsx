import MediaArtical from '@/core/widgets/academic/MediaArtical';
import PageHero from '@/core/widgets/shared/PageHero';
import type { Article } from '@/core/widgets/academic/MediaArtical';
import TabNav from '@/core/widgets/academic/TabNav';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${BASE}/api/articles/`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles ?? [];
  } catch { return []; }
}

export default async function ArticalMediaPage() {
  const articles = await getArticles();
  return (
    <>
      <PageHero title="School News / Articles" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'School News / Articles' }]} />
      <TabNav />
      <MediaArtical articles={articles} />
    </>
  );
}