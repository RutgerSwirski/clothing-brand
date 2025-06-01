"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProductsList from "@/components/admin/ProductsList";
import axios from "axios";
import { useEffect } from "react";

export default function AdminProductsPage() {
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
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("/api/products");
      return res.data;
    },
    enabled: status === "authenticated" && isAdmin,
  });

  if (status === "loading") return <p>Loading session...</p>;
  if (!isAdmin) return null; // hide UI while redirecting

  return (
    <section className="px-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Products</h1>

      {isLoading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>Error loading products</p>
      ) : (
        <ProductsList products={products} />
      )}
    </section>
  );
}
