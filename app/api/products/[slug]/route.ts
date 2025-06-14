import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;

  if (!resolvedParams || !resolvedParams.slug) {
    return new Response("Product slug is required", { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: {
      slug: resolvedParams.slug,
    },
    include: {
      images: true,
    },
  });

  if (!product) {
    return new Response("Product not found", { status: 404 });
  }

  return NextResponse.json(product);
}
