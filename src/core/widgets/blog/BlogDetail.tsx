import React from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/app/blog/page';

function getThumbnailUrl(thumbnail?: BlogPost['thumbnail']): string | null {
  if (!thumbnail?.fileId) return null;
  return `/api/drive-image?id=${thumbnail.fileId}`;
}

export default function BlogDetail({ blog }: { blog: BlogPost }) {
  const imgUrl = getThumbnailUrl(blog.thumbnail);
  const date = new Date(blog.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <article className="max-w-3xl mx-auto px-4 py-10 overflow-hidden">
      {/* Back */}
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </Link>

      {/* Thumbnail */}
      {imgUrl && (
        <div className="w-full rounded-2xl overflow-hidden mb-6 aspect-video bg-secondary">
          <img src={imgUrl} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {blog.tags?.length > 0 && blog.tags.map((t) => (
          <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{t}</span>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">{date}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{blog.title}</h1>

      {/* Divider */}
      <div className="w-16 h-1 bg-primary rounded-full mb-8" />

      {/* Content */}
      <div
        className="prose prose-sm md:prose-base max-w-none text-foreground
          [&_*]:break-words [&_*]:overflow-wrap-anywhere
          prose-headings:font-bold prose-headings:text-foreground
          prose-p:leading-relaxed prose-p:text-foreground prose-p:break-words
          prose-a:text-primary prose-a:underline
          prose-img:rounded-xl prose-img:my-4 prose-img:max-w-full
          prose-ul:list-disc prose-ol:list-decimal
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
          prose-table:border-collapse prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2
          prose-th:border prose-th:border-border prose-th:px-3 prose-th:py-2 prose-th:bg-secondary"
        style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
        dangerouslySetInnerHTML={{ __html: blog.blog }}
      />
    </article>
  );
}
