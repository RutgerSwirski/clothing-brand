import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrdersList from "@/components/admin/OrdersList";

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <section className="px-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Orders</h1>
      <OrdersList orders={orders} />
    </section>
  );
}
