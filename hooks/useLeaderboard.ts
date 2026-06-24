import { fetchLeaderboard } from "@/services/leaderboard";
import { Leaderboard } from "@/types/leaderboard";
import { useEffect, useState } from "react";

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchLeaderboard();

        setLeaderboard(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load leaderboard",
        );
      }
    }

    loadLeaderboard();
  }, []);

  return {
    leaderboard,
    loading,
    error,
  };
}
