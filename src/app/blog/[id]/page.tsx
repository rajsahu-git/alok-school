import { notFound } from 'next/navigation';
import PageHero from '@/core/widgets/shared/PageHero';
import BlogDetail from '@/core/widgets/blog/BlogDetail';
import type { BlogPost } from '@/app/blog/page';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

async function getBlog(id: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${BASE}/api/blog/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await getBlog(id);
  if (!blog) notFound();
    console.log("Hello.....")
  return (
    <>
      <PageHero
        title={blog.title}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: blog.title },
        ]}
      />
      <BlogDetail blog={blog} />
    </>
  );
}
