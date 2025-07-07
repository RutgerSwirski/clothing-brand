import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ProductStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const availability = searchParams.get("availability");
  const sortBy = searchParams.get("sortBy");
  const search = searchParams.get("search") || "";

  const where = {
    ...(category && category !== "all" ? { category } : {}),
    ...(availability === "available"
      ? { status: "AVAILABLE" as ProductStatus }
      : availability === "coming-soon"
        ? { status: "COMING_SOON" as ProductStatus }
        : availability === "sold"
          ? { status: "SOLD" as ProductStatus }
          : availability === "archived"
            ? { status: "ARCHIVED" as ProductStatus }
            : availability === "in-progress"
              ? { status: "IN_PROGRESS" as ProductStatus }
              : {}), // No filter if "all"

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
      images: {
        select: {
          id: true,
          url: true,
          order: true,
        },
      },
    },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json(); // ✅ not formData anymore
    const { name, description, price, status, featured, images } = body;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""); // Normalize slug

    if (!slug) {
      return NextResponse.json(
        { error: "Invalid product name for slug generation" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        status,
        featured,
      },
    });

    await prisma.image.createMany({
      data: images.map((img: { url: string; order: number }) => ({
        url: img.url,
        order: img.order,
        productId: product.id,
      })),
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("❌ Product creation failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
