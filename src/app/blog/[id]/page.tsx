import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageHero from '@/core/widgets/shared/PageHero';
import BlogDetail from '@/core/widgets/blog/BlogDetail';
import type { BlogPost } from '@/app/blog/page';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rajsamand.alokschool.org';

async function getBlog(id: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${BASE}/api/blog/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

function stripHtml(html: string, maxLength = 160): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlog(id);
  if (!blog) return {};

  const description = stripHtml(blog.blog);
  const imageUrl = blog.thumbnail?.fileId
    ? `${SITE_URL}/api/drive-image?id=${blog.thumbnail.fileId}`
    : undefined;

  return {
    title: blog.title,
    description,
    openGraph: {
      title: blog.title,
      description,
      url: `${SITE_URL}/blog/${id}`,
      type: 'article',
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: blog.title }] : undefined,
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: blog.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await getBlog(id);
  if (!blog) notFound();
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
