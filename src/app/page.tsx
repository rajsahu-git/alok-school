import AlokHistory, { AlokKidsPlanet } from "@/core/widgets/home/AlokHistory";
import AlokValue from "@/core/widgets/home/AlokValue";
import HomeSlider from "@/core/widgets/home/HomeSlider";
import AlokGalllery from "@/core/widgets/home/AlokGalllery";
import ContactForm from "@/core/widgets/home/ContactForm";

export default function Home() {
  return (
    <main>
      <HomeSlider />
      <AlokValue />
      <AlokHistory />
      <AlokKidsPlanet />
      <AlokGalllery />
      <ContactForm />
    </main>
  );
}