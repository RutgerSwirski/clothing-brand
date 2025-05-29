// app/fragments/page.tsx
"use client";

import Image from "next/image";

const fragments = [
  {
    id: 1,
    title: "Sketchbook Page — Feb 2024",
    description:
      "Early hoodie mockup — too wide in the sleeve, but liked the neckline.",
    image: "/fragments/sketch1.jpg",
  },
  {
    id: 2,
    title: "Muslin Test — Overshirt",
    description:
      "Tried a 4-pocket layout. Got the spacing wrong but loved the boxy shape.",
    image: "/fragments/muslin.jpg",
  },
  {
    id: 3,
    title: "Failed Patchwork",
    description:
      "Didn’t like the color blocking. Might revisit this idea later.",
    image: "/fragments/patchwork.jpg",
  },
];

export default function FragmentsPage() {
  return (
    <section className="min-h-screen bg-stone-100 text-black px-6 md:px-24 py-32 font-body">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-wide">
            Fragments
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-neutral-700">
            A peek into the scraps, drafts, and missteps that shaped my creative
            process. These fragments are the raw material of my designs —
            sketches, test pieces, and failed experiments. Not for sale — just
            here to show the mess behind the process.
          </p>
        </div>

        {/* Grid of Fragments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {fragments.map((frag) => (
            <div
              key={frag.id}
              className="bg-white rounded-lg shadow border overflow-hidden"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={frag.image}
                  alt={frag.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {frag.title}
                </h3>
                <p className="text-sm text-neutral-600">{frag.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
