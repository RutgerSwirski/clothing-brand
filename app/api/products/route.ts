import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { ProductStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { NextRequest } from "next/server";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().gt(0, "Price must be greater than zero"),
  status: z.enum(["AVAILABLE", "COMING_SOON", "SOLD", "ARCHIVED"]),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
});

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
            : {}), // No filter if "all" or not specified

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

export async function POST(req: NextRequest) {
  const session = await auth();

  // Only allow admin
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: parsed.name,
        slug: parsed.name.toLowerCase().replace(/\s+/g, "-"),
        description: parsed.description,
        price: parsed.price,
        status: parsed.status,
        images: {
          createMany: {
            data: parsed.images.map((url) => ({ url })),
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
