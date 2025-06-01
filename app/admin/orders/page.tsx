"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import OrdersList from "@/components/admin/OrdersList";
import axios from "axios";
import { useEffect } from "react";

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (status === "authenticated" && !isAdmin)
    ) {
      router.push("/login");
    }
  }, [status, isAdmin, router]);

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get("/api/orders");
      return res.data;
    },
    enabled: status === "authenticated" && isAdmin,
    refetchInterval: 10000, // auto-refresh every 10 seconds (optional)
  });

  if (status === "loading") return <p>Loading session...</p>;
  if (!isAdmin) return null;

  return (
    <section className="px-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Orders</h1>

      {isLoading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p>Error loading orders</p>
      ) : (
        <OrdersList orders={orders} />
      )}
    </section>
  );
}
