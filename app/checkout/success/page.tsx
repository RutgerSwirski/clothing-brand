"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessCheckoutPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const response = await axios.get(`/api/orders/${orderId}`);
      // Check if the response is ok, otherwise throw an error
      // This is a placeholder URL, replace with your actual API endpoint
      if (response.status !== 200) {
        throw new Error("Failed to fetch order details");
      }
      return response.data;
    },
    enabled: !!orderId,
  });

  if (isLoading) return <p>Loading your order...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <section className="bg-white text-black min-h-screen px-6 md:px-12 py-32 font-body">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Thank you for your order!
        </h1>
        <p className="text-lg mb-4">
          Your order ID is <strong>{order.id}</strong>.
        </p>
        <p className="text-lg mb-6">
          We have sent a confirmation email to <strong>{order.email}</strong>.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <ul className="list-disc pl-5 mb-6">
          {order.items.map((item) => (
            <li key={item.id} className="mb-2">
              {item.name} - €{(item.price / 100).toFixed(2)} x {item.quantity}
            </li>
          ))}
        </ul>
        <p className="text-lg font-semibold mb-6">
          Total: €{(order.total / 100).toFixed(2)}
        </p>
        <Link href="/" className="text-blue-500 hover:underline">
          Return to homepage
        </Link>
      </div>
    </section>
  );
}
