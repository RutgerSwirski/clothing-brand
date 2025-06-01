"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EnquiriesList from "@/components/admin/EnquiriesList";
import axios from "axios";
import { useEffect } from "react";

export default function AdminUpcyclePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAdmin =
    session?.user?.email?.toLowerCase() ===
    process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (status === "authenticated" && !isAdmin)
    ) {
      router.push("/login");
    }
  }, [status, isAdmin, router]);

  const {
    data: enquiries,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const res = await axios.get("/api/enquiries");
      return res.data;
    },
    enabled: status === "authenticated" && isAdmin,
    refetchInterval: 10000, // Optional: auto-refresh every 10s
  });

  if (status === "loading") return <p>Loading session...</p>;
  if (!isAdmin) return null;

  return (
    <section className="px-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Upcycle Enquiries</h1>

      {isLoading ? (
        <p>Loading enquiries...</p>
      ) : error ? (
        <p>Error loading enquiries</p>
      ) : (
        <EnquiriesList enquiries={enquiries} />
      )}
    </section>
  );
}
