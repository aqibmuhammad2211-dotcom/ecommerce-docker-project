"use client";

import { useCart, CartItem } from "../context/CartContext";

type Props = Omit<CartItem, "quantity">;

export default function AddToCartButton(props: Props) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(props)}
      className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition"
    >
      Add to Cart
    </button>
  );
}
