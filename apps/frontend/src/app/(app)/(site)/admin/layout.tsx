import { AdminLayoutClient } from '@gitroom/frontend/components/admin/admin-layout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
