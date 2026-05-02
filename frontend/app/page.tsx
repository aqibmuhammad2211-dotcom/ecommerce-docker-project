import Link from "next/link";
import { Suspense } from "react";
import SearchFilter from "./components/SearchFilter";

const DIRECTUS_INTERNAL_URL = process.env.DIRECTUS_INTERNAL_URL || "http://directus:8055";
const DIRECTUS_PUBLIC_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

async function getCategories() {
  try {
    const res = await fetch(`${DIRECTUS_INTERNAL_URL}/items/categories?fields=id,name`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

async function getProducts(search: string, category: string) {
  try {
    const params = new URLSearchParams();
    params.set("fields", "*,category.name");
    if (search) params.set("search", search);
    if (category) params.set("filter[category][_eq]", category);

    const res = await fetch(
      `${DIRECTUS_INTERNAL_URL}/items/products?${params.toString()}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data.data ?? [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

type SearchParams = Promise<{ search?: string; category?: string }>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { search = "", category = "" } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(search, category),
    getCategories(),
  ]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>

      <Suspense>
        <SearchFilter categories={categories} />
      </Suspense>

      {products.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="border rounded-xl shadow hover:shadow-md transition overflow-hidden block"
            >
              {product.image ? (
                <img
                  src={`${DIRECTUS_PUBLIC_URL}/assets/${typeof product.image === "string" ? product.image : product.image.id}`}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  No image
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{product.category?.name}</p>
                <p className="text-gray-700 mt-2 text-sm">{product.description}</p>
                <p className="text-lg font-bold mt-4">${parseFloat(product.price).toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
