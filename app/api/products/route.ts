import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const availability = searchParams.get("availability");
  const sortBy = searchParams.get("sortBy");
  const search = searchParams.get("search") || "";

  const where = {
    ...(category && category !== "all" ? { category } : {}),
    ...(availability === "in-stock"
      ? { stock: { gt: 0 } }
      : availability === "out-of-stock"
        ? { stock: { lte: 0 } }
        : {}),
    ...(search
      ? {
          name: {
            contains: search.toLowerCase(),
            // mode: "insensitive", // Case-insensitive search
          },
        }
      : {}),
  };

  const orderBy =
    sortBy === "price-low-to-high"
      ? { price: "asc" as const }
      : sortBy === "price-high-to-low"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      images: true,
    },
  });

  return NextResponse.json(products);
}
