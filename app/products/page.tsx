import ItemCard from "@/components/ItemCard";
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

      <div>
        {products.map((product) => (
          <ItemCard
            key={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            slug={product.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
