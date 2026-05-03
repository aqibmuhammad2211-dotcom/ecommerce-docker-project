export const DIRECTUS_URL =
  process.env.DIRECTUS_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_DIRECTUS_URL ||
  "http://directus:8055";

export async function getAdminToken(): Promise<string | null> {
  try {
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.DIRECTUS_ADMIN_EMAIL,
        password: process.env.DIRECTUS_ADMIN_PASSWORD,
      }),
      cache: "no-store",
    });
    const data = await res.json();
    return data.data?.access_token ?? null;
  } catch {
    return null;
  }
}
