import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

import { NextResponse } from "next/server";
import { Product } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(request: Request) {
  const body = await request.json();

  const orderId = uuidv4(); // or generate in client and pass in request body

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "No items provided in the request" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: body.items.map(
        (item: {
          id: string;
          slug: string;
          price: number;
          quantity: number;
          name: string;
        }) => ({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.name, // Ensure `name` is included in `body.items`
              metadata: {
                id: item.id,
                slug: item.slug,
              },
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

      ...(body.email ? { customer_email: body.email } : {}),

      metadata: {
        itemIds: body.items
          .map((item: Product) => `${item.id}:${item.slug}`) // You must include `id` and `slug` in `body.items`
          .join(","),
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
