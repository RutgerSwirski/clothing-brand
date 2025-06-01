import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EnquiriesList from "@/components/admin/EnquiriesList";

export default async function AdminUpcyclePage() {
  const session = await auth();

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/login");
  }

  const enquiries = await prisma.upcycleEnquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className=" px-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Upcycle Enquiries</h1>
      <EnquiriesList enquiries={enquiries} />
    </section>
  );
}
