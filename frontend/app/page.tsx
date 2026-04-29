async function getProducts() {
  try {
    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://directus:8055";
    const res = await fetch(`${directusUrl}/items/products?fields=*,category.name`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.data ?? [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="border rounded-xl p-4 shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{product.category?.name}</p>
            <p className="text-gray-700 mt-2 text-sm">{product.description}</p>
            <p className="text-lg font-bold mt-4">${parseFloat(product.price).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
