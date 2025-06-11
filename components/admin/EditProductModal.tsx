"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploader from "./ImageUploader";
import { Button } from "../ui/button";
import Image from "next/image";
import { Image as ImageType, Product } from "@prisma/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().gt(0),
  featured: z.boolean().optional(),
  status: z.enum([
    "AVAILABLE",
    "COMING_SOON",
    "SOLD",
    "ARCHIVED",
    "IN_PROGRESS",
  ]),
  images: z
    .array(z.string().url())
    .min(1, "At least one image is required")
    .refine((images) => images.every((url) => url.startsWith("http")), {
      message: "All images must be valid URLs",
    }),
});

export default function EditProductModal({
  product,
  onClose,
}: {
  product: Product & {
    images: ImageType[];
  };

  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price,
      status: product.status,
      images: product.images?.map((img) => img.url) || [],
      featured: product.featured || false,
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.log("Submitting data:", data);
    try {
      const response = await axios.put(
        `/api/admin/products/${product.id}`,
        data
      );
      console.log("Product updated successfully:", response.data);
      //
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Invalidate the products query to refresh the list
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
      toast.error("Failed to update product");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        // scrolling
        className="overflow-y-scroll max-h-[90vh] max-w-2xl sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Name" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
          <Input placeholder="Slug" {...register("slug")} />
          {errors.slug && (
            <p className="text-red-500 text-sm">{errors.slug.message}</p>
          )}
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
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}

          <Controller
            control={control}
            name="featured"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4"
                />
                <label>Featured</label>
              </div>
            )}
          />

          <Input type="number" placeholder="Price" {...register("price")} />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                    <SelectItem value="SOLD">Sold</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}
          <Controller
            control={control}
            name="images"
            render={({ field }) => (
              <>
                <ImageUploader
                  onUpload={(urls) => field.onChange([...field.value, ...urls])}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <Image
                        src={url}
                        alt={`Product image ${idx + 1}`}
                        width={300}
                        height={300}
                        className="rounded"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange(
                            field.value.filter((u: string) => u !== url)
                          )
                        }
                        className="absolute top-1 right-1 bg-white text-red-600 rounded-full px-2 py-1 text-xs hidden group-hover:block"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          />

          <Button type="submit" className="w-full">
            Update Product
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
