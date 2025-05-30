"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

const navbarLinks = [
  { label: "Products", href: "/products" },
  { label: "Upcycle", href: "/upcycle" },
  { label: "Fragments", href: "/fragments" },
  { label: "Lookbook", href: "/lookbook" },
];

const Navbar = () => {
  return (
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
              className="transition-transform hover:scale-105 hover:bg-white/90 hover:text-black"
            >
              <Link href={href}>{label}</Link>
            </Button>
          ))}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
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
                >
                  Studio Remade.
                </Link>
              </SheetHeader>

              {navbarLinks.map(({ label, href }) => (
                <Button
                  key={label}
                  asChild
                  variant="ghost"
                  className="w-full justify-start text-lg"
                >
                  <Link href={href}>{label}</Link>
                </Button>
              ))}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
