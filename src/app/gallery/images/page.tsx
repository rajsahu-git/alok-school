import ImageGallery from '@/core/widgets/gallery/ImageGallery';

interface Folder {
  _id: string;
  name: string;
  viewLink: string;
  coverImage?: string;
  createdAt: string;
}

interface FoldersResponse {
  count: number;
  folders: Folder[];
}

async function getFolders(): Promise<Folder[]> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
  const res = await fetch(`${base}/api/gallery/folder-gallery`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data: FoldersResponse = await res.json();
  return data.folders ?? [];
}

export default async function GalleryPage() {
  const folders = await getFolders();
  console.log(folders)
  return (
    <div>
      <ImageGallery folders={folders} />
    </div>
  );
}
