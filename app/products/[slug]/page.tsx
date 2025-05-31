"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // shadcn

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js"; // stripe.js

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const handleBuyNow = async (product: {
  name: string;
  price: number;
  image: string;
  id: string;
  slug: string;
}) => {
  if (!product) {
    console.error("No product data provided");
    return;
  }

  const stripe = await stripePromise;

  if (!stripe) {
    console.error("Stripe not loaded");
    return;
  }

  try {
    const response = await axios.post("/api/checkout", {
      items: [
        {
          name: product.name,
          price: product.price * 100, // Convert to cents
          image: product.image,
          quantity: 1,
          id: product.id, // Ensure product ID is included
          slug: product.slug, // Ensure product slug is included
        },
      ],
    });

    const data = await response.data;
    stripe.redirectToCheckout({
      sessionId: data.id,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    alert("Failed to redirect to checkout. Please try again later.");
  }
};

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
        Loading product...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load product.
      </div>
    );
  }
  return (
    <section className="flex flex-col md:flex-row min-h-screen bg-white text-black mt-16">
      {/* Left: Image or carousel */}
      <div className="w-full md:w-1/2 md:sticky md:top-16 md:h-screen flex items-center justify-center border-r border-black/10">
        <video
          src="/videos/placeholderfashion.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-label="Looping studio footage of the item in motion"
          className="w-full object-cover h-full"
        />
      </div>

      {/* Right: Scrollable Details */}
      <div className="w-full md:w-1/2 p-8  space-y-12 font-body pb-32">
        {/* Title & Meta */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">
            {product.name}
          </h1>
          <p className="text-sm uppercase tracking-widest text-stone-400">
            One-of-a-kind · Handcrafted · Signed
          </p>
          <p className="text-base text-neutral-700 leading-relaxed">
            {product.description ||
              "This piece is a rework of existing materials, made slowly and intentionally. Its shape, texture, and flaws are all part of the story."}
          </p>
          <p className="text-2xl font-bold">${product.price}</p>
          <span
            className={`text-sm font-medium ${product.available ? "text-green-600" : "text-red-500"}`}
          >
            {product.available ? "In Stock" : "Sold Out"}
          </span>
        </div>

        {/* Purchase Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <button className="bg-black text-white px-6 py-3 rounded hover:bg-neutral-900 transition">
            Add to Cart
          </button>
          <button
            onClick={() => handleBuyNow(product)}
            className="border border-black px-6 py-3 rounded hover:bg-black hover:text-white transition"
          >
            Buy Now
          </button>
        </div>

        {/* Sizing Info */}
        <section className="space-y-1">
          <h3 className="text-sm font-semibold uppercase text-stone-700 tracking-wider">
            The Size
          </h3>
          <p className="text-sm text-neutral-600">
            {product.size ||
              "One size fits most. See details for measurements."}
          </p>
          <p className="text-sm text-neutral-600">
            Model wears size {product.modelSize || "M"}
          </p>
          <p className="text-sm text-neutral-600">
            Model height: {product.modelHeight || "5'8"} (173 cm)
          </p>
          <p className="text-sm text-neutral-600">
            Chest: {product.modelChestSize || "36"} (91 cm)
          </p>
          <p className="text-sm text-neutral-600">
            Waist: {product.modelWaistSize || "28"} (71 cm)
          </p>
        </section>

        {/* Fit Description */}
        <section className="space-y-1">
          <h3 className="text-sm font-semibold uppercase text-stone-700 tracking-wider">
            The Fit
          </h3>
          <p className="text-sm text-neutral-600">
            {product.fit ||
              "Relaxed, slightly oversized fit. Designed to be worn loose and comfortable."}
          </p>
          <p className="text-sm text-neutral-600">
            {product.fitDetails ||
              "The piece drapes beautifully on all body types, with a boxy silhouette that flatters."}
          </p>
        </section>

        {/* Accordion Info */}
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
                product.fabric ||
                "Made from 100% organic cotton, pre-washed for softness and durability.",
            },

            {
              value: "care",
              label: "Care Instructions",
              content:
                product.care ||
                "Cold wash by hand. Hang dry. Iron on low if needed.",
            },
            {
              value: "shipping",
              label: "Shipping & Returns",
              content:
                product.shipping ||
                "Ships worldwide within 3-5 business days. Free shipping on orders over $100.",
            },
            {
              value: "customization",
              label: "Customization Options",
              content:
                product.customization ||
                "Custom sizes available upon request. Please contact me for details.",
            },
            {
              value: "returns",
              label: "Returns & Exchanges",
              content:
                product.returns ||
                "All sales are final due to the one-of-a-kind nature of each piece. Please review measurements and details carefully before purchasing.",
            },
            {
              value: "repairs",
              label: "Repairs & Upkeep",
              content:
                product.repairs ||
                "I offer free lifetime repairs for all pieces. Just send it back to me and I’ll fix any issues.",
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

        {/* Behind the Piece */}
        <section className="border-t pt-12 text-sm text-neutral-600 leading-relaxed">
          <h3 className="text-base font-heading font-bold tracking-wider uppercase mb-4 relative inline-block">
            Behind the Piece
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-300" />
          </h3>

          {Array.isArray(product.story) ? (
            <ul className="space-y-4 list-disc list-inside">
              {product.story.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : (
            <p>{product.story || "No story available for this piece."}</p>
          )}

          <span className="inline-block px-2 py-1 text-xs uppercase tracking-widest text-green-700 bg-green-100 rounded mb-4">
            Process Archive
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(product.behindTheScenesImages || ["/images/placeholder.jpg"]).map(
              ({ src, caption }, idx) => (
                <div key={idx} className="flex flex-col">
                  <Image
                    src={src}
                    alt={`Behind the piece image ${idx + 1}`}
                    width={600}
                    height={400}
                    className="rounded-lg shadow-sm"
                  />
                  {caption && (
                    <p className="text-sm text-neutral-500 mt-2">{caption}</p>
                  )}
                </div>
              )
            )}
          </div>
        </section>

        {/* Piece Details */}
        <section className="mt-12">
          <h2 className="text-2xl font-heading font-bold mb-4 tracking-tight">
            Details
          </h2>
          <p className="text-sm text-neutral-600 mb-6">
            Each piece is unique, with its own character and quirks. Here are
            some of the special features:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.details?.map((detail, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <Image
                  src={detail.image}
                  alt={detail.name}
                  width={300}
                  height={300}
                  className="rounded-lg shadow-sm mb-2"
                />
                <h3 className="text-sm font-semibold text-neutral-800">
                  {detail.name}
                </h3>
                <p className="text-xs text-neutral-500 text-center">
                  {detail.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default ProductPage;
