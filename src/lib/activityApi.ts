const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export interface GalleryImage {
  _id: string;
  fileId: string;
  fileName: string;
  viewLink: string;
}

export async function fetchActivityImages(folderId: string): Promise<GalleryImage[]> {
  try {
    const res = await fetch(`${BASE}/api/gallery/folder/${folderId}/images`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.images ?? [];
  } catch { return []; }
}
