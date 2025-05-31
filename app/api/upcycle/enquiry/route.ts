// this is a file for the upcycle order that will be emailed from a form

import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(req: Request) {
  const { email, name, notes, path } = await req.json();

  if (!email || !email.includes("@") || !name || !notes || !path) {
    return NextResponse.json(
      { error: "Invalid input. Please provide all required fields." },
      { status: 400 }
    );
  }

  try {
    await resend.emails.send({
      from: "Studio Remade <orders@studioremade.studio>",
      to: email,
      subject: "Your Upcycle Enquiry!",
      html: `<p>Hi ${name},</p>
        <p>Thank you for your interest in our upcycle service! We have received your enquiry with the following details:</p>
        <p><strong>Path:</strong> ${path}</p>
        <p><strong>Notes:</strong> ${notes}</p>
        <p>We will review your request and get back to you shortly.</p>
        <p>Best regards,</p>
        <p>Studio Remade Team</p>`,
      headers: {
        "X-Custom-Header": "Upcycle Inquiry",
      },
    });

    const createEnquiry = await prisma.upcycleEnquiry.create({
      data: {
        email,
        name,
        message: notes,
        path,
      },
    });

    if (!createEnquiry) {
      return NextResponse.json(
        { error: "Failed to create upcycle enquiry." },
        { status: 500 }
      );
    }

    console.log(`Email sent to: ${email}`);
  } catch (error) {
    console.error("Error sending email with Resend:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Upcycle enquiry submitted successfully!" },
    { status: 200 }
  );
}
