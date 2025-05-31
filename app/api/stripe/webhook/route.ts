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

      // we need to update the product stock
      await Promise.all(
        itemIds.map(async (item) => {
          const [id, slug] = item.split(":");
          const product = await prisma.product.findUnique({
            where: { id: Number(id), slug },
          });
          if (product) {
            await prisma.product.update({
              where: { id: product.id },
              data: {
                // isAvailable: false, // mark as unavailable after purchase
                stock: product.stock ? product.stock - 1 : 0, // decrement stock
              },
            });
          } else {
            console.error(`❌ Product not found for ID: ${id}, Slug: ${slug}`);
          }
        })
      );
    } catch (error) {
      console.error("❌ Error creating order:", error);
      return NextResponse.json({ error: "Database Error" }, { status: 500 });
    }
    try {
      // Send confirmation email logic here
      // This is a placeholder, implement your email sending logic
      console.log(`📧 Sending confirmation email to ${customerEmail}`);
      // await sendConfirmationEmail(customerEmail, orderId);

      console.log("✅ Confirmation email sent successfully");
      // You can implement your email sending logic here
    } catch (err) {
      console.error("❌ Failed to create order:", err);
      return NextResponse.json({ error: "Database Error" }, { status: 500 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
