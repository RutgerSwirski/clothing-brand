import { cloudinary } from "@/lib/cloudinary";
import { ProductStatus } from "@prisma/client";
import { v4 as uuid } from "uuid";

export async function parseProductFormData(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const status = formData.get("status") as ProductStatus;
  const featured = formData.get("featured") === "true";

  const files = formData.getAll("images") as File[];
  const orders = formData
    .getAll("orders")
    .map((order) => parseInt(order as string, 10));

  if (!name || !price || !status || !description) {
    throw new Error("Missing required fields");
  }

  return {
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
    description,
    price,
    status,
    featured,
    files,
    orders,
  };
}

export async function uploadImagesToCloudinary(
  files: File[],
  orders: number[],
  productId: number
) {
  const uploadPromises = files.map(async (file, index) => {
    const order = orders[index] ?? index;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "studio-remade",
              public_id: `${uuid()}-${file.name}`,
              timeout: 120000, // bump to 2 minutes
            },
            (error, result) => {
              if (error || !result) {
                console.error("Cloudinary upload failed", error);
                reject(error);
              } else {
                resolve(result as { secure_url: string });
              }
            }
          )
          .end(buffer);
      }
    );

    return {
      url: result.secure_url,
      order,
      productId,
    };
  });

  const uploadedImages = await Promise.all(uploadPromises);
  return uploadedImages;
}
