"use client";
import { useMemo } from "react";
import { MatchCard } from "./match-card";
import type { Match, PredictionChoice } from "@/lib/types";

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

interface MatchListProps {
  matches: Match[];
  predictions: Record<string, PredictionChoice>;
  onPredict: (matchId: string, choice: PredictionChoice) => void;
  loading: boolean;
}

export function MatchList({
  matches,
  predictions,
  onPredict,
  loading,
}: MatchListProps) {
  // Only show upcoming (not finished) matches
  const upcomingMatches = useMemo(
    () => matches.filter((m) => m.status !== "finished"),
    [matches],
  );

  const matchesByDate = useMemo(() => {
    const groups: Record<string, Match[]> = {};
    upcomingMatches.forEach((m) => {
      const key = getLocalDateString(m);
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });
    return groups;
  }, [upcomingMatches]);

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

  if (upcomingMatches.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-12">
        No upcoming matches found.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(matchesByDate).map(([date, dateMatches]) => (
        <section key={date} className="flex flex-col gap-2">
          <h2 className="text-xs font-medium text-muted-foreground px-1 uppercase tracking-wider">
            {formatDate(date)}
          </h2>
          {dateMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={predictions[match.id]}
              onPredict={onPredict}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
