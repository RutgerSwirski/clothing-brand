import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/login");
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <ul className="grid gap-6 md:grid-cols-2">
        <li>
          <Link
            href="/admin/products"
            className="block p-6 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:bg-stone-50 transition"
          >
            <h2 className="text-xl font-semibold mb-1">🧵 Products</h2>
            <p className="text-sm text-stone-600">
              View and manage your listings
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/orders"
            className="block p-6 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:bg-stone-50 transition"
          >
            <h2 className="text-xl font-semibold mb-1">📦 Orders</h2>
            <p className="text-sm text-stone-600">Track recent purchases</p>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/upcycle"
            className="block p-6 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:bg-stone-50 transition"
          >
            <h2 className="text-xl font-semibold mb-1">♻️ Upcycle Enquiries</h2>
            <p className="text-sm text-stone-600">
              Read custom messages and requests
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/newsletter"
            className="block p-6 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:bg-stone-50 transition"
          >
            <h2 className="text-xl font-semibold mb-1">📧 Newsletter</h2>
            <p className="text-sm text-stone-600">
              Manage newsletter subscribers
            </p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
