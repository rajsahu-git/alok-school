"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/core/widgets/home/Navbar";
import Footer from "@/core/widgets/home/Footer";
import TopBar from "@/core/widgets/home/TopBar";

export default function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/auth");

  return (
    <>
      {!isAdmin && <TopBar />}
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}
