"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { MatchCard } from "./match-card";
import type { Match, PredictionChoice } from "@/lib/types";

interface FinishedMatch extends Match {
  predicted: boolean;
  choice?: PredictionChoice;
  isCorrect?: boolean;
}

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
  // Finished or ongoing matches, enriched with prediction info
  const finishedMatches: FinishedMatch[] = useMemo(() => {
    return (
      matches
        .filter((m) => m.status === "finished" || m.status === "live")
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

    const sortedMatches = [...finishedMatches].sort((a, b) => {
      const timeA = a.time ? new Date(a.time).getTime() : 0;
      const timeB = b.time ? new Date(b.time).getTime() : 0;
      return timeA - timeB; // Earliest matches first
    });

    sortedMatches.forEach((m) => {
      const key = getLocalDateString(m);

      if (key === "TBD") return;

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
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium animate-pulse">Loading matches...</p>
      </div>
    );
  }

  if (finishedMatches.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-12">
        No matches have been played yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {sortedDates.map((date) => {
        const dateMatches = matchesByDate[date];
        return (
          <section key={date} className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-white/90 px-1 tracking-wider">
              {formatDate(date)}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dateMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  mode="result"
                  match={match}
                  prediction={match.choice}
                  isCorrect={match.isCorrect}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
