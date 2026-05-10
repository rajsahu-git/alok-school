import VideoGallery from '@/core/widgets/gallery/VideoGallery';
import React from 'react'


interface Video {
  _id: string;
  title?: string;
  videoLink: string;
  createdAt: string;
}
interface VideosResponse  { count: number; videos: Video[];  }
const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

async function page() {
     const [ videos] = await Promise.all([ getVideos()]);
    async function getVideos(): Promise<Video[]> {
  const res = await fetch(`${BASE}/api/gallery/video`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data: VideosResponse = await res.json();
  return data.videos ?? [];
}
  return (
      <VideoGallery videos={videos} />
  )
}

export default page