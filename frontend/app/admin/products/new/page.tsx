import Link from "next/link";
import ProductForm from "../../../components/ProductForm";
import { createProduct } from "../../actions";
import { DIRECTUS_URL } from "../../../lib/directus";

async function getCategories() {
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/categories?fields=id,name`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <Link href="/admin" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to admin
      </Link>
      <h1 className="text-2xl font-bold mb-6">New Product</h1>
      <ProductForm action={createProduct} categories={categories} submitLabel="Create Product" />
    </main>
  );
}
