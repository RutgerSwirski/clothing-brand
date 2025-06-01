"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";

// ✅ Zod Schema
const formSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  path: z.enum(["structured", "draped", "wildcard"], {
    errorMap: () => ({ message: "Please select a path" }),
  }),
  notes: z.string().min(10, "Please provide more detail"),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpcycleOrder() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormValues) => axios.post("/api/upcycle/enquiry", data),
    onSuccess: () => router.push("/upcycle/enquiry/thanks"),
  });

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  return (
    <section className="md:px-24 px-4 py-16 font-body">
      <PageHeader
        title="Upcycle Inquiry"
        subtitle="Send me your worn, forgotten clothes. I’ll unpick and rebuild them into something bold and personal — reworked, signed, and one-of-a-kind."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto mt-12 space-y-8"
      >
        {/* Name */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-neutral-700">
            Name
          </label>
          <Input placeholder="Your name" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <Input
            type="email"
            placeholder="your@email.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Path Selection */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-neutral-700">
            Choose a Path
          </label>
          <Select
            onValueChange={(value) =>
              setValue("path", value as FormValues["path"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Structured, Draped, or Wildcard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="structured">Structured</SelectItem>
              <SelectItem value="draped">Draped</SelectItem>
              <SelectItem value="wildcard">Wildcard</SelectItem>
            </SelectContent>
          </Select>
          {errors.path && (
            <p className="text-red-500 text-xs">{errors.path.message}</p>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-neutral-700">
            Notes
          </label>
          <Textarea
            placeholder="Sizing, fit, preferred vibe, colors, inspiration..."
            rows={6}
            {...register("notes")}
          />
          {errors.notes && (
            <p className="text-red-500 text-xs">{errors.notes.message}</p>
          )}
          <p className="text-xs text-stone-500 italic mt-1">
            Share anything that helps me rework your clothes into something
            you’ll love.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-6">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full tracking-widest uppercase text-sm"
          >
            {isPending ? "Sending..." : "Submit Inquiry"}
          </Button>
          <p className="text-xs text-neutral-500 mt-3 text-center italic">
            I’ll get back to you within 2–3 days.
          </p>
        </div>
      </form>
    </section>
  );
}
