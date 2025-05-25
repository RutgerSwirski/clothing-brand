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
      ? { available: true }
      : availability === "out-of-stock"
      ? { available: false }
      : {}),
    ...(search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {}),
  };

  const orderBy =
    sortBy === "price-low-to-high"
      ? { price: "asc" }
      : sortBy === "price-high-to-low"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
  });

  return NextResponse.json(products);
}
