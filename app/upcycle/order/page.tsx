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
    <section className="mx-auto max-w-xl px-6 md:px-12 py-24 font-body">
      <h1 className="font-heading text-4xl mb-6 tracking-wide">
        Start Your Upcycle
      </h1>
      <p className="text-base text-neutral-600 mb-10">
        This form lets me know you’re interested. I’ll follow up with details
        about shipping and timeline.
      </p>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm mb-1 font-medium">Name</label>
          <Input
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1 font-medium">Email</label>
          <Input
            placeholder="your@email.com"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Path Selection */}
        <div>
          <label className="block text-sm mb-1 font-medium">
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
        <div>
          <label className="block text-sm mb-1 font-medium">Notes</label>
          <Textarea
            placeholder="Sizing, fit, preferred vibe or colors..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={8}
          />
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
          <p className="text-xs text-neutral-500 mt-2 text-center">
            You’ll hear back within 2–3 days.
          </p>
        </div>
      </div>
    </section>
  );
}
