"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-lg mb-4">Your cart is empty.</p>
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:underline">
          Clear all
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border rounded-xl p-3">
            {item.image ? (
              <img
                src={`${DIRECTUS_URL}/assets/${item.image}`}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{item.name}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-7 h-7 rounded-full border text-gray-600 hover:bg-gray-100 font-bold"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 rounded-full border text-gray-600 hover:bg-gray-100 font-bold"
              >
                +
              </button>
            </div>

            <p className="w-16 text-right font-semibold text-sm">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-400 hover:text-red-500 transition ml-1"
              aria-label="Remove"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4 flex items-center justify-between">
        <span className="text-lg font-bold">Total</span>
        <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
      </div>

      <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition">
        Checkout
      </button>

      <Link href="/" className="block text-center text-sm text-blue-600 hover:underline mt-4">
        ← Continue shopping
      </Link>
    </main>
  );
}
