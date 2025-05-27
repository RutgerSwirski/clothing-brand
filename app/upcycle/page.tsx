"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UpcyclePage() {
  return (
    <section className="bg-stone-100 text-black min-h-screen px-6 md:px-12 py-32 font-body">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <h1 className="font-heading text-4xl md:text-6xl mb-6 tracking-tight leading-snug">
          Reborn by NOVAIR
        </h1>
        <p className="text-lg md:text-xl mb-16 text-neutral-700 leading-relaxed">
          Send me your tired, forgotten clothes. I’ll dismantle and rework them
          into a unique piece — cut, sewn, and signed in my studio.
          One-of-a-kind, like you.
        </p>

        {/* How it works */}
        <ol className="space-y-12 border-l border-neutral-300 pl-6">
          <li>
            <h3 className="font-heading text-xl mb-2 tracking-wide">
              1 · Choose Your Path
            </h3>
            <p className="text-base text-neutral-800">
              <strong>Structured</strong> (hoodie / jacket) ·{" "}
              <strong>Draped</strong> (top / dress) · <strong>Wildcard</strong>{" "}
              (I decide)
            </p>
          </li>

          <li>
            <h3 className="font-heading text-xl mb-2 tracking-wide">
              2 · Ship Your Garments
            </h3>
            <p className="text-base text-neutral-800">
              You’ll get a prepaid shipping label. I can combine up to 3 pieces
              into one reborn item.
            </p>
          </li>

          <li>
            <h3 className="font-heading text-xl mb-2 tracking-wide">
              3 · The Rework
            </h3>
            <p className="text-base text-neutral-800">
              I’ll take 2–4 weeks to transform your clothes. You’ll receive
              behind-the-scenes photos and a signed story tag.
            </p>
          </li>

          <li>
            <h3 className="font-heading text-xl mb-2 tracking-wide">
              4 · Delivery & Reveal
            </h3>
            <p className="text-base text-neutral-800">
              Final payment is due before delivery. I’ll ship your finished
              piece with its origin card and photos.
            </p>
          </li>
        </ol>

        {/* CTA */}
        <div className="mt-20">
          <Link href="/upcycle/order">
            <Button className="uppercase tracking-widest text-sm px-6 py-4 w-full sm:w-auto">
              Start Your Upcycle
            </Button>
          </Link>
          <p className="text-sm text-neutral-500 mt-2 italic">
            Limited slots available each month.
          </p>
        </div>
      </div>
    </section>
  );
}
