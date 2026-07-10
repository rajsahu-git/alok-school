"use client";

import { useState } from "react";

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342a3 3 0 100 2.316m0-2.316a3 3 0 100-2.316m0 2.316l6.632 3.316m0-9.632a3 3 0 105.964.632 3 3 0 00-5.964-.632zm0 0L8.684 11.658m6.632 6.632a3 3 0 105.964-.632 3 3 0 00-5.964.632z" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

function resolveUrl(url: string) {
  return url.startsWith("http") ? url : `${window.location.origin}${url}`;
}

export default function ShareButtons({ url, title, className = "" }: { url: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl = resolveUrl(url);
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title, url: fullUrl }); } catch { /* user cancelled */ }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${fullUrl}`)}`, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(resolveUrl(url));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <button type="button" onClick={handleShare} aria-label="Share"
        className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
        <ShareIcon />
      </button>
      <button type="button" onClick={handleCopy} aria-label="Copy link"
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${copied ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground"}`}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      {copied && <span className="text-xs text-green-600 font-medium">Copied!</span>}
    </div>
  );
}
