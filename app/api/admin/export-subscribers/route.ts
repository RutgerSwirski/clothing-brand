import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscribers = await prisma.newsletterSubscription.findMany({
    orderBy: { createdAt: "desc" },
  });

  const csvRows = [
    ["Email", "Subscribed At"],
    ...subscribers.map((s) => [
      s.email,
      new Date(s.createdAt).toLocaleDateString(),
    ]),
  ];

  const csv = csvRows.map((row) => row.join(",")).join("\n");

  return NextResponse.json(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="subscribers.csv"`,
    },
  });
}
