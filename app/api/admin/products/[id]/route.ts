import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id, 10);

    const body = await req.json();
    const { name, slug, description, price, status, featured, images } = body;

    const product = await prisma.product.update({
      where: { id: productId },
      data: { name, slug, description, price, status, featured },
    });

    if (images && Array.isArray(images)) {
      await prisma.image.deleteMany({ where: { productId } });

      await prisma.image.createMany({
        data: images.map((img: { url: string; order: number }) => ({
          url: img.url,
          order: img.order,
          productId,
        })),
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("❌ Product update failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;

  const productId = parseInt(resolvedParams.id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const relatedOrders = await prisma.order.findMany({
      where: {
        items: {
          some: { id: productId },
        },
      },
      select: { id: true },
    });

    if (relatedOrders.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete product: it is linked to existing orders." },
        { status: 400 }
      );
    }

    await prisma.image.deleteMany({ where: { productId } });
    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
