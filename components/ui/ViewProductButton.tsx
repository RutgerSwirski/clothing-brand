"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export function ViewProductButton({ slug }: { slug: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      className="w-fit text-sm px-5 py-2"
      onClick={() => {
        startTransition(() => {
          router.push(`/products/${slug}`);
        });
      }}
      disabled={isPending}
    >
      {isPending ? "Loading..." : "View"}
    </Button>
  );
}
