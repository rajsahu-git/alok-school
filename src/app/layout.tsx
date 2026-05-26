import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/core/context/AuthContext";
import RootShell from "@/core/widgets/shared/RootShell";
import FloatingActions from "@/core/widgets/shared/FloatingActions";

const inter = Inter({
  variable: "--font-inter",
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

export const metadata: Metadata = {
  title: "Alok Sansthan",
  description: "A Truly Indian International Educational Institution",
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <RootShell>{children}</RootShell>
          <FloatingActions />
        </AuthProvider>
      </body>
    </html>
  );
}
