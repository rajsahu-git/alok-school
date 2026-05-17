export interface TeamMember {
  _id: string;
  name: string;
  category: string;
  designation: string;
  education: string;
  experience: string;
  bio?: string;
  email?: string;
  phone?: string;
  order: number;
  isActive: boolean;
  image: { fileId: string; viewLink: string; directLink: string };
  createdAt: string;
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export async function fetchByCategory(category: string): Promise<TeamMember[]> {
  try {
    const res = await fetch(`${BASE}/api/team/category/${encodeURIComponent(category)}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.members ?? [];
  } catch { return []; }
}

export async function fetchById(id: string): Promise<TeamMember | null> {
  try {
    const res = await fetch(`${BASE}/api/team/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export function getImgUrl(image: TeamMember['image']) {
  return `/api/drive-image?id=${image.fileId}`;
}
