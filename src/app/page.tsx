import AlokHistory, { AlokKidsPlanet } from "@/core/widgets/home/AlokHistory";
import AlokValue from "@/core/widgets/home/AlokValue";
import HomeSlider from "@/core/widgets/home/HomeSlider";
import AlokGalllery from "@/core/widgets/home/AlokGalllery";
import ContactForm from "@/core/widgets/home/ContactForm";

const FALLBACK_SLIDES = [
  "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/unnamed_1_zsknt1.webp",
  "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/IMG-20260122-WA0035_xvxdyb.jpg",
  "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/1000228002_702927b04699c8c9175768120d5645f5-27_2_2026_6_45_48_pm_skmcqn.jpg",
  "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053860/IMG-20260122-WA0021_ud2n5r.jpg",
  "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053861/1000227993_981863f509043ff2e07b9dc4970ad896-7_3_2026_10_18_06_pm_tbpnqc.jpg",
  "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053861/IMG-20260122-WA0020_kl1rqe.jpg",
  "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776053862/1000271794_75b19fed4ec27a229461118b059b7e56-7_3_2026_10_55_52_pm_errw5c.png",
];

async function getBannerSlides(): Promise<string[]> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
  try {
    const res = await fetch(`${base}/api/gallery/banner-images`, { cache: "no-store" });
    if (!res.ok) return FALLBACK_SLIDES;
    const data = await res.json();
    const urls = (data.images ?? []).map((b: { fileId: string }) => `/api/drive-image?id=${b.fileId}`);
    return urls.length ? urls : FALLBACK_SLIDES;
  } catch {
    return FALLBACK_SLIDES;
  }
}

export default async function Home() {
  const slides = await getBannerSlides();

  return (
    <main>
      <HomeSlider slides={slides} />
      <AlokValue />
      <AlokHistory />
      <AlokKidsPlanet />
      <AlokGalllery />
      <ContactForm />
    </main>
  );
}