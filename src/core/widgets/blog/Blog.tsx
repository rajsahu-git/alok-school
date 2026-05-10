import React from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/app/blog/page';

function getThumbnailUrl(thumbnail?: BlogPost['thumbnail']): string | null {
  if (!thumbnail?.fileId) return null;
  return `/api/drive-image?id=${thumbnail.fileId}`;
}

function BlogCard({ blog }: { blog: BlogPost }) {
  const imgUrl = getThumbnailUrl(blog.thumbnail);
  const date = new Date(blog.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <Link href={`/blog/${blog._id}`} className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {imgUrl ? (
        <div className="w-full aspect-video overflow-hidden bg-secondary">
          <img src={imgUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="w-full aspect-video bg-secondary flex items-center justify-center text-muted-foreground text-sm">No Image</div>
      )}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {blog.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{t}</span>
            ))}
          </div>
        )}
        <h2 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{blog.title}</h2>
        <p className="text-xs text-muted-foreground mt-auto">{date}</p>
      </div>
    </Link>
  );
}

export default function Blog({ blogs }: { blogs: BlogPost[] }) {
  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
        <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm">No blog posts yet.</p>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
      </div>
    </section>
  );
}
