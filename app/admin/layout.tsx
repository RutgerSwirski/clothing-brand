import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-20 min-h-screen flex bg-stone-50">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col border-r border-stone-200 bg-white p-6 shadow-sm fixed top-20 bottom-0 left-0">
        <AdminNavbar />
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 px-6 py-12 max-w-full">{children}</main>
    </div>
  );
}
