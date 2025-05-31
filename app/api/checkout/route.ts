import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const orderId = uuidv4(); // or generate in client and pass in request body

export async function POST(request: Request) {
  const body = await request.json();

  console.log("Received request body:", body);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: body.items.map(
        (item: {
          name: string;
          price: number; // Price in euros
          image: string; // Image URL
          quantity: number;
        }) => ({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: item.price, // Convert to cents
          },
          quantity: item.quantity,
        })
      ),
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,

      shipping_address_collection: {
        allowed_countries: [
          "FR",
          "DE",
          "ES",
          "IT",
          "NL",
          "BE",
          "PT",
          "GB",
          "AT",
          "CH",
        ],
      },

      customer_email: body.email || undefined,

      metadata: {
        itemIds: body.items
          .map((item) => `${item.id}:${item.slug}`) // You must include `id` and `slug` in `body.items`
          .join(","),
        email: body.email || "",
        orderId: orderId, // Include order ID in metadata
      },
    });
    return NextResponse.json(
      { id: session.id, url: session.url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
