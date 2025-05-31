import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrdersList from "@/components/admin/OrdersList";
import EnquiriesList from "@/components/admin/EnquiriesList";
import LogoutButton from "@/components/ui/LogoutButton";

export default async function AdminPage() {
  const session = await auth();

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/login");
  }

  const [orders, enquiries] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.upcycleEnquiry.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <section className="px-6 py-32 font-body space-y-16 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      <OrdersList orders={orders} />
      <EnquiriesList enquiries={enquiries} />
      <LogoutButton />
    </section>
  );
}
