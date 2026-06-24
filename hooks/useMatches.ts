import { fetchMatches } from "@/services/matches";
import { Match } from "@/types/matches";
import { useEffect, useState } from "react";

export function useMatches() {
  const [upcoming, setUpcoming] = useState<Match[]>([]);
  const [fulltime, setFullTime] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshMatches() {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchMatches();

      setUpcoming(data.upcoming);
      setFullTime(data.predicted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load matches");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshMatches();
  }, []);

  return {
    upcoming,
    fulltime,
    loading,
    error,
    refreshMatches,
  };
}
