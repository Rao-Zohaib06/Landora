import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminGuard } from "@/components/admin/admin-guard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Landora",
  description: "Landora Admin Control Panel",
};

export default function AdminLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
}

