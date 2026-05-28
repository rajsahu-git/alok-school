import React from 'react';
import Link from 'next/link';
import TabNav from './TabNav';

interface ArticleThumbnail { fileId: string; viewLink: string; directLink: string; }
export interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: ArticleThumbnail;
  createdAt: string;
}

function ArticleCard({ article }: { article: Article }) {
  const imgUrl = article.thumbnail?.fileId
    ? `/api/drive-image?id=${article.thumbnail.fileId}`
    : null;
  const date = new Date(article.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <Link href={`/online/artical-media/${article.slug}`} className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {imgUrl ? (
        <div className="w-full aspect-video overflow-hidden bg-secondary">
          <img src={imgUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="w-full aspect-video bg-secondary flex items-center justify-center text-muted-foreground text-sm">No Image</div>
      )}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h2 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h2>
        <p className="text-xs text-muted-foreground mt-auto">{date}</p>
      </div>
    </Link>
  );
}


export default function MediaArtical({ articles }: { articles: Article[] }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      
      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
          <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">No articles yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => <ArticleCard key={a._id} article={a} />)}
        </div>
      )}
    </section>
  );
}
