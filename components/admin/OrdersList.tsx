"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";

import { Order, Product } from "@prisma/client";

type OrderWithItems = Order & {
  items: Product[];
};

export default function OrdersList({ orders }: { orders: OrderWithItems[] }) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const response = await axios.patch(`/api/orders/${orderId}`, {
        status: newStatus,
      });
      toast.success("Order updated");
      console.log("Order updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => {
          const statusColor =
            order.status === "paid"
              ? "text-green-600"
              : order.status === "pending"
                ? "text-yellow-600"
                : "text-red-600";

          return (
            <div
              key={order.id}
              className="border rounded-lg p-6 bg-white shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-base">
                    Order #{order.id} –{" "}
                    <span className="text-stone-600">{order.email}</span>
                  </p>
                  <p className="text-sm text-stone-700">
                    Total:{" "}
                    <span className="font-semibold">
                      {order.total.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </p>
                  <p className="text-sm italic text-stone-500">
                    {order.items.length > 0
                      ? order.items.map((i) => i.name).join(", ")
                      : "No items"}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    {format(new Date(order.createdAt), "dd MMM yyyy HH:mm")}
                  </p>
                </div>

                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
                >
                  View
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <p className={`text-sm font-medium ${statusColor}`}>Status:</p>

                <Select
                  onValueChange={(value) => handleStatusChange(order.id, value)}
                  defaultValue={order.status}
                  disabled={updating === order.id}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Update Status</SelectLabel>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-stone-500">
                <a href={`mailto:${order.email}`} className="hover:underline">
                  Reply via email
                </a>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
