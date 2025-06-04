import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminNewsletterPage() {
  const session = await auth();

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/login");
  }

  const subscribers = await prisma.newsletterSubscription.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>

        <a
          href="/api/admin/export-subscribers"
          target="_blank"
          className="inline-block px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
        >
          Export CSV
        </a>
      </div>

      {subscribers.length === 0 ? (
        <p>No subscribers yet.</p>
      ) : (
        <ul className="divide-y divide-stone-300 bg-white rounded-lg shadow border border-stone-200">
          {subscribers.map((s) => (
            <li key={s.id} className="p-4 flex justify-between items-center">
              <span className="text-sm">{s.email}</span>
              <span className="text-xs text-stone-500">
                {new Date(s.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
