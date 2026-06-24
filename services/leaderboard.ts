import { Leaderboard } from "@/types/leaderboard";

export async function fetchLeaderboard() {
  const res = await fetch("/api/leaderboard");

  if (!res.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  return res.json() as Promise<Leaderboard>;
}
