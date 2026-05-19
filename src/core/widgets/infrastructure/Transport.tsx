import PageHero from "@/core/widgets/shared/PageHero";

const BUS_ROUTES = [
  {
    id: "B",
    stops:
      "विद्यालय कार्यालय → नागपुरा → 100 नखलिया रोड → खान बाग → कलेक्ट्रेट → पुलिस थाना → कोठारिया रोड → नूतन → आलोक स्कूल",
  },
  {
    id: "N",
    stops:
      "कुचेला → अलकापुरी 100 फीट रोड → गोविंदा - 1 → गोविंदा - 2 → महिला कल्याण केंद्र → गोविंदा मेला → तालाब → नगरपालिका → आलोक स्कूल",
  },
  {
    id: "C",
    stops:
      "रीठा का तेवरा → केलवा कुलपोषण → हेलीपेड → राजा विहार → ई. जिंदगानी → केलवाड़ चौक → केलवाड़ थाना → गोविंदा (मुड़) → तालाब → आलोक स्कूल",
  },
  {
    id: "K",
    stops:
      "पीतलकारी का अड्डा → भड़ा अड्डा → धान्यमंडी मंदिर रसोई → नं. के. कॉलोनी → देवी कोठान → गोविंदा → आलोक स्कूल",
  },
  {
    id: "R",
    stops:
      "50 फीट रोड → दशिका हॉस्पिटल → आवासीयकारी → भाव आवासी अकादमिक रोड → विवेकानंद चौराहा → नं. जी. के. कॉलोनी → अड़ के पुलिया → आलोक स्कूल → हाउसिंग बोर्ड → आवासीय मंडल → आलोक मंडल → नं. जी. के. कॉलोनी → अड़ के पुलिया → आलोक स्कूल",
  },
  {
    id: "D",
    stops:
      "दाना रामसिंह चौराहा → आवासीयी → महिला पॉलिटेक्निक कॉलेज अधिकारिता → आनापुरा चौराहा → गोलमाल मार्केट → गोविंदिया मार्केट → राजकीय कॉलेज → अनुसंधान कॉलेज → वर्ग पेट्रोल पंप → तालाब → आलोक स्कूल",
  },
  {
    id: "I",
    stops:
      "देवपुर → केलवाड़ चौराहा → आनापुरी हर्षी → केलवाड़ पेट्रोल पंप → कलावती मार्केट → विद्यापुर पुल → लोकेश पुरा → पाइपलाइन - 1 → कोटपुरा - 1 → गोटेगांव - 2 → मोटेगांव - 2 → अनावलसर → आलोक स्कूल",
  },
  {
    id: "E",
    stops: "सुभद्रा गांव → तालाब → अनावलसर गांव → आलोक स्कूल",
  },
  {
    id: "A",
    stops:
      "जीवाली → रतनपुरा बस डिपो → जीवाना मड़ा → हाथी सड़कपुरा → आवासीय कॉलोनी → आवासी मार्केट → तालाब → कलाजी गोठानी → कालेजपुरा → कचना → आलोक स्कूल",
  },
  {
    id: "G",
    stops:
      "पुलिस लाइन → जेठाडी → 100 मीटर → कचना → जावा → जावाटलकी → आलोक स्कूल",
  },
  {
    id: "F",
    stops:
      "कुदल → कुदाल चौराहा → कुंवारिया → कलिया → मोड़ी → मोहनपुरा कॉलोनी → माही फाटक → हाउसिंग बोर्ड → आलोक स्कूल",
  },
  {
    id: "J",
    stops:
      "सदर गांव → आकांड गांव → आकांड हाइवेपुरी → कचना गांव → पीचपा → आलोक स्कूल",
  },
  {
    id: "P",
    stops:
      "बखारा → अदला → कोठारी → पीचपा - 1 → पीचपा - 2 → पीचपा - 1 → आलोक स्कूल",
  },
];

export default function Transport() {
  return (
    <div>
      <PageHero
        title="Transport"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Infrastructure", href: "/infrastructure" },
          { label: "Transport" },
        ]}
      />

      <section className="py-14 bg-background">
        <div className="container max-w-5xl mx-auto flex flex-col gap-6">

          {/* Section heading */}
          <div className="text-center">
            <h2 className="text-base md:text-lg font-bold text-primary underline underline-offset-4 tracking-wide uppercase">
              Bus Facility Available for Following Stands
            </h2>
            <div className="flex items-center justify-center mt-4">
              {/* Bus icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78A2.99 2.99 0 0020 16V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z" />
              </svg>
            </div>
          </div>

          {/* Bus routes */}
          <div className="flex flex-col gap-0">
            {BUS_ROUTES.map((route) => (
              <div key={route.id} className="flex flex-col items-center py-4 border-b border-border last:border-b-0">
                <p className="text-sm font-bold text-primary mb-2 tracking-wide">
                  BUS – ({route.id})
                </p>
                <p className="text-sm text-foreground text-center leading-relaxed px-4">
                  {route.stops}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
