import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/core/widgets/shared/PageHero';
import type { Article } from '@/core/widgets/academic/MediaArtical';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rajsamand.alokschool.org';

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${BASE}/api/articles/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function getAllArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${BASE}/api/articles/`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles ?? [];
  } catch { return []; }
}

function stripHtml(html: string, maxLength = 160): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  const description = stripHtml(article.content);
  const imageUrl = article.thumbnail?.fileId
    ? `${SITE_URL}/api/drive-image?id=${article.thumbnail.fileId}`
    : undefined;

  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
      url: `${SITE_URL}/online/artical-media/${slug}`,
      type: 'article',
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: article.title }] : undefined,
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: article.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([getArticle(slug), getAllArticles()]);
  if (!article) notFound();
  const others = allArticles.filter((a) => a.slug !== slug);

  const imgUrl = article.thumbnail?.fileId
    ? `/api/drive-image?id=${article.thumbnail.fileId}`
    : null;
  const date = new Date(article.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      {/* <PageHero
        title={article.title}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Articles', href: '/online/artical-media' },
          { label: article.title },
        ]}
      /> */}
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10">
        {/* Main content */}
        <article className="flex-1 min-w-0 overflow-hidden">
          <Link href="/online/artical-media" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Articles
          </Link>

          {imgUrl && (
            <div className="w-full rounded-2xl overflow-hidden mb-6 aspect-video bg-secondary">
              <img src={imgUrl} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          <p className="text-xs text-muted-foreground mb-3">{date}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{article.title}</h1>
          <div className="w-16 h-1 bg-primary rounded-full mb-8" />

          <div
            className="prose prose-sm md:prose-base max-w-none text-foreground
              [&_*]:break-words [&_*]:overflow-wrap-anywhere
              prose-headings:font-bold prose-headings:text-foreground
              prose-p:leading-relaxed prose-p:text-foreground
              prose-a:text-primary prose-a:underline
              prose-img:rounded-xl prose-img:my-4 prose-img:max-w-full
              prose-ul:list-disc prose-ol:list-decimal
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground"
            style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Sidebar */}
        {others.length > 0 && (
          <aside className="w-full lg:w-72 shrink-0">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Other Articles</h3>
            <div className="flex flex-col gap-4">
              {others.map((a) => {
                const thumb = a.thumbnail?.fileId ? `/api/drive-image?id=${a.thumbnail.fileId}` : null;
                return (
                  <Link key={a._id} href={`/online/artical-media/${a.slug}`} className="group flex gap-3 items-start rounded-xl border border-border bg-card p-3 hover:shadow-md transition-shadow">
                    {thumb ? (
                      <img src={thumb} alt={a.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-secondary shrink-0" />
                    )}
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-3 group-hover:text-primary transition-colors">{a.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
