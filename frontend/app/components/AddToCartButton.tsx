"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart, CartItem } from "../context/CartContext";

type Props = Omit<CartItem, "quantity">;

export default function AddToCartButton(props: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(props);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="mt-6 space-y-3">
      <button
        onClick={handleClick}
        className={`w-full py-3 rounded-xl font-semibold transition active:scale-95 ${
          added
            ? "bg-green-500 text-white cursor-default"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {added ? "✓ Added to Cart" : "Add to Cart"}
      </button>

      {added && (
        <Link
          href="/cart"
          className="block text-center text-sm text-blue-600 hover:underline"
        >
          View Cart →
        </Link>
      )}
    </div>
  );
}
