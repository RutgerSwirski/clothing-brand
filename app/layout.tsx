import type { Metadata } from "next";
import "./globals.css";

import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { Geist_Mono, Geist } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar/Navbar";

const inter = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

const spaceGrotesk = Geist_Mono({
  variable: "--font-heading",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studio Remade.",
  description: "Nothing New. Everything Remade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased ${inter.variable} ${spaceGrotesk.variable} `}
        >
          <Navbar />
          <main>{children}</main>

          <footer className="py-12 px-6 md:px-24 bg-black text-white font-body text-sm text-center">
            <div className="max-w-4xl mx-auto space-y-4">
              <p className="tracking-wide opacity-80">
                Crafted slowly, with love, imperfection, and intent.
              </p>

              <div className="flex justify-center gap-6 text-xs opacity-60">
                <Link href="products" className="hover:opacity-100 transition">
                  Products
                </Link>
                <Link href="/upcycle" className="hover:opacity-100 transition">
                  Upcycle
                </Link>

                <Link
                  href="/fragments"
                  className="hover:opacity-100 transition"
                >
                  Fragments
                </Link>

                <Link href="/lookbook" className="hover:opacity-100 transition">
                  Lookbook
                </Link>
              </div>

              <p className="text-xs opacity-50 mt-2">
                &copy; {new Date().getFullYear()} Studio Remade. All rights
                reserved.
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ReactQueryProvider>
  );
}
