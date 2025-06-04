"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export function DeleteNewsletterSubscriptionButton({ id }: { id: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete this subscriber?"
    );
    if (!confirmed) return;

    await axios.delete(`/api/admin/newsletter/${id}`);

    startTransition(() => {
      router.refresh(); // Refresh the list
    });
  };

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-600 hover:underline disabled:opacity-50"
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
