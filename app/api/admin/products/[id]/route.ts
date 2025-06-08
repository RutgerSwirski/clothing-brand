import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().gt(0, "Price must be greater than zero"),
  status: z.enum(["AVAILABLE", "COMING_SOON", "SOLD", "ARCHIVED"]),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  featured: z.boolean().optional(),
});

// ✅ Correct signature for App Router dynamic routes
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = productSchema.parse(body);

    const resolvedParams = await params;

    const product = await prisma.product.update({
      where: { id: parseInt(resolvedParams.id, 10) },
      data: {
        name: parsed.name,
        slug: parsed.name.toLowerCase().replace(/\s+/g, "-"),
        description: parsed.description,
        price: parsed.price,
        status: parsed.status,
        featured: parsed.featured,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
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
