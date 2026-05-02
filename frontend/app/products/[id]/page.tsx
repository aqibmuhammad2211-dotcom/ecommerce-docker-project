import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "../../components/AddToCartButton";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://directus:8055";

async function getProduct(id: string) {
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/products/${id}?fields=*,category.name`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to products
      </Link>

      {product.image && (
        <img
          src={`${DIRECTUS_URL}/assets/${product.image}`}
          alt={product.name}
          className="w-full h-80 object-cover rounded-xl mb-6"
        />
      )}

      <div className="space-y-3">
        {product.category?.name && (
          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {product.category.name}
          </span>
        )}
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold text-gray-800">
          ${parseFloat(product.price).toFixed(2)}
        </p>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
        <AddToCartButton
          id={String(product.id)}
          name={product.name}
          price={parseFloat(product.price)}
          image={typeof product.image === "string" ? product.image : product.image?.id ?? null}
        />
      </div>
    </main>
  );
}
