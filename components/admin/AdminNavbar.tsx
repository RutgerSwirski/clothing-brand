"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LogoutButton from "../ui/LogoutButton";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/upcycle", label: "Upcycle" },
  { href: "/admin/newsletter", label: "Newsletter" },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-4">
      <h2 className="text-lg font-semibold text-stone-700 mb-4">Admin Panel</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={clsx(
                "block px-3 py-2 rounded-md text-sm font-medium transition hover:bg-stone-100",
                pathname === link.href
                  ? "bg-stone-200 text-stone-900 font-semibold"
                  : "text-stone-700"
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <LogoutButton />
    </nav>
  );
}
