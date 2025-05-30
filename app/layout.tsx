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

          <footer className="py-12 text-center text-sm bg-black text-white font-body">
            crafted with love
            <br />
            &copy; {new Date().getFullYear()} Studio Remade.
          </footer>
        </body>
      </html>
    </ReactQueryProvider>
  );
}
