"use client";

import { useState } from "react";

type Category = { id: string; name: string };

type Defaults = {
  name?: string;
  price?: string;
  description?: string;
  category?: string;
  image?: string | null;
};

type Props = {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  defaults?: Defaults;
  submitLabel?: string;
};

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

export default function ProductForm({ action, categories, defaults = {}, submitLabel = "Save" }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    await action(formData);
    setPending(false);
  }

  return (
    <form action={handleSubmit} encType="multipart/form-data" className="space-y-5">
      {defaults.image && (
        <input type="hidden" name="existing_image" value={defaults.image} />
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          name="name"
          defaultValue={defaults.name}
          required
          className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price ($)</label>
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={defaults.price}
          required
          className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          defaultValue={defaults.description}
          rows={4}
          className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          defaultValue={defaults.category ?? ""}
          className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Image</label>
        {(preview || defaults.image) && (
          <img
            src={preview ?? `${DIRECTUS_URL}/assets/${defaults.image}`}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-xl mb-2"
          />
        )}
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="block text-sm text-gray-600"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
