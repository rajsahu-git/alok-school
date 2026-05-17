import OurAlumni from "@/core/widgets/About/OurAlumni";
import PageHero from "@/core/widgets/shared/PageHero";

export interface AlumniItem {
  _id: string;
  name: string;
  batch: string;
  currentPosition: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  image: { fileId: string; viewLink: string; directLink: string };
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function getAlumni(): Promise<AlumniItem[]> {
  try {
    const res = await fetch(`${BASE}/api/alumni`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export default async function OurAlumniPage() {
  const alumni = await getAlumni();
  return (
    <>
      <PageHero
        title="Our Alumni"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us", href: "/about-us" }, { label: "Our Alumni" }]}
      />
      <OurAlumni alumni={alumni} />
    </>
  );
}
