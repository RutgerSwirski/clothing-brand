"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useUnlockScrollOnRouteChange() {
  const pathname = usePathname();

  useEffect(() => {
    // Clear scroll locking (e.g. from Radix Dialog)
    document.body.style.overflow = "";
  }, [pathname]);
}
