// Server-side fetches use the internal Docker network name; browser image URLs use the public host
const DIRECTUS_INTERNAL_URL = process.env.DIRECTUS_INTERNAL_URL || "http://directus:8055";
const DIRECTUS_PUBLIC_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

async function getProducts() {
  try {
    const res = await fetch(`${DIRECTUS_INTERNAL_URL}/items/products?fields=*,category.name`, {
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
          <div key={product.id} className="border rounded-xl shadow hover:shadow-md transition overflow-hidden">
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
          </div>
        ))}
      </div>
    </main>
  );
}
