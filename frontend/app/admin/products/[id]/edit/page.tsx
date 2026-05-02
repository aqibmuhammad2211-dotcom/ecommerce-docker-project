import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "../../../../components/ProductForm";
import { updateProduct } from "../../../actions";
import { DIRECTUS_URL } from "../../../../lib/directus";

async function getProduct(id: string) {
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/products/${id}?fields=*,category`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

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

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProduct(id), getCategories()]);

  if (!product) return notFound();

  const imageId = typeof product.image === "string" ? product.image : product.image?.id ?? null;
  const categoryId = typeof product.category === "string" ? product.category : product.category?.id;

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <Link href="/admin" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to admin
      </Link>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm
        action={updateProduct.bind(null, id)}
        categories={categories}
        defaults={{
          name: product.name,
          price: String(product.price),
          description: product.description ?? "",
          category: categoryId ? String(categoryId) : undefined,
          image: imageId,
        }}
        submitLabel="Update Product"
      />
    </main>
  );
}
