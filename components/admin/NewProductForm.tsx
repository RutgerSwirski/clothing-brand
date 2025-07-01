"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
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

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().gt(0, "Price must be greater than zero"),
  status: z.enum(["AVAILABLE", "COMING_SOON", "SOLD", "ARCHIVED"]),
  images: z
    .object({
      id: z.number().int("Image ID must be an integer").optional(),
      url: z.string().url("Invalid URL format"),
      order: z.number().int("Order must be an integer").nonnegative(),
    })
    .array()
    .min(1, "At least one image is required")
    .refine((images) => images.every((img) => img.url.startsWith("http")), {
      message: "All images must be valid URLs",
    }),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
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
    try {
      await axios.post("/api/products", data);
      toast.success("Product created");
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Invalidate products cache
      // Reset form after successful submission
      reset();

      // close
      onClose();
    } catch (err) {
      toast.error("Failed to create product");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (urls: string[]) => {
    const current = getValues("images");
    const updated = [
      ...current,
      ...urls.map((url, index) => ({
        id: undefined, // New images won't have an ID initially
        url,
        order: current.length + index, // Set order based on current length
      })),
    ];
    setValue("images", updated, { shouldValidate: true });
    toast.success("Images uploaded successfully");
  };

  // const handleImageDelete = (url: string) => {
  //   const current = getValues("images");
  //   const updated = current.filter((image) => image !== url);
  //   setValue("images", updated, { shouldValidate: true });
  // };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log("Validation Errors:", errors);
      })}
      className="space-y-6 max-w-xl"
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
