"use client";

export default function ImageUploader({
  onUpload,
}: {
  onUpload: (urlsOrFiles: File[]) => void;
}) {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    onUpload(files);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-stone-700">
        Upload Images
      </label>
      <input type="file" multiple onChange={handleUpload} />
    </div>
  );
}
