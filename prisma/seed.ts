// this is the prisma seeding file
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

type Product = {
  name: string;
  slug: string;
  price: number;
  description: string;
  isAvailable?: boolean;
  comingSoon?: boolean;
  images?: string[];
  sold: boolean;
  stock?: number;
};

async function main() {
  await prisma.image.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  const NUM_PRODUCTS = 100;

  for (let i = 0; i < NUM_PRODUCTS; i++) {
    const name = faker.commerce.productName();
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const price = faker.number.float({ min: 10, max: 1000, fractionDigits: 2 });
    const description = faker.commerce.productDescription();
    const isAvailable = faker.datatype.boolean();
    const comingSoon = faker.datatype.boolean();
    const images = Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) },
      () =>
        faker.image
          .url({ width: 640, height: 480 })
          .replace(/^http:\/\//, "https://")
    );
    const sold = faker.datatype.boolean();
    const stock = isAvailable ? faker.number.int({ min: 1, max: 100 }) : 0;
    const product: Product = {
      name,
      slug,
      price,
      description,
      isAvailable,
      comingSoon,
      images,
      sold,
      stock,
    };

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        price: product.price,
        description: product.description,
        isAvailable: product.isAvailable,
        comingSoon: product.comingSoon,
        sold: product.sold,
        stock: product.stock,
        images: {
          create: product.images?.map((url) => ({ url })) || [],
        },
      },
    });
  }
}

main()
  .then(() => {
    console.log("Seeding completed successfully.");
  })
  .catch((e) => {
    console.error("Error during seeding:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
