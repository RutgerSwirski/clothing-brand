import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check if the email already exists in the database
    const existingSubscriber = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 400 }
      );
    }

    // Create a new subscriber in the database
    await prisma.newsletterSubscription.create({
      data: { email },
    });

    // Send a welcome email using Resend
    try {
      await resend.emails.send({
        from: "Studio Remade <newsletter@studioremade.studio>",
        to: email,
        subject: "Welcome to Studio Remade Newsletter",
        html,
      });

      console.log(`Email sent to: ${email}`);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return NextResponse.json(
        { error: "Failed to send welcome email. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending email with Resend:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }

  // Here you would typically save the email to your database or mailing list service
  // For demonstration, we'll just log it

  return NextResponse.json(
    { message: "Subscription successful" },
    { status: 200 }
  );
}

const html = `
  <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 40px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
      <h1 style="margin: 0 0 20px; font-size: 28px; color: #111;">Welcome to <span style="font-weight: 700;">Studio Remade</span></h1>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Thanks for subscribing to our newsletter. We’ll keep you in the loop about new drops, behind-the-scenes work, and exclusive updates from the studio.
      </p>
      <a href="https://studioremade.studio" style="display: inline-block; margin-top: 30px; padding: 14px 24px; background-color: #000; color: white; text-decoration: none; font-weight: 600; border-radius: 6px;">
        Visit Studio Remade
      </a>
    </div>
    <p style="text-align: center; font-size: 12px; color: #999; margin-top: 30px;">
      You’re receiving this email because you signed up at Studio Remade.
    </p>
  </div>
`;
