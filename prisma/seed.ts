// this is the prisma seeding file
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Item 1",
        slug: "item-1",
        price: 100,
        description: "This is a description of item 1.",
        available: true,
      },
      {
        name: "Item 2",
        slug: "item-2",
        price: 200,
        description: "This is a description of item 2.",
        available: false,
      },
      {
        name: "Item 3",
        slug: "item-3",
        price: 300,
        description: "This is a description of item 3.",
        comingSoon: true,
      },
    ],
  });

  await prisma.tag.createMany({
    data: [
      {
        name: "Tag 1",
        slug: "tag-1",
      },
      {
        name: "Tag 2",
        slug: "tag-2",
      },
    ],
  });
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
