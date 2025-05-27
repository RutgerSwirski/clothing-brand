// app/mystery-box/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function MysteryBoxPage() {
  return (
    <section className="min-h-screen bg-stone-100 text-black px-6 md:px-24 py-32 font-body">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-wide">
            Mystery Box
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            One-of-a-kind pieces, made just for you. Each box includes custom
            garments, made by hand in my studio. You won’t know exactly what’s
            inside — but that’s the point.
          </p>
        </div>

        {/* Image */}
        <div className="w-full aspect-video bg-neutral-200 rounded-lg flex items-center justify-center text-neutral-500 font-mono text-sm shadow">
          <p>Preview coming soon</p>
        </div>

        {/* What's Inside */}
        <div className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold">
            What’s in the box?
          </h2>
          <ul className="list-disc list-inside text-lg text-stone-700">
            <li>1-2 handmade clothing items</li>
            <li>Designed based on your size & vibe</li>
            <li>Optional upcycled or reworked elements</li>
            <li>Personal handwritten note</li>
          </ul>
        </div>

        {/* Size + Order */}
        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-semibold">Your Size</h2>
          <select className="w-full max-w-sm border border-black px-4 py-2 rounded-md text-base bg-white">
            <option value="">Select your size</option>
            <option value="S">S / Small</option>
            <option value="M">M / Medium</option>
            <option value="L">L / Large</option>
            <option value="XL">XL / Extra Large</option>
          </select>
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Button className="bg-black text-white px-6 py-4 rounded text-base hover:bg-neutral-900">
            Order Mystery Box — €75
          </Button>
          <p className="text-sm text-neutral-500 mt-2">Limited availability</p>
        </div>
      </div>
    </section>
  );
}
