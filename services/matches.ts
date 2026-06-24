import { getTeamFlag } from "@/lib/flags";
import { Match } from "@/types/matches";

function mapFlags(match: Match): Match {
  return {
    ...match,
    flag_home: getTeamFlag(match.home_team),
    flag_away: getTeamFlag(match.away_team),
  };
}

export async function fetchMatches() {
  const res = await fetch("/api/matches");

  if (!res.ok) {
    console.error(await res.text());
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();

  return {
    upcoming: data.upcoming.map(mapFlags),
    predicted: data.predicted.map(mapFlags),
  };
}
