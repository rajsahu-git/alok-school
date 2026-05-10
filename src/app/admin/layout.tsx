import AdminGuard from "@/core/widgets/admin/AdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  
  return <AdminGuard>{children}</AdminGuard>;
}
