"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ImageUploader from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import SortableImageList from "../ui/SortableImageList";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().gt(0, "Price must be greater than zero"),
  status: z.enum(["AVAILABLE", "COMING_SOON", "SOLD", "ARCHIVED"]),
  images: z
    .object({
      id: z.number().int("Image ID must be an integer").optional(),
      url: z
        .string()
        .refine(
          (url) =>
            url.startsWith("http://") ||
            url.startsWith("https://") ||
            url.startsWith("blob:"),
          { message: "Image URL must be valid or a temporary blob URL" }
        ),
      order: z.number().int("Order must be an integer").nonnegative(),
    })
    .array(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const [pendingImages, setPendingImages] = useState<
    { url: string; order: number }[]
  >([]);

  const {
    control,
    register,
    handleSubmit,
    setValue,

    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      status: "AVAILABLE", // Default status
      images: [],
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitting(true);
    const toastId = toast.loading("Creating product...");

    try {
      await axios.post("/api/products", {
        ...data,
        images: pendingImages.map(({ url, order }) => ({
          url,
          order,
        })),
      });

      toast.success("Product created", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      reset();
      onClose();
    } catch (err) {
      toast.error("Failed to create product", { id: toastId });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (uploaded: { url: string; order: number }[]) => {
    console.log("Uploaded images:", uploaded);

    setPendingImages((prev) => [
      ...prev,
      ...uploaded.map((img) => ({
        file: undefined as unknown as File, // no longer needed, but kept for type compatibility
        url: img.url,
        order: img.order,
      })),
    ]);
  };

  useEffect(() => {
    const formImages = pendingImages.map((img) => ({
      id: undefined,
      url: img.url, // Use the preview URL for immediate display
      order: img.order,
    }));
    setValue("images", formImages, { shouldValidate: true });
  }, [pendingImages, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log("Validation Errors:", errors);
      })}
      className="space-y-6"
    >
      <div>
        <label className="text-sm font-medium text-stone-700">Name</label>
        <Input {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700">
          Description
        </label>

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <MDEditor
              value={field.value}
              onChange={field.onChange}
              className="w-full"
              data-color-mode="light"
              data-dark-theme="dark"
              data-light-theme="light"
              height={200}
              preview="edit"
            />
          )}
        />

        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700">Price (€)</label>
        <Input type="number" step="0.01" {...register("price")} />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700">Status</label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              defaultValue="AVAILABLE"
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                  <SelectItem value="SOLD">Sold</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status.message}</p>
        )}
      </div>

      <div>
        <ImageUploader onUpload={handleImageUpload} />
        <SortableImageList
          images={pendingImages.map(({ url, order }) => ({
            url,
            order,
          }))}
          onChange={(newImages) => {
            const reordered = newImages
              .map((img, index) => {
                const match = pendingImages.find((p) => p.url === img.url);
                return match ? { ...match, order: index } : null;
              })
              .filter(Boolean) as typeof pendingImages;

            setPendingImages(reordered);
          }}
        />

        {errors.images && (
          <p className="text-sm text-red-500">{errors.images.message}</p>
        )}
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Submitting..." : "Create Product"}
      </Button>
    </form>
  );
}
