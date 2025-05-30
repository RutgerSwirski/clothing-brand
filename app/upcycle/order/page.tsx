"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
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
import axios from "axios";
import PageHeader from "@/components/PageHeader";

export default function UpcycleOrder() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    path: "",
    notes: "",
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: () => axios.post("/api/upcycle", form),
    onSuccess: () => router.push("/upcycle/thanks"),
  });

  return (
    <section className="md:px-24 px-4 py-16 font-body">
      <PageHeader
        title="Upcycle Inquiry"
        subtitle="Send me your worn, forgotten clothes. I’ll unpick and rebuild them into something bold and personal — reworked, signed, and one-of-a-kind."
      />

      <div className="max-w-2xl mx-auto mt-12 space-y-8">
        {/* Name */}
        <div className="space-y-1">
          <label className="block text-sm font-medium tracking-wide text-neutral-700">
            Name
          </label>
          <Input
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block text-sm font-medium tracking-wide text-neutral-700">
            Email
          </label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Path Selection */}
        <div className="space-y-1">
          <label className="block text-sm font-medium tracking-wide text-neutral-700">
            Choose a Path
          </label>
          <Select
            onValueChange={(v) => setForm({ ...form, path: v })}
            value={form.path}
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
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="block text-sm font-medium tracking-wide text-neutral-700">
            Notes
          </label>
          <Textarea
            placeholder="Sizing, fit, preferred vibe, colors, inspiration..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={6}
          />
          <p className="text-xs text-stone-500 italic mt-1">
            Share anything that helps me rework your clothes into something
            you’ll love.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-6">
          <Button
            onClick={() => mutate()}
            disabled={isLoading}
            className="w-full tracking-widest uppercase text-sm"
          >
            {isLoading ? "Sending..." : "Submit Inquiry"}
          </Button>
          <p className="text-xs text-neutral-500 mt-3 text-center italic">
            I’ll get back to you within 2–3 days.
          </p>
        </div>
      </div>
    </section>
  );
}
