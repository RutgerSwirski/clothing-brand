"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageType, Product } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import type { ControllerRenderProps } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import SortableImageList from "../ui/SortableImageList";
import ImageUploader from "./ImageUploader";

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
  // images include url and order
  images: z
    .object({
      id: z.number().int().optional(), // Optional for new images
      url: z.string().url(),
      order: z.number(),
    })
    .array()
    .min(1, "At least one image is required")
    .refine((images) => images.every((img) => img.url.startsWith("http")), {
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
      images: product.images.map((img) => ({
        id: img.id,
        url: img.url,
        order: img.order,
      })),
      featured: product.featured || false,
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await axios.put(`/api/admin/products/${product.id}`, data);
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

  const handleDeleteImage = async ({
    field,
    url,
  }: {
    field: ControllerRenderProps<
      {
        name: string;
        slug: string;
        description?: string | undefined;
        price: number;
        featured?: boolean | undefined;
        status:
          | "AVAILABLE"
          | "COMING_SOON"
          | "SOLD"
          | "ARCHIVED"
          | "IN_PROGRESS";
        images: {
          url: string;
          order: number;
        }[];
      },
      "images"
    >;
    url: string;
  }) => {
    // we need to delete the image from the cloudinary server here

    try {
      toast.loading("Deleting image...");
      await axios.delete(`/api/admin/products/${product.id}/images`, {
        data: { url }, // <-- you're sending it in the body, not as a route param
      });

      // Remove the image URL from the field value
      field.onChange(field.value.filter((img) => img.url !== url));
      toast.success("Image deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error("Failed to delete image");
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
                  productId={String(product.id)}
                  onUpload={(urls) => field.onChange([...field.value, ...urls])}
                />
                <SortableImageList
                  images={field.value}
                  onChange={(reindexed) => {
                    field.onChange(reindexed);
                  }}
                />
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
