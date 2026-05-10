import Blog from '@/core/widgets/blog/Blog';
import PageHero from '@/core/widgets/shared/PageHero';

interface BlogThumbnail { fileId: string; viewLink: string; directLink: string; }
export interface BlogPost {
  _id: string;
  title: string;
  blog: string;
  language: string;
  tags: string[];
  thumbnail?: BlogThumbnail;
  createdAt: string;
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

async function getBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BASE}/api/blog`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.blogs ?? [];
  } catch { return []; }
}

export default async function BlogPage() {
  const blogs = await getBlogs();
  return (
    <>
      <PageHero title="Blog" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
      <Blog blogs={blogs} />
    </>
  );
}
