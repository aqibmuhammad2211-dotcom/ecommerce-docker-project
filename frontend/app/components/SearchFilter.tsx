"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

type Category = { id: string; name: string };

export default function SearchFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`/?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  return (
    <div className={`flex flex-col sm:flex-row gap-3 mb-8 transition-opacity ${isPending ? "opacity-50" : ""}`}>
      <input
        type="search"
        placeholder="Search products..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => update("search", e.target.value)}
        className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        defaultValue={searchParams.get("category") ?? ""}
        onChange={(e) => update("category", e.target.value)}
        className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
