"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";

export default function UpcyclePage() {
  return (
    <section className="md:px-24 px-4 py-16 font-body">
      {/* Header */}
      <PageHeader
        title="Upcycle"
        subtitle="Send me your worn, forgotten clothes. I’ll unpick and rebuild them into something bold and personal — reworked, signed, and one-of-a-kind."
      />

      <div className="max-w-3xl mx-auto">
        {/* Timeline: How it Works */}
        <div className="mt-20 space-y-16 relative before:absolute before:inset-y-0 before:left-4 before:w-px before:bg-stone-300">
          {[
            {
              title: "1 · Choose Your Path",
              description:
                "Structured (hoodie or jacket), Draped (top or dress), or Wildcard (I decide the form).",
            },
            {
              title: "2 · Send Your Clothes",
              description:
                "I’ll email you a prepaid shipping label. You can send up to 3 garments for one rework.",
            },
            {
              title: "3 · I Get to Work",
              description:
                "Over 2–4 weeks, I’ll carefully rebuild your item. You’ll receive behind-the-scenes photos and a signed story tag.",
            },
            {
              title: "4 · Delivery & Reveal",
              description:
                "Once finished, I’ll ship your new piece with its origin card, images, and signature.",
            },
          ].map(({ title, description }, i) => (
            <div key={i} className="pl-10 relative group">
              <div className="absolute left-0 top-1.5 w-3 h-3 bg-black rounded-full group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-xl font-semibold tracking-wide text-black mb-1">
                {title}
              </h3>
              <p className="text-base text-neutral-700 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <Link href="/upcycle/order">
            <Button className="px-8 py-3 text-base font-semibold uppercase tracking-widest hover:scale-105 transition">
              Start Your Upcycle
            </Button>
          </Link>
          <p className="mt-4 text-sm text-stone-500 italic">
            Only a few commissions accepted each month.
          </p>
        </div>
      </div>
    </section>
  );
}
