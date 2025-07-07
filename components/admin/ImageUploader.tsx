"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadToCloudinary";
import { toast } from "sonner";

export default function ImageUploader({
  onUpload,
}: {
  onUpload: (urls: { url: string; order: number }[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    toast.loading("Uploading images...");

    try {
      const uploads = await Promise.all(
        files.map(async (file, index) => {
          const url = await uploadToCloudinary(file, (percent) => {
            toast.loading(`Uploading ${file.name}: ${percent}%`, {
              id: `upload-${file.name}`,
            });
          });
          toast.dismiss(`upload-${file.name}`);
          toast.success(`Uploaded ${file.name}`);
          return { url, order: index };
        })
      );

      toast.success("Images uploaded successfully");
      onUpload(uploads);
    } catch (err) {
      toast.error("Failed to upload images");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-stone-700">
        Upload Images
      </label>
      <input
        type="file"
        multiple
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p className="text-xs text-stone-500">Uploading...</p>}
    </div>
  );
}
