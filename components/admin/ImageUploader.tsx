// components/admin/ImageUploader.tsx
"use client";

import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function ImageUploader({
  onUpload,
}: {
  onUpload: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        // show thumbnail preview
        const reader = new FileReader();
        reader.onload = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const data = res.data;
        if (data.error) throw new Error(data.error);

        uploadedUrls.push(data.secure_url);
      }

      onUpload(uploadedUrls);
      toast.success("Images uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
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

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {previews.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`Preview ${i + 1}`}
              width={600}
              height={400}
              className="object-cover rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
}
