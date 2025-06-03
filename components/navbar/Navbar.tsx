"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

const navbarLinks = [
  { label: "Products", href: "/products" },
  { label: "Upcycle", href: "/upcycle" },
  { label: "Fragments", href: "/fragments" },
  { label: "Lookbook", href: "/lookbook" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };

  // Loading bar logic
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Patch for Next App Router since router.events doesn't exist
    // So we mimic it using `window.history.pushState`
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      handleStart();
      setTimeout(() => handleComplete(), 1000); // fallback timeout
      return originalPushState.apply(window.history, args as any);
    };

    return () => {
      window.history.pushState = originalPushState;
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-30 px-6 md:px-16 py-4 bg-black backdrop-blur-md text-white font-body">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Button
            asChild
            variant="ghost"
            className="text-2xl font-heading font-bold tracking-wide"
          >
            <Link href="/">Studio Remade.</Link>
          </Button>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-4">
            {navbarLinks.map(({ label, href }) => (
              <Button
                key={label}
                asChild
                variant="ghost"
                className={clsx(
                  "transition-transform hover:scale-105 hover:bg-white/90 hover:text-black",
                  isActive(href) && "text-white bg-white/10"
                )}
              >
                <Link href={href}>{label}</Link>
              </Button>
            ))}
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-black text-white space-y-6 ">
                <SheetHeader>
                  <Link
                    className="text-2xl font-heading font-bold tracking-wide w-fit"
                    href="/"
                    onClick={() => setOpen(false)}
                  >
                    Studio Remade.
                  </Link>
                </SheetHeader>

                {navbarLinks.map(({ label, href }) => (
                  <Button
                    key={label}
                    asChild
                    variant="ghost"
                    className={clsx(
                      "w-full text-left transition-transform hover:scale-105 hover:bg-white/90 hover:text-black",
                      isActive(href) && "text-white bg-white/10"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Link href={href}>{label}</Link>
                  </Button>
                ))}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-white animate-pulse z-50" />
      )}
    </>
  );
};

export default Navbar;
