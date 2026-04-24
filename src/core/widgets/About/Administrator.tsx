import Image from "next/image";
import PageHero from "@/core/widgets/shared/PageHero";

const members = [
  {
    name: "Dr. Pradeep Kumawat",
    role: "DIRECTOR",
    location: "ALOK SANSTHAN",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Manoj Kumawat",
    role: "ADMINISTRATION",
    location: "RAJSAMAND",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Nischay Kumawat",
    role: "ADMINISTRATION",
    location: "FATEHPURA",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Prateek Kumawat",
    role: "ASSOCIATE ADMINISTRATOR",
    location: "HIRAN MAGRI | PANCHWATI | CHITTOR.",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Dhruv Kumawat",
    role: "ASSOCIATE ADMINISTRATOR",
    location: "RAJSAMAND",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Shashank Tank",
    role: "PRINCIPAL",
    location: "HIRAN MAGRI",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Lalit Goswami",
    role: "PRINCIPAL",
    location: "RAJSAMAND",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Virendra Kumar Paliwal",
    role: "PRINCIPAL",
    location: "FATEHPURA",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Dr. Sangeeta Bhardwaj",
    role: "PRINCIPAL",
    location: "PANCHWATI",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Prem Kuwar Bhawar",
    role: "PRINCIPAL",
    location: "CHITTORGARH",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Niharika Kumawat",
    role: "ACADEMIC COORDINATOR",
    location: "",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Hitisha Kumawat",
    role: "ACADEMIC COORDINATOR",
    location: "",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
];

function Administrator() {
  return (
    <div>
      <PageHero
        title="Management"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Management" }]}
      />

      <section className="py-14 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((m) => (
              <div
                key={m.name}
                className="bg-card rounded-xl border border-border p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Circular image with decorative scalloped border */}
                <div className="relative w-36 h-36 mb-5">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "var(--secondary)",
                      clipPath:
                        "polygon(50% 0%,56% 2%,62% 0%,67% 4%,73% 3%,77% 8%,83% 8%,86% 14%,92% 15%,94% 21%,99% 24%,100% 30%,100% 37%,99% 43%,100% 49%,98% 55%,100% 61%,97% 67%,97% 73%,93% 78%,91% 84%,86% 88%,83% 93%,77% 96%,73% 100%,67% 100%,62% 98%,56% 100%,50% 98%,44% 100%,38% 100%,33% 97%,27% 96%,23% 92%,17% 89%,14% 84%,9% 80%,7% 74%,3% 70%,1% 64%,0% 58%,1% 52%,0% 46%,1% 40%,0% 34%,2% 28%,5% 22%,9% 17%,13% 12%,18% 8%,23% 5%,29% 3%,35% 1%,41% 0%,47% 2%)",
                    }}
                  />
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover rounded-full p-2"
                  />
                </div>

                <h3 className="text-base font-bold text-foreground mb-1">{m.name}</h3>
                <p className="text-xs font-semibold tracking-widest text-primary">{m.role}</p>
                {m.location && (
                  <p className="text-xs font-semibold tracking-widest text-primary mt-0.5">
                    {m.location}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Administrator;
