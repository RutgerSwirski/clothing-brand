import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return new Response("Invalid email address", { status: 400 });
    }

    try {
      await resend.emails.send({
        from: "Studio Remade <newsletter@studioremade.studio>",
        to: email,
        subject: "Welcome to Studio Remade Newsletter",
        html: `<p>Thank you for subscribing to the Studio Remade newsletter! We'll keep you updated with our latest products and news.</p>`,
      });

      console.log(`Email sent to: ${email}`);
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
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
