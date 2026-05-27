import UserAccessManager from "@/core/admin/components/UserAccessManager";
import RoleGuard from "@/core/widgets/admin/RoleGuard";

export default function UserAccessPage() {
  return (
    <RoleGuard allowedRoles={["superadmin"]}>
      <UserAccessManager />
    </RoleGuard>
  );
}
