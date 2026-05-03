import Link from "next/link";
import { getAdminToken, DIRECTUS_URL } from "../lib/directus";

async function getOrder(id: string) {
  try {
    const token = await getAdminToken();
    if (!token) return null;
    const res = await fetch(`${DIRECTUS_URL}/items/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const order = id ? await getOrder(id) : null;

  return (
    <main className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
      <p className="text-gray-500 mb-1">
        Thank you{order?.customer_name ? `, ${order.customer_name}` : ""}!
      </p>
      {id && (
        <p className="text-sm text-gray-400 mb-6">
          Order <span className="font-mono font-semibold">#{id}</span>
        </p>
      )}

      {order && (
        <div className="border rounded-xl text-left mb-8 divide-y">
          {(order.items as any[]).map((item, i) => (
            <div key={i} className="flex justify-between px-4 py-3 text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between px-4 py-3 font-bold">
            <span>Total</span>
            <span>${parseFloat(order.total).toFixed(2)}</span>
          </div>
        </div>
      )}

      {order && (
        <div className="text-sm text-gray-500 mb-8 space-y-1">
          <p>Shipping to {order.address}, {order.city}, {order.country}</p>
          <p>
            Payment:{" "}
            <span className="font-medium text-gray-700">
              {order.payment_method === "installment"
                ? `Installment — ${order.installment_months} months ($${(parseFloat(order.total) / order.installment_months).toFixed(2)}/mo)`
                : "Cash on Delivery"}
            </span>
          </p>
        </div>
      )}

      <Link
        href="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        Continue Shopping
      </Link>
    </main>
  );
}
