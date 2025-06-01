import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductsList from "@/components/admin/ProductsList";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/login");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: true, orders: true },
  });

  return (
    <section className="px-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Products</h1>
      <ProductsList products={products} />
    </section>
  );
}
