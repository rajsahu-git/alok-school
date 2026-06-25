import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/core/context/AuthContext";
import RootShell from "@/core/widgets/shared/RootShell";
import FloatingActions from "@/core/widgets/shared/FloatingActions";



const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rajsamand.alokschool.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Alok Sansthan",
  description: "A Truly Indian International Educational Institution",
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
  openGraph: {
    title: "Alok Sansthan",
    description: "A Truly Indian International Educational Institution",
    siteName: "Alok Sansthan",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Alok Sansthan",
    description: "A Truly Indian International Educational Institution",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <RootShell>{children}</RootShell>

          <FloatingActions />
        </AuthProvider>
      </body>
    </html>
  );
}
