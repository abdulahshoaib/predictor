import { GroupStandings } from "@/types/group_standing";

export async function fetchGroupStandings() {
  const res = await fetch("/api/group_standings");

  if (!res.ok) throw new Error("Unable to fetch Group Standings");

  return res.json() as Promise<GroupStandings[]>;
}
