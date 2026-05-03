"use server";

import { getAdminToken, DIRECTUS_URL } from "../lib/directus";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderPayload = {
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  payment_method: string;
  installment_months: number | null;
  items: OrderItem[];
  total: number;
};

async function ensureOrdersCollection(token: string) {
  const check = await fetch(`${DIRECTUS_URL}/collections/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (check.ok) return;

  await fetch(`${DIRECTUS_URL}/collections`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      collection: "orders",
      fields: [
        { field: "id", type: "integer", meta: { hidden: true, readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
        { field: "customer_name", type: "string", schema: {} },
        { field: "email", type: "string", schema: {} },
        { field: "phone", type: "string", schema: {} },
        { field: "address", type: "string", schema: {} },
        { field: "city", type: "string", schema: {} },
        { field: "state", type: "string", schema: {} },
        { field: "zip", type: "string", schema: {} },
        { field: "country", type: "string", schema: {} },
        { field: "items", type: "json", schema: {} },
        { field: "total", type: "decimal", schema: {} },
        { field: "status", type: "string", schema: {}, meta: { default_value: "pending" } },
        { field: "payment_method", type: "string", schema: {} },
        { field: "installment_months", type: "integer", schema: {} },
      ],
    }),
  });
}

export async function placeOrder(payload: OrderPayload): Promise<string> {
  const token = await getAdminToken();
  if (!token) throw new Error("Auth failed");

  await ensureOrdersCollection(token);

  const res = await fetch(`${DIRECTUS_URL}/items/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, status: "pending" }),
  });

  if (!res.ok) throw new Error("Failed to place order");
  const data = await res.json();
  return String(data.data.id);
}
