import AdminSidebar from "@/components/layout/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard — IndustryNeed",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 bg-[#f5f2ed]">{children}</main>
    </div>
  );
}
