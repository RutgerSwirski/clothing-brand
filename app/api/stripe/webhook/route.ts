import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

const resend = new Resend(process.env.RESEND_API_KEY || "");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
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

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true }, { status: 200 });
  }

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

  const itemIdsRaw = session.metadata?.itemIds;
  const orderId = session.metadata?.orderId;

  if (!itemIdsRaw) {
    console.error("❌ No itemIds in metadata");
    return NextResponse.json({ error: "Missing itemIds" }, { status: 400 });
  }

  const parsedItems = itemIdsRaw.split(",").map((item) => {
    const [id, slug] = item.split(":");
    return { id: Number(id), slug };
  });

  const products = await prisma.product.findMany({
    where: {
      OR: parsedItems.map((p) => ({ id: p.id, slug: p.slug })),
    },
    include: { images: true },
  });

  const productHtml = products
    .map(
      (product) => `
    <div style="margin-bottom: 24px;">
      <h3 style="margin: 0; font-size: 16px;">${product.name}</h3>
      ${product.images[0]?.url ? `<img src="${product.images[0].url}" alt="${product.name}" style="width: 120px; height: auto; margin-top: 8px; border-radius: 8px;" />` : ""}
      <p style="margin: 4px 0 0;">€${product.price.toFixed(2)}</p>
    </div>
  `
    )
    .join("");

  try {
    await prisma.order.create({
      data: {
        id: orderId,
        email: customerEmail,
        stripeSessionId: session.id,
        total: session.amount_total ?? 0,
        status: "paid",
        items: {
          connect: parsedItems,
        },
      },
    });

    await Promise.all(
      parsedItems.map(async ({ id, slug }) => {
        const product = await prisma.product.findUnique({
          where: { id, slug },
        });
        if (product) {
          await prisma.product.update({
            where: { id: product.id },
            data: { status: "SOLD" },
          });
        } else {
          console.error(`❌ Product not found for ID: ${id}, Slug: ${slug}`);
        }
      })
    );

    await resend.emails.send({
      from: "Studio Remade <orders@studioremade.studio>",
      to: customerEmail,
      subject: "Your Order Confirmation",
      html: `
        <div style="font-family: sans-serif; padding: 24px; background-color: #fafafa;">
          <h2 style="margin-bottom: 12px;">Thank you for your order!</h2>
          <p>Your order ID is <strong>${orderId}</strong>.</p>
          <h3 style="margin-top: 32px; font-size: 18px;">Order Summary</h3>
          ${productHtml}
          <p style="margin-top: 32px;">We’ll process your order shortly and send you another email when it’s shipped.</p>
          <p style="font-size: 12px; color: #888; margin-top: 40px;">Studio Remade</p>
        </div>
      `,
    });

    await resend.emails.send({
      from: "Studio Remade <orders@studioremade.studio>",
      to: process.env.ADMIN_EMAIL ?? "fallback@studioremade.studio",
      subject: `🛒 New Order: ${orderId}`,
      html: `
        <p><strong>New order received</strong></p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customerEmail}</p>
        <p><strong>Stripe Session ID:</strong> ${session.id}</p>
        <p><strong>Total:</strong> €${(session.amount_total ?? 0) / 100}</p>
      `,
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Error processing order:", error);
    return NextResponse.json(
      { error: "Database or email error" },
      { status: 500 }
    );
  }
}
