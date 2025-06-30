"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress"; // assume you have a Progress component

export default function ImageUploader({
  onUpload,
  productId,
}: {
  onUpload: (urls: string[]) => void;
  productId?: string; // optional, if you want to associate uploads with a specific product
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setProgress(0);
    toast.loading("Uploading images...");

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const formData = new FormData();
        formData.append("file", file);
        formData.append("productId", productId || ""); // associate with product if needed
        formData.append("order", String(i)); // 👈 Add image order

        const res = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setProgress(percent);
            }
          },
        });

        const data = res.data;
        if (data.error) throw new Error(data.error);

        uploadedUrls.push(data.secure_url);
      }

      onUpload(uploadedUrls);
      toast.success("Images uploaded successfully");
      setProgress(100); // Set to 100% after all uploads complete
      // remove toast loading state
      toast.dismiss();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
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

      {uploading && (
        <div className="mt-2">
          <Progress value={progress} />
          <p className="text-sm text-stone-600 mt-1">{progress}%</p>
        </div>
      )}
    </div>
  );
}
