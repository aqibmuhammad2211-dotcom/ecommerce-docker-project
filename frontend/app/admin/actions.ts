"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminToken, DIRECTUS_URL } from "../lib/directus";

async function uploadImage(file: File, token: string): Promise<string | null> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(`${DIRECTUS_URL}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.id ?? null;
}

export async function createProduct(formData: FormData) {
  const token = await getAdminToken();
  if (!token) throw new Error("Auth failed");

  const imageFile = formData.get("image") as File;
  const imageId = imageFile?.size > 0 ? await uploadImage(imageFile, token) : null;

  await fetch(`${DIRECTUS_URL}/items/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formData.get("name"),
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description"),
      category: formData.get("category") || null,
      image: imageId,
    }),
  });

  revalidatePath("/");
  redirect("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  const token = await getAdminToken();
  if (!token) throw new Error("Auth failed");

  const imageFile = formData.get("image") as File;
  const existingImage = formData.get("existing_image") as string | null;
  const imageId = imageFile?.size > 0 ? await uploadImage(imageFile, token) : existingImage;

  await fetch(`${DIRECTUS_URL}/items/products/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formData.get("name"),
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description"),
      category: formData.get("category") || null,
      image: imageId,
    }),
  });

  revalidatePath("/");
  revalidatePath(`/products/${id}`);
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  const token = await getAdminToken();
  if (!token) throw new Error("Auth failed");

  await fetch(`${DIRECTUS_URL}/items/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  revalidatePath("/");
  redirect("/admin");
}
