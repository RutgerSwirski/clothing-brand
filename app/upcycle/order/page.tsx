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
      <h1 className="font-heading text-3xl mb-8 tracking-wider">
        Start Your Upcycle
      </h1>

      <div className="space-y-6">
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Select
          onValueChange={(v) => setForm({ ...form, path: v })}
          value={form.path}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a path" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="structured">Structured</SelectItem>
            <SelectItem value="draped">Draped</SelectItem>
            <SelectItem value="wildcard">Wildcard</SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          placeholder="Anything I should know? Sizing, fit, colours..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={8}
        />

        <button
          onClick={() => mutate()}
          disabled={isLoading}
          className="border w-full mt-4 py-3 tracking-widest uppercase hover:bg-white hover:text-black transition"
        >
          {isLoading ? "Sending..." : "Submit Inquiry"}
        </button>
      </div>
    </section>
  );
}
