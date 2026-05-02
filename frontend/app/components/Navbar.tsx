"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
      <Link href="/" className="text-lg font-bold tracking-tight">
        MyShop
      </Link>
      <div className="flex items-center gap-5">
      <Link href="/admin" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
        Admin
      </Link>
      <Link href="/cart" className="relative flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h14M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
        Cart
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Link>
      </div>
    </nav>
  );
}
