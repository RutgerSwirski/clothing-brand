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

const handleBuyNow = async (product) => {
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
      <div className="w-full md:w-1/2 p-6 md:sticky md:top-16 md:h-screen flex items-center justify-center border-r border-black/10">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={1000}
          className="w-full max-h-[80vh] object-contain rounded-lg shadow h-full border"
        />
      </div>

      {/* Right: Scrollable Details */}
      <div className="w-full md:w-1/2 p-8 md:overflow-y-auto md:h-screen space-y-8 font-body">
        {/* Title, Description, Price, Availability */}
        <div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            {product.name}
          </h1>
          <p className="text-lg text-neutral-700 mb-2">{product.description}</p>
          <p className="text-2xl font-bold mb-4">${product.price}</p>
          {product.available ? (
            <span className="text-sm text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-sm text-red-500 font-medium">Sold Out</span>
          )}
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
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

        {/* Extra Info */}
        <Accordion
          type="single"
          collapsible
          className="w-full divide-y divide-stone-200"
        >
          <AccordionItem value="materials">
            <AccordionTrigger>Materials & Construction</AccordionTrigger>
            <AccordionContent>
              {product.materials ||
                "Organic cotton. Hand-sewn in my home studio."}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sizing">
            <AccordionTrigger>Sizing & Fit</AccordionTrigger>
            <AccordionContent>
              {product.sizing ||
                "Boxy fit. Slightly cropped. See size guide for details."}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="care">
            <AccordionTrigger>Care Instructions</AccordionTrigger>
            <AccordionContent>
              {product.care ||
                "Cold wash by hand. Hang dry. Iron on low if needed."}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default ProductPage;
