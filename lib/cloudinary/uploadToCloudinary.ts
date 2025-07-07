import axios from "axios";

export async function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
    formData,
    {
      onUploadProgress: (e) => {
        if (typeof e.total === "number" && e.total > 0) {
          const percent = Math.round((e.loaded * 100) / e.total);
          onProgress?.(percent);
        }
      },
    }
  );

  return response.data.secure_url; // this is the signed URL
}
