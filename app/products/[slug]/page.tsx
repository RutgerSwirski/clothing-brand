"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // shadcn
import { BuyNowButton } from "@/components/ui/BuyNowButton";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // shadcn

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import Image from "next/image";
import { useParams } from "next/navigation";

const ProductPage = () => {
  const { slug } = useParams();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await axios.get(`/api/products/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Loading ..
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load
      </div>
    );
  }

  const {
    status,
    images,
    price,
    name,
    description,
    fit,
    fitDetails,
    size,
    modelSize,
    modelHeight,
    modelChestSize,
    modelWaistSize,
    fabric,
    care,
    shipping,
    customization,
    returns,
    repairs,
    story = [],
    behindTheScenesImages = [],
    details = [],
  } = product || {};

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Product not found
      </div>
    );
  }

  return (
    <section className="flex flex-col md:flex-row min-h-screen bg-white text-black mt-16">
      {/* Left: Image or carousel */}

      <div className="w-full md:w-1/2 md:sticky md:top-12 md:h-screen border-r border-black/10 h-[80vh]">
        <Carousel opts={{ loop: true }} className="w-full h-full">
          <CarouselContent className="h-full">
            {images.map((img: { url: string }, idx: number) => (
              <CarouselItem
                key={idx}
                className="w-full md:h-screen h-[80vh] relative"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img.url}
                    alt={`Product image ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </div>

      {/* Right: Scrollable Details */}
      <div className="w-full md:w-1/2 p-8 space-y-12 font-body pb-32">
        {/* Title + Meta */}
        <header className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">
              {name}
            </h1>
            {status !== "AVAILABLE" && (
              <span
                className={clsx(
                  "px-2 py-1 text-xs font-medium uppercase tracking-wider rounded",
                  status === "SOLD" && "bg-red-100 text-red-700",
                  status === "COMING_SOON" && "bg-yellow-100 text-yellow-700",
                  status === "ARCHIVED" && "bg-stone-200 text-stone-500"
                )}
              >
                {status.replace("_", " ").toLowerCase()}
              </span>
            )}
          </div>

          <p className="text-sm uppercase tracking-widest text-stone-400">
            One-of-a-kind · Handcrafted · Signed
          </p>

          <p className="text-base text-neutral-700 leading-relaxed">
            {description ||
              "This piece is a rework of existing materials, made slowly and intentionally. Its shape, texture, and flaws are all part of the story."}
          </p>

          <div className="flex items-center gap-4 mt-2">
            <p className="text-2xl font-bold">${price}</p>
            <span className="text-sm font-semibold text-stone-600">
              Made to order · Each piece is unique
            </span>
          </div>
        </header>

        {/* Buy Section */}
        <section className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <BuyNowButton product={product} />
          <span className="text-sm text-neutral-500 mt-2 md:mt-0">
            Made to order – allow 2–3 weeks for creation and shipping
          </span>
        </section>

        {/* Sizing & Fit Info */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase text-stone-700 tracking-wider">
              The Size
            </h3>
            <p className="text-sm text-neutral-600">
              {size || "One size fits most. See details for measurements."}
            </p>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>Model wears size {modelSize || "M"}</li>
              <li>Height: {modelHeight || "5'8"} (173 cm)</li>
              <li>Chest: {modelChestSize || "36"} (91 cm)</li>
              <li>Waist: {modelWaistSize || "28"} (71 cm)</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase text-stone-700 tracking-wider">
              The Fit
            </h3>
            <p className="text-sm text-neutral-600">
              {fit ||
                "Relaxed, slightly oversized fit. Designed to be worn loose and comfortable."}
            </p>
            <p className="text-sm text-neutral-600">
              {fitDetails ||
                "The piece drapes beautifully on all body types, with a boxy silhouette that flatters."}
            </p>
          </div>
        </section>

        {/* Info Accordion */}
        <Accordion
          type="single"
          collapsible
          className="w-full divide-y divide-stone-200"
        >
          {[
            {
              value: "fabric",
              label: "The Fabric",
              content:
                fabric ||
                "Made from 100% organic cotton, pre-washed for softness and durability.",
            },
            {
              value: "care",
              label: "Care Instructions",
              content:
                care || "Cold wash by hand. Hang dry. Iron on low if needed.",
            },
            {
              value: "shipping",
              label: "Shipping & Returns",
              content:
                shipping ||
                "Ships worldwide within 3–5 business days. Free shipping on orders over $100.",
            },
            {
              value: "customization",
              label: "Customization Options",
              content:
                customization ||
                "Custom sizes available upon request. Please contact me for details.",
            },
            {
              value: "returns",
              label: "Returns & Exchanges",
              content:
                returns ||
                "All sales are final due to the one-of-a-kind nature of each piece. Please review measurements and details carefully before purchasing.",
            },
            {
              value: "repairs",
              label: "Repairs & Upkeep",
              content:
                repairs ||
                "I offer free lifetime repairs for all pieces. Just send it back and I’ll fix any issues.",
            },
          ].map(({ value, label, content }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger className="text-sm uppercase tracking-widest text-stone-700 hover:text-black font-medium">
                {label}
              </AccordionTrigger>
              <AccordionContent>{content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* The Story */}
        {(story?.length || story) && (
          <section className="space-y-4 pt-8 border-t">
            <h3 className="text-base font-heading font-bold uppercase tracking-wider">
              Behind the Piece
            </h3>

            {Array.isArray(story) ? (
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-600 leading-relaxed">
                {story.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-600 leading-relaxed">
                {story}
              </p>
            )}
          </section>
        )}

        {/* The Details */}
        <section className="space-y-4 pt-8 border-t">
          <h3 className="text-base font-heading font-bold uppercase tracking-wider">
            Construction & Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {details.map((detail, idx) => (
              <div key={idx} className="flex flex-col items-start gap-2">
                <Image
                  src={detail.image}
                  alt={detail.name}
                  width={400}
                  height={300}
                  className="rounded-lg shadow-sm w-full object-cover"
                />
                <h4 className="text-sm font-semibold text-neutral-800">
                  {detail.name}
                </h4>
                <p className="text-xs text-neutral-500">{detail.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default ProductPage;
