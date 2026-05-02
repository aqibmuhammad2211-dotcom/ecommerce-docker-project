import Link from "next/link";
import { deleteProduct } from "./actions";
import { DIRECTUS_URL } from "../lib/directus";

const DIRECTUS_PUBLIC_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

async function getProducts() {
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/products?fields=*,category.name`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const products = await getProducts();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin — Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
        >
          + New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No products yet.</p>
      ) : (
        <div className="space-y-3">
          {products.map((product: any) => {
            const imageId = typeof product.image === "string" ? product.image : product.image?.id;
            return (
              <div key={product.id} className="flex items-center gap-4 border rounded-xl p-3">
                {imageId ? (
                  <img
                    src={`${DIRECTUS_PUBLIC_URL}/assets/${imageId}`}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.category?.name && `${product.category.name} · `}
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                </div>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="text-sm text-blue-600 hover:underline px-2"
                >
                  Edit
                </Link>
                <form action={deleteProduct.bind(null, String(product.id))}>
                  <button
                    type="submit"
                    className="text-sm text-red-500 hover:underline"
                    onClick={(e) => {
                      if (!confirm(`Delete "${product.name}"?`)) e.preventDefault();
                    }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}

      <Link href="/" className="block text-center text-sm text-blue-600 hover:underline mt-8">
        ← Back to store
      </Link>
    </main>
  );
}
