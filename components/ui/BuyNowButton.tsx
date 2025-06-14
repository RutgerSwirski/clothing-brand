"use client";

import { loadStripe } from "@stripe/stripe-js";
import clsx from "clsx";
import axios from "axios";
import type { Product, Image as ImageType } from "@prisma/client";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

type BuyNowButtonProps = {
  product: Omit<Product, "featured"> & {
    featured?: boolean; // now optional
    images: ImageType[];
  };
};

export function BuyNowButton({ product }: BuyNowButtonProps) {
  const handleBuyNow = async () => {
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
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: Math.round(product.price * 100), // price in cents
            image: product.images?.[0]?.url ?? "",
            description: product.description ?? "",
            currency: "eur",
            metadata: {
              productId: product.id,
              productSlug: product.slug,
            },
            quantity: 1,
          },
        ],
      });

      const data = await response.data;

      await stripe.redirectToCheckout({
        sessionId: data.id,
      });
    } catch (error) {
      console.error("Stripe Checkout Error:", error);
      alert("Failed to redirect to checkout. Please try again later.");
    }
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={product.status !== "AVAILABLE"}
      className={clsx(
        "bg-black text-white px-6 py-3 rounded hover:bg-neutral-900 transition w-full md:w-auto hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer",
        product.status !== "AVAILABLE" && "opacity-50 !cursor-not-allowed"
      )}
    >
      Buy Now
    </button>
  );
}
