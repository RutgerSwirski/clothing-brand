import { auth } from "@/lib/auth";
import {
  parseProductFormData,
  uploadImagesToCloudinary,
} from "@/lib/handleProductUpload";
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
    const formData = await req.formData();

    const { name, slug, description, price, status, featured, files, orders } =
      await parseProductFormData(formData);

    const product = await prisma.product.update({
      where: { id: productId },
      data: { name, slug, description, price, status, featured },
    });

    if (files.length > 0) {
      await prisma.image.deleteMany({ where: { productId } });
      const uploadedImages = await uploadImagesToCloudinary(
        files,
        orders,
        productId
      );
      await prisma.image.createMany({ data: uploadedImages });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("❌ Product update failed:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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
