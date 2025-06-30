import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

const getPublicIdFromUrl = (encodedUrl: string) => {
  try {
    const url = decodeURIComponent(encodedUrl);
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    const rest = url.substring(uploadIndex + "/upload/".length); // removes everything before upload/
    const versionMatch = rest.match(/^v\d+\//);

    const path = versionMatch
      ? rest.substring(versionMatch[0].length) // skip version part if present
      : rest;

    const lastDotIndex = path.lastIndexOf(".");
    if (lastDotIndex === -1) return null;

    return path.substring(0, lastDotIndex); // remove .png/.jpg etc.
  } catch (err) {
    console.error("Error parsing public_id from Cloudinary URL:", err);
    return null;
  }
};

export async function DELETE(req: Request) {
  const session = await auth();

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const imageUrl = body.url;

  const publicId = getPublicIdFromUrl(imageUrl);

  if (!publicId) {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  try {
    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
