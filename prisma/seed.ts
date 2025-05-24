// this is the prisma seeding file
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Item 1",
        slug: "item-1",
        description: "This is a description of item 1.",
        image: "https://via.placeholder.com/150",
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
