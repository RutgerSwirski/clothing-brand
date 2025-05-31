import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export const config = {
  api: { bodyParser: false },
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
    console.error("⚠️ Error constructing Stripe event:", err);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const sessionId = (event.data.object as Stripe.Checkout.Session).id;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      console.error("❌ Session not found for ID:", sessionId);
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const customerEmail = session.customer_details?.email;

    if (!customerEmail) {
      console.error("❌ No customer email found in session");
      return NextResponse.json(
        { error: "Missing customer email" },
        { status: 400 }
      );
    }

    const customerAddress = session.customer_details?.address;

    // Ensure required metadata exists
    const itemIdsRaw = session.metadata?.itemIds;
    const orderId = session.metadata?.orderId;

    if (!itemIdsRaw) {
      console.error("❌ No itemIds in metadata");
      return NextResponse.json({ error: "Missing itemIds" }, { status: 400 });
    }

    const itemIds = itemIdsRaw.split(",");

    try {
      await prisma.order.create({
        data: {
          id: orderId,
          email: customerEmail,
          stripeSessionId: session.id,
          total: session.amount_total ?? 0,
          status: "paid",
          items: {
            connect: itemIds.map((item) => {
              const [id, slug] = item.split(":");
              return { id: Number(id), slug };
            }),
          },
        },
      });
    } catch (err) {
      console.error("❌ Failed to create order:", err);
      return NextResponse.json({ error: "Database Error" }, { status: 500 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
