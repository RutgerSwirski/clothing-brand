// app/lookbook/page.tsx
"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";

type LookbookImage = {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  pieces?: { name: string; slug: string }[];
};

const lookbookImages: LookbookImage[] = [
  { src: "/lookbook/2.jpg", alt: "Wide trousers in motion" },
  { src: "/lookbook/3.jpg", alt: "Patchwork layering experiment" },
  { src: "/lookbook/4.jpg", alt: "Studio shot – draped tee" },
  { src: "/lookbook/5.jpg", alt: "Mystery box test piece" },

  {
    src: "/lookbook/1.jpg",
    alt: "Drop I – Backlit hoodie",
    title: "Drop I – Backlit Hoodie",
    description:
      "Hand-sewn hoodie from upcycled fleece, styled with wide-leg linen trousers and leather boots.",
    pieces: [
      { name: "Backlit Hoodie", slug: "backlit-hoodie" },
      { name: "Linen Trousers", slug: "linen-trousers" },
    ],
  },
];

export default function LookbookPage() {
  return (
    <section className="md:px-24 px-4 py-12">
      <PageHeader
        title="Lookbook"
        subtitle="A curated collection of my latest experimental fashion pieces. Each image tells a story of creativity, sustainability, and style."
      />

      <div className="overflow-x-auto">
        <div className="flex gap-6 md:gap-12 w-max px-1">
          {lookbookImages.map((img, i) => (
            <div
              key={i}
              className="relative w-[300px] md:w-[400px] aspect-[3/4] flex-shrink-0 rounded-lg overflow-hidden shadow lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <Dialog>
                <DialogTrigger className="absolute inset-0 cursor-pointer group">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover bg-white border transition-transform group-hover:scale-[1.01]"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-sm md:text-base text-white font-mono tracking-wide">
                    {img.alt}
                  </div>
                </DialogTrigger>

                <DialogContent className="!w-full !max-w-6xl !h-[90vh] p-0 bg-white rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row w-full h-full">
                    {/* Left: Image */}
                    <div className="relative w-full md:w-1/2 h-64 md:h-full bg-black">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-contain md:object-cover"
                      />
                    </div>

                    {/* Right: Content */}
                    <div className="w-full md:w-1/2 h-full overflow-y-auto p-6 md:p-10 font-body text-black space-y-6">
                      <DialogHeader>
                        <DialogTitle className="text-3xl font-heading tracking-wide mb-2">
                          {img.title || "Lookbook Image"}
                        </DialogTitle>
                        <DialogDescription className="text-base text-neutral-600 leading-relaxed">
                          {img.description || "No description available."}
                        </DialogDescription>
                      </DialogHeader>

                      {Array.isArray(img.pieces) && img.pieces.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold uppercase tracking-widest mb-2 text-neutral-700">
                            Featured Pieces
                          </h3>
                          <ul className="space-y-1 list-disc list-inside text-sm text-blue-600">
                            {img.pieces.map((piece) => (
                              <li key={piece.slug}>
                                <a
                                  href={`/products/${piece.slug}`}
                                  className="hover:underline"
                                >
                                  {piece.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
