import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const product = await prisma.product.findUnique({
    where: {
      slug: params.slug,
    },
  });

  if (!product) {
    return new Response("Product not found", { status: 404 });
  }

  return NextResponse.json(product);
}
