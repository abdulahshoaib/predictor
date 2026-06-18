"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Match, PredictionChoice } from "@/lib/types";

interface FinishedMatch extends Match {
  predicted: boolean;
  choice?: PredictionChoice;
  isCorrect?: boolean;
  score_line?: string | null;
}

const CHOICE_LABELS: Record<string, string> = {
  home: "Home Win",
  draw: "Draw",
  away: "Away Win",
};

function getLocalDateString(match: Match): string {
  if (match.time) {
    try {
      const date = new Date(match.time);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    } catch {
      // Fallback
    }
  }
  return match.match_date || "TBD";
}

function formatDate(dateString: string): string {
  if (!dateString || dateString === "TBD" || !dateString.includes("-")) {
    return dateString || "TBD";
  }
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function formatTime(isoString: string) {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

interface PredictionListProps {
  matches: Match[];
  userPredictions: Record<string, PredictionChoice>;
  loading: boolean;
}

export default function PredictionList({
  matches,
  userPredictions,
  loading,
}: PredictionListProps) {
  // Only finished matches, enriched with prediction info
  const finishedMatches: FinishedMatch[] = useMemo(() => {
    return (
      matches
        .map((m) => {
          const id = String(m.id);
          const choice = userPredictions[id];
          const predicted = choice !== undefined;

          let isCorrect: boolean | undefined;
          if (predicted && m.winner) {
            const winnerClean = m.winner.trim().toLowerCase();
            const homeClean = (m.team_home || "").trim().toLowerCase();
            const awayClean = (m.team_away || "").trim().toLowerCase();

            let outcome: string | null = null;
            if (winnerClean === "home" || winnerClean === homeClean)
              outcome = "home";
            else if (winnerClean === "away" || winnerClean === awayClean)
              outcome = "away";
            else if (winnerClean === "draw" || winnerClean === "d")
              outcome = "draw";

            if (outcome) {
              isCorrect = outcome === choice;
            }
          }

          return { ...m, predicted, choice, isCorrect };
        })
        // Most recent first
        .sort((a, b) => {
          if (!a.time || !b.time) return 0;
          return new Date(b.time).getTime() - new Date(a.time).getTime();
        })
    );
  }, [matches, userPredictions]);

  const matchesByDate = useMemo(() => {
    const groups: Record<string, FinishedMatch[]> = {};
    finishedMatches.forEach((m) => {
      const key = getLocalDateString(m);
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });
    return groups;
  }, [finishedMatches]);

  const sortedDates = useMemo(() => {
    return Object.keys(matchesByDate).sort((a, b) => {
      if (a === "TBD") return 1;
      if (b === "TBD") return -1;
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }, [matchesByDate]);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (finishedMatches.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <span className="text-4xl">🏟️</span>
        <p className="text-sm text-muted-foreground">
          No matches have been played yet.
        </p>
        <p className="text-xs text-muted-foreground/60">
          Results will appear here once matches finish.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Match result feed grouped by date */}
      <div className="flex flex-col gap-6">
        {sortedDates.map((date) => {
          const dateMatches = matchesByDate[date];
          return (
            <section key={date} className="flex flex-col gap-2">
              <h2 className="text-xs font-medium text-muted-foreground px-1 uppercase tracking-wider">
                {formatDate(date)}
              </h2>
              {dateMatches.map((match) => {
                const id = String(match.id);
                return (
                  <div
                    key={id}
                    className="py-4 border-b border-zinc-100 dark:border-zinc-800/50 last:border-b-0"
                  >
                    {/* Meta row */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2.5">
                      <div className="flex items-center gap-1.5">
                        {match.group && (
                          <span className="font-semibold uppercase tracking-wider">
                            Group {match.group}
                          </span>
                        )}
                        {match.stage && (
                          <span className="uppercase tracking-wider">
                            {match.stage}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {match.time && <span>{formatTime(match.time)}</span>}
                        <span className="font-semibold text-zinc-400 uppercase">
                          FT
                        </span>
                        <span className="text-zinc-300 dark:text-zinc-700 select-none">
                          •
                        </span>
                        {/* Result badge */}
                        {!match.predicted ? (
                          <span className="font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                            — Not Predicted
                          </span>
                        ) : match.isCorrect ? (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            ✓ Correct
                          </span>
                        ) : (
                          <span className="font-bold text-red-500 dark:text-red-400 uppercase tracking-wider">
                            ✗ Wrong
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Teams row */}
                    <div className="flex items-center gap-3">
                      {/* Home */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xl leading-none select-none shrink-0 relative">
                          {match.flag_home}
                          {match.predicted && match.choice === "home" && (
                            <span
                              className={cn(
                                "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-950",
                                match.isCorrect === true && "bg-emerald-500",
                                match.isCorrect === false && "bg-red-500",
                                match.isCorrect === undefined && "bg-zinc-400",
                              )}
                            />
                          )}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-bold uppercase truncate transition-colors",
                            match.predicted && match.choice === "home"
                              ? match.isCorrect === true
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-500 dark:text-red-400"
                              : "text-foreground",
                          )}
                        >
                          {match.team_home || "TBD"}
                        </span>
                      </div>

                      {/* Score */}
                      {match.score_line ? (
                        <div className="shrink-0 text-sm font-black tabular-nums tracking-wide text-zinc-900 dark:text-zinc-50 px-2.5 py-0.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-md">
                          {match.score_line.replace("-", " – ")}
                        </div>
                      ) : (
                        <div className="shrink-0 text-xs font-medium text-muted-foreground">
                          FT
                        </div>
                      )}

                      {/* Away */}
                      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                        <span
                          className={cn(
                            "text-xs font-bold uppercase truncate text-right transition-colors",
                            match.predicted && match.choice === "away"
                              ? match.isCorrect === true
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-500 dark:text-red-400"
                              : "text-foreground",
                          )}
                        >
                          {match.team_away || "TBD"}
                        </span>
                        <span className="text-xl leading-none select-none shrink-0 relative">
                          {match.flag_away}
                          {match.predicted && match.choice === "away" && (
                            <span
                              className={cn(
                                "absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-950",
                                match.isCorrect === true && "bg-emerald-500",
                                match.isCorrect === false && "bg-red-500",
                                match.isCorrect === undefined && "bg-zinc-400",
                              )}
                            />
                          )}
                        </span>
                      </div>
                    </div>

                    {/* User's prediction */}
                    {match.predicted && match.choice && (
                      <div className="mt-1 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider">
                        <span>Your prediction:</span>
                        <span
                          className={cn(
                            "font-bold",
                            match.isCorrect === true &&
                              "text-emerald-600 dark:text-emerald-400",
                            match.isCorrect === false &&
                              "text-red-500 dark:text-red-400",
                            match.isCorrect === undefined && "text-zinc-500",
                          )}
                        >
                          {CHOICE_LABELS[match.choice]}
                          {match.choice === "draw" && (
                            <span
                              className={cn(
                                "inline-block w-1.5 h-1.5 rounded-full ml-1",
                                match.isCorrect === true && "bg-emerald-500",
                                match.isCorrect === false && "bg-red-500",
                                match.isCorrect === undefined && "bg-zinc-400",
                              )}
                            />
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </div>
  );
}
