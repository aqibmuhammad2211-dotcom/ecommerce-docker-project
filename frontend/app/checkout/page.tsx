"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { placeOrder } from "./actions";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [installments, setInstallments] = useState("3");

  if (items.length === 0) {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 mb-4">Your cart is empty.</p>
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Continue shopping</Link>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const fd = new FormData(e.currentTarget);

    try {
      const orderId = await placeOrder({
        customer_name: fd.get("customer_name") as string,
        email: fd.get("email") as string,
        phone: fd.get("phone") as string,
        address: fd.get("address") as string,
        city: fd.get("city") as string,
        state: fd.get("state") as string,
        zip: fd.get("zip") as string,
        country: fd.get("country") as string,
        payment_method: paymentMethod,
        installment_months: paymentMethod === "installment" ? parseInt(installments) : null,
        items: items.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
        total: totalPrice,
      });

      clearCart();
      router.push(`/order-success?id=${orderId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <section>
            <h2 className="font-semibold text-lg mb-3">Contact Info</h2>
            <div className="space-y-3">
              <input name="customer_name" placeholder="Full name" required
                className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="email" type="email" placeholder="Email" required
                className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="phone" type="tel" placeholder="Phone number"
                className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-3">Shipping Address</h2>
            <div className="space-y-3">
              <input name="address" placeholder="Street address" required
                className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="grid grid-cols-2 gap-3">
                <input name="city" placeholder="City" required
                  className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input name="state" placeholder="State / Province"
                  className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input name="zip" placeholder="ZIP / Postal code" required
                  className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input name="country" placeholder="Country" required
                  className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-3">Payment Method</h2>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition ${paymentMethod === "cod" ? "border-blue-500 bg-blue-50" : ""}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                <div>
                  <p className="font-medium text-sm">Cash on Delivery</p>
                  <p className="text-xs text-gray-400">Pay when your order arrives</p>
                </div>
              </label>
              <label className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition ${paymentMethod === "installment" ? "border-blue-500 bg-blue-50" : ""}`}>
                <input type="radio" name="payment" value="installment" checked={paymentMethod === "installment"} onChange={() => setPaymentMethod("installment")} />
                <div>
                  <p className="font-medium text-sm">Installment Plan</p>
                  <p className="text-xs text-gray-400">Split your payment over time</p>
                </div>
              </label>
            </div>

            {paymentMethod === "installment" && (
              <div className="mt-3">
                <label className="text-sm font-medium block mb-1">Number of months</label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="3">3 months — ${(totalPrice / 3).toFixed(2)}/mo</option>
                  <option value="6">6 months — ${(totalPrice / 6).toFixed(2)}/mo</option>
                  <option value="12">12 months — ${(totalPrice / 12).toFixed(2)}/mo</option>
                </select>
              </div>
            )}
          </section>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition disabled:opacity-60"
          >
            {pending ? "Placing order..." : `Place Order · $${totalPrice.toFixed(2)}`}
          </button>
        </form>

        {/* Order summary */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Order Summary</h2>
          <div className="border rounded-xl divide-y">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3">
                {item.image ? (
                  <img
                    src={`${DIRECTUS_URL}/assets/${item.image}`}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between px-3 py-3 font-bold">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
