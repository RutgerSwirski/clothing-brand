import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import type { ProductStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

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
    console.warn("Unauthorized attempt to create product");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("📦 Parsing form data...");
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const status = formData.get("status") as ProductStatus;

    const files = formData.getAll("images") as File[];
    const orders = formData
      .getAll("orders")
      .map((order) => parseInt(order as string, 10));

    if (!name || !description || !price || !status || files.length === 0) {
      console.warn("❗ Missing required fields:", {
        name,
        description,
        price,
        status,
        files: files.length,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("🛠️ Creating product:", { name, price, status });
    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description,
        price,
        status,
      },
    });
    console.log("✅ Product created:", product.id);

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const order = orders[i] ?? i;

      console.log(`📤 Uploading image ${i + 1}/${files.length}...`);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      interface CloudinaryUploadResult {
        secure_url: string;
        [key: string]: unknown;
      }

      const result = await new Promise<CloudinaryUploadResult>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "studio-remade",
                public_id: `${uuid()}-${file.name}`,
                timeout: 60000,
              },
              (error, result) => {
                if (error || !result) {
                  console.error(`❌ Upload failed for image ${i + 1}`, error);
                  return reject(error);
                }
                resolve(result as CloudinaryUploadResult);
              }
            )
            .end(buffer);
        }
      );

      console.log(`✅ Image ${i + 1} uploaded:`, result.secure_url);

      uploadedImages.push({
        url: result.secure_url,
        order,
        productId: product.id,
      });
    }

    console.log("🧾 Saving uploaded image metadata to DB...");
    await prisma.image.createMany({
      data: uploadedImages,
    });
    console.log("✅ Image records saved");

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("❌ Product creation failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
