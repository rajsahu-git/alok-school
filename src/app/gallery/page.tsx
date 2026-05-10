import ImageGallery from '@/core/widgets/gallery/ImageGallery';
import VideoGallery from '@/core/widgets/gallery/VideoGallery';

interface Folder {
  _id: string;
  name: string;
  viewLink: string;
  coverImage?: string;
  createdAt: string;
}

interface Video {
  _id: string;
  title?: string;
  videoLink: string;
  createdAt: string;
}

interface FoldersResponse { count: number; folders: Folder[]; }
interface VideosResponse  { count: number; videos: Video[];  }

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

async function getFolders(): Promise<Folder[]> {
  const res = await fetch(`${BASE}/api/gallery/folder-gallery`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data: FoldersResponse = await res.json();
  return data.folders ?? [];
}

async function getVideos(): Promise<Video[]> {
  const res = await fetch(`${BASE}/api/gallery/video`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data: VideosResponse = await res.json();
  return data.videos ?? [];
}

export default async function GalleryPage() {
  const [folders, videos] = await Promise.all([getFolders(), getVideos()]);

  return (
    <div>
      <ImageGallery folders={folders} />
      <VideoGallery videos={videos} />
    </div>
  );
}
