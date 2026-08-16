"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?sort=newest", label: "New Arrivals" },
  { href: "/#story", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-paper)]/95 backdrop-blur border-b border-[var(--color-line)]">
      <div className="ibee-container flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold tracking-tight">
          IBEE
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="text-sm font-medium hover:text-[var(--color-accent)] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link href="/shop" className="text-sm hidden sm:inline">Search</Link>
          <Link href="/account" className="text-sm hidden sm:inline">Account</Link>
          <Link href="/cart" className="relative text-sm font-medium">
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-[var(--color-ink)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="md:hidden text-sm" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-[var(--color-line)] px-5 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="text-sm font-medium" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/account" className="text-sm font-medium" onClick={() => setOpen(false)}>Account</Link>
        </nav>
      )}
    </header>
  );
}
