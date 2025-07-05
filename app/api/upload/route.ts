// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { UploadApiResponse } from "cloudinary";
import { v4 as uuid } from "uuid";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const productIdStr = formData.get("productId") as string | null;
  const orderStr = formData.get("order") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const productId = productIdStr ? Number(productIdStr) : undefined;
  const order = orderStr ? Number(orderStr) : 0;

  if (typeof productId !== "number" || isNaN(productId)) {
    return NextResponse.json(
      { error: "Invalid or missing productId" },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const uploadResult = (await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "studio-remade", public_id: `${uuid()}-${file.name}` },
          (error, result) => {
            if (error) return reject(error);
            if (!result)
              return reject(new Error("No result returned from Cloudinary"));
            resolve(result);
          }
        )
        .end(buffer);
    })) as UploadApiResponse;

    await prisma.image.create({
      data: {
        url: uploadResult.secure_url,
        productId,
        order,
      },
    });

    return NextResponse.json(uploadResult, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
