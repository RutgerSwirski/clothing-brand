// app/components/ScrollUnlocker.tsx
"use client";

import { useUnlockScrollOnRouteChange } from "@/hooks/useUnlockScrollOnRouteChange";

export function ScrollUnlocker() {
  useUnlockScrollOnRouteChange();
  return null;
}
