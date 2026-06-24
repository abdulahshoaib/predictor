import { UserProfile } from "@/types/user";

export async function fetchUser() {
  const res = await fetch("/api/user");

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json() as Promise<UserProfile>;
}
