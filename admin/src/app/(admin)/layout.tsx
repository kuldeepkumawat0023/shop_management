import AdminLayout from "@/components/admin/layout/AdminLayout";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AuthGuard>
  );
}
