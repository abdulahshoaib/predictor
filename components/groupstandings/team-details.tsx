"use client";
import { useMatchContext } from "@/context/matchContext";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { getTeamFlag } from "@/lib/flags";

interface TeamDialogProps {
  team: string;
}

export function TeamDialog({ team }: TeamDialogProps) {
  const { upcoming, fulltime } = useMatchContext();

  const team_upcoming = upcoming.filter(
    (match) => match.home_team === team || match.away_team === team,
  );

  const team_fulltime = fulltime
    .filter((match) => match.home_team === team || match.away_team === team)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const recentScores = team_fulltime.slice(0, 5).map((match) => {
    const isHome = match.home_team === team;
    const opponent = isHome ? match.away_team : match.home_team;

    const result: "W" | "L" | "D" =
      !match.result || match.result === "draw"
        ? "D"
        : (match.result === "home" && isHome) ||
            (match.result === "away" && !isHome)
          ? "W"
          : "L";

    return { ...match, opponent, result };
  });

  const resultBadge = {
    W: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    L: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    D: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  const resultLabel = { W: "W", L: "L", D: "D" };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg">
          <span className="inline-block w-5">{getTeamFlag(team)}</span>
          {team}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-5">
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recent Results
          </h3>

          <div className="space-y-1">
            {recentScores.length > 0 ? (
              recentScores.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="w-4 shrink-0">
                      {getTeamFlag(match.opponent)}
                    </span>
                    <span className="truncate text-sm">{match.opponent}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tabular-nums">
                      {match.score_line ?? "-"}
                    </span>
                    <span
                      className={`inline-flex h-5 w-6 items-center justify-center rounded text-[11px] font-bold leading-none ${resultBadge[match.result]}`}
                    >
                      {resultLabel[match.result]}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-2 text-center text-xs text-muted-foreground">
                No recent matches
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Upcoming
          </h3>

          <div className="space-y-1">
            {team_upcoming.length > 0 ? (
              team_upcoming.map((match) => {
                const opponent =
                  match.home_team === team ? match.away_team : match.home_team;

                return (
                  <div
                    key={match.id}
                    className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="w-4 shrink-0">
                        {getTeamFlag(opponent)}
                      </span>
                      <span className="truncate text-sm">{opponent}</span>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(match.time).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="py-2 text-center text-xs text-muted-foreground">
                No upcoming matches
              </p>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
