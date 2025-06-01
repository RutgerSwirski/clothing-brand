import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import { z } from "zod";
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().gt(0, "Price must be greater than zero"),
  status: z.enum(["AVAILABLE", "COMING_SOON", "SOLD", "ARCHIVED"]),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  // Only allow admin
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = productSchema.parse(body);

    const product = await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: {
        name: parsed.name,
        slug: parsed.name.toLowerCase().replace(/\s+/g, "-"),
        description: parsed.description,
        price: parsed.price,
        status: parsed.status,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
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
