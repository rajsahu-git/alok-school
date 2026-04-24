import Image from "next/image";

const alumni = [
  {
    name: "Mahesh Gagoria",
    role: "SDM Mandalgarh (Bhilwara)",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Ayush Talesara",
    role: "Software Engineer (Amazon)",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Ronak Kumawat",
    role: "Senior Clinical Research Associate (Biosite Research Pvt. Ltd.)",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Dr. Divyanshu Sharma",
    role: "Senior Medical Officer, Health Dept., Khamnor Block",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Dr. Prachi Paliwal",
    role: "Specialist Medical Officer (GYNE), Nathdwara",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "CA Payal Bhandari",
    role: "Senior Manager, Edelweiss Asset Reconstruction Company Ltd, Mumbai",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Ashish Kawdia",
    role: "Risk Policy Vice President, IDFC First Bank, Mumbai",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Nishit Nandwana",
    role: "Vice President Operations (Everise, Malaysia)",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Sarthak Gaur",
    role: "Assistant Manager (Kotak Bank, Kolhapur)",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Nitish Nandwana",
    role: "Software Development Specialist, Bosch MNC Bengaluru",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Priyanka Agarwal",
    role: "Art Of Living Facilitator / Content Writer",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Nidhi Rathore",
    role: "Sr. Digital Manager (Innosoft Group & Bettoblock)",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Rajshree Atul Paliwal",
    role: "Advocate",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Manav Sant",
    role: "Advocate",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Leena Nandwana",
    role: "Payroll Administrator (QX Ahmedabad)",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Ashish Khandelwal",
    role: "Asst. Consultant (TCS, Pune)",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Gaurav Soni",
    role: "Hydraulics Engineer (United Steel Industries LLC, UAE)",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Piyush Verma",
    role: "Asst. Manager (Hindustan Zinc Limited, Dariba)",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Suchi Nandwana",
    role: "MIS Manager (IRGY Rajsamand)",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
  {
    name: "Ayan Joshi",
    role: "Sarpanch (Nirmal Gram Panchayat, Pasoond)",
    image: "https://res.cloudinary.com/dw63rrqkr/image/upload/v1776081713/chairman_mhunyo.png",
  },
];

function OurAlumni() {
  return (
    <section className="py-16 bg-background">
      <div className="container">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "Georgia, serif", color: "var(--primary)" }}
          >
            Our Alumni
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="block w-12 h-px bg-accent" />
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            <span className="block w-12 h-px bg-accent" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {alumni.map((a) => (
            <div
              key={a.name}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full aspect-[3/3.5] overflow-hidden">
                <Image
                  src={a.image}
                  alt={a.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Info */}
              <div className="px-4 py-4 flex flex-col flex-1 border-t-2 border-primary/10 group-hover:border-primary transition-colors duration-300">
                <p className="text-sm font-bold text-foreground leading-snug mb-1">
                  {a.name}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {a.role}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default OurAlumni;
