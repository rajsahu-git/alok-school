import type { MetadataRoute } from 'next';

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alokschool.org';
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

const staticRoutes: { path: string; changeFrequency: ChangeFreq; priority: number }[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },

  { path: '/about-us', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/about-us/administrator', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/about-us/alok-kids', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/about-us/directors-pen', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/about-us/origin', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/about-us/our-alumni', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/about-us/principals-pen', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/about-us/vision-mission', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/about-us/why-alok', changeFrequency: 'yearly', priority: 0.5 },

  { path: '/academic/achievement', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/academic/annual_calendar', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/academic/calendar', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/academic/examination', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/academic/question-bank', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/academic/skill-subject', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/academic/team', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/academic/team/coordinator', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/academic/team/staff', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/academic/team/teachers', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/academic/video-tutorial', changeFrequency: 'monthly', priority: 0.5 },

  { path: '/activities/cultural', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/activities/literary', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/activities/martial-art', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/activities/social', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/activities/sports', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/activities/tours', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/activities/yoga', changeFrequency: 'yearly', priority: 0.5 },

  { path: '/admission', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/admission/fee-structure', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/admission/rules', changeFrequency: 'yearly', priority: 0.5 },

  { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/career', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },

  { path: '/gallery', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/gallery/images', changeFrequency: 'weekly', priority: 0.5 },
  { path: '/gallery/videos', changeFrequency: 'weekly', priority: 0.5 },

  { path: '/infrastructure/facilities', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/infrastructure/lab', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/infrastructure/library', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/infrastructure/transport', changeFrequency: 'yearly', priority: 0.5 },

  { path: '/online/alumni', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/online/artical-media', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/online/artical-media/media', changeFrequency: 'weekly', priority: 0.5 },
  { path: '/online/artical-media/news', changeFrequency: 'weekly', priority: 0.5 },
  { path: '/online/tc', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/online/uniform', changeFrequency: 'yearly', priority: 0.5 },

  { path: '/result/classX', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/result/classXII', changeFrequency: 'yearly', priority: 0.5 },
];

async function safeFetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function getBlogRoutes(): Promise<MetadataRoute.Sitemap> {
  const data = await safeFetchJson<{ blogs: { _id: string; createdAt: string }[] }>(
    `${API_BASE}/api/blog`
  );
  return (data?.blogs ?? []).map((b) => ({
    url: `${SITE_URL}/blog/${b._id}`,
    lastModified: b.createdAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
}

async function getArticleRoutes(): Promise<MetadataRoute.Sitemap> {
  const data = await safeFetchJson<{ articles: { slug: string; createdAt: string }[] }>(
    `${API_BASE}/api/articles/`
  );
  return (data?.articles ?? []).map((a) => ({
    url: `${SITE_URL}/online/artical-media/${a.slug}`,
    lastModified: a.createdAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
}

async function getGalleryRoutes(): Promise<MetadataRoute.Sitemap> {
  const data = await safeFetchJson<{ folders: { _id: string; createdAt: string }[] }>(
    `${API_BASE}/api/gallery/folder-gallery`
  );
  return (data?.folders ?? []).map((f) => ({
    url: `${SITE_URL}/gallery/${f._id}`,
    lastModified: f.createdAt,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));
}

async function getTeamRoutes(): Promise<MetadataRoute.Sitemap> {
  const categories: { category: string; segment: string }[] = [
    { category: 'coordinators', segment: 'coordinator' },
    { category: 'office staff', segment: 'staff' },
    { category: 'teaching', segment: 'teachers' },
  ];

  const results = await Promise.all(
    categories.map(({ category, segment }) =>
      safeFetchJson<{ members: { _id: string; createdAt: string }[] }>(
        `${API_BASE}/api/team/category/${encodeURIComponent(category)}`
      ).then((data) =>
        (data?.members ?? []).map((m) => ({
          url: `${SITE_URL}/academic/team/${segment}/${m._id}`,
          lastModified: m.createdAt,
          changeFrequency: 'yearly' as const,
          priority: 0.4,
        }))
      )
    )
  );

  return results.flat();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogRoutes, articleRoutes, galleryRoutes, teamRoutes] = await Promise.all([
    getBlogRoutes(),
    getArticleRoutes(),
    getGalleryRoutes(),
    getTeamRoutes(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  return [...staticEntries, ...blogRoutes, ...articleRoutes, ...galleryRoutes, ...teamRoutes];
}
