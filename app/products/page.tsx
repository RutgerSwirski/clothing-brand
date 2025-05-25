import { prisma } from "@/lib/prisma";

const ProductsPage = async () => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  console.log("Products:", products);

  return (
    <div>
      <h1>Products</h1>
      <p>This is the products page.</p>
    </div>
  );
};

export default ProductsPage;
