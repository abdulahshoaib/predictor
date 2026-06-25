import { fetchGroupStandings } from "@/services/group_standings";
import { GroupStandings } from "@/types/group_standing";
import { useEffect, useState } from "react";

export function useGroupStandings() {
  const [groupStandings, setGroupStandings] = useState<GroupStandings[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshGroupStandings() {
    try {
      setLoading(true);
      setError(null);

      const standings: GroupStandings[] = await fetchGroupStandings();

      setGroupStandings(standings);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to Group Standings",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshGroupStandings();
  }, []);

  return {
    groupStandings,
    loading,
    error,
  };
}
