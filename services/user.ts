import { UserProfile } from "@/types/user";

export async function fetchUser() {
  const res = await fetch("/api/user");

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json() as Promise<UserProfile>;
}

export async function updateUser(data: Record<string, string>) {
  const res = await fetch("/api/user", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to update user");
  }

  return res.json() as Promise<UserProfile>;
}
