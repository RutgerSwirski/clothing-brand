import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature") || "";
  const rawBody = await request.arrayBuffer();
  const body = Buffer.from(rawBody);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Error constructing Stripe event:", err);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  console.log("Received Stripe event:", event);

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId;

      console.log("Checkout session completed:", session.id);
      // Handle successful checkout session
      if (session.metadata && session.metadata.itemIds) {
        const itemIds = session.metadata.itemIds.split(",");

        try {
          await prisma.order.create({
            data: {
              id: orderId,
              email: session.customer_email || "",
              stripeSessionId: session.id,
              items: {
                connect: itemIds.map((item) => {
                  const [id, slug] = item.split(":");
                  return { id: Number(id), slug };
                }),
              },
              total: session.amount_total ?? 0,
              status: "paid",
            },
          });
        } catch (error) {
          console.error("Error creating order in database:", error);
          return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
          );
        }
        console.log("Order created successfully:", orderId);
        return NextResponse.json({ received: true }, { status: 200 });
      } else {
        console.error("No itemIds found in session metadata");
        return NextResponse.json(
          { error: "No itemIds found in session metadata" },
          { status: 400 }
        );
      }

      break;
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("PaymentIntent was successful!", paymentIntent.id);
      // Handle successful payment intent
      if (paymentIntent.metadata && paymentIntent.metadata.itemIds) {
        const itemIds = paymentIntent.metadata.itemIds.split(",");
        try {
          await prisma.order.create({
            data: {
              id: paymentIntent.metadata.orderId,
              email: paymentIntent.metadata.buyerEmail || "",
              stripeSessionId: paymentIntent.id,
              items: {
                connect: itemIds.map((item) => {
                  const [id, slug] = item.split(":");
                  return { id: Number(id), slug };
                }),
              },
              total: paymentIntent.amount ?? 0,
              status: "paid",
            },
          });
          console.log(
            "Order created successfully:",
            paymentIntent.metadata.orderId
          );
        } catch (error) {
          console.error("Error creating order in database:", error);
          return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
          );
        }
      }
      break;
    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error("PaymentIntent failed:", failedPaymentIntent.id);
      // Handle failed payment intent

      break;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
      break;
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
