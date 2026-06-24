"use client";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { MatchCard } from "./match-card";

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
  onPredict: (match_id: number, choice: PredictionChoice) => void;
  loading: boolean;
}

export function MatchList({
  matches,
  predictions,
  onPredict,
  loading,
}: MatchListProps) {
  // Only show upcoming (not finished and not live) matches

  const upcomingMatches = useMemo(
    () => matches.filter((m) => m.status !== "finished" && m.status !== "live"),
    [matches],
  );

  const matchesByDate = useMemo(() => {
    const groups: Record<string, Match[]> = {};

    const sortedMatches = [...upcomingMatches].sort((a, b) => {
      const timeA = a.time ? new Date(a.time).getTime() : 0;
      const timeB = b.time ? new Date(b.time).getTime() : 0;
      return timeA - timeB;
    });

    sortedMatches.forEach((m) => {
      const key = getLocalDateString(m);

      if (m.home_team === "TBD" || m.away_team === "TBD") return;

      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });

    return groups;
  }, [upcomingMatches]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium">Loading matches...</p>
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
    <div className="flex flex-col gap-10">
      {Object.entries(matchesByDate).map(([date, dateMatches]) => (
        <section key={date} className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-white/90 px-1 tracking-wider">
            {formatDate(date)}
          </h2>

          {/* Added grid container here */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dateMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                prediction={predictions[match.id]}
                onPredict={onPredict}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
