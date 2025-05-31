"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";

  return (
    <section className="min-h-screen flex items-center justify-center bg-stone-50 px-6 py-24 font-body">
      <div className="max-w-sm w-full text-center space-y-6">
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <p className="text-stone-600 text-sm">Admin access to Studio Remade</p>

        {/* GitHub Login (or change provider as needed) */}
        <button
          onClick={() => signIn("github", { callbackUrl })}
          className="w-full bg-black text-white py-2 rounded hover:bg-neutral-800 transition"
        >
          Sign in with GitHub
        </button>

        {/* Optionally add other providers here */}
        {/* <button
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full border border-black py-2 rounded hover:bg-stone-100"
        >
          Sign in with Google
        </button> */}
      </div>
    </section>
  );
}
