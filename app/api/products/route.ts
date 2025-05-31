import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { ProductStatus } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const availability = searchParams.get("availability");
  const sortBy = searchParams.get("sortBy");
  const search = searchParams.get("search") || "";
  const where = {
    ...(category && category !== "all" ? { category } : {}),
    ...(availability === "in-stock"
      ? { status: "AVAILABLE" as ProductStatus }
      : availability === "coming-soon"
        ? { status: "COMING_SOON" as ProductStatus }
        : availability === "sold"
          ? { status: "SOLD" as ProductStatus }
          : availability === "archived"
            ? { status: "ARCHIVED" as ProductStatus }
            : {}), // Filter by availability status

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
    sortBy === "price-asc"
      ? { price: "asc" as const }
      : sortBy === "price-desc"
        ? { price: "desc" as const }
        : sortBy === "newest"
          ? { createdAt: "desc" as const }
          : sortBy === "oldest"
            ? { createdAt: "asc" as const }
            : { createdAt: "desc" as const }; // Default to newest

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      images: true,
    },
  });

  return NextResponse.json(products);
}
