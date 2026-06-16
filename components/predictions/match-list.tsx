"use client";

import { useState, useMemo } from "react";
import { MatchCard } from "./match-card";
import type { Match, PredictionChoice } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

function getLocalDateString(match: Match): string {
  if (match.time) {
    try {
      const date = new Date(match.time);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch {
      // Fallback
    }
  }
  return match.match_date || "TBD";
}

function groupMatchesByDate(matches: Match[]) {
  return matches.reduce<Record<string, Match[]>>((groups, match) => {
    const date = getLocalDateString(match);
    if (!groups[date]) groups[date] = [];
    groups[date].push(match);
    return groups;
  }, {});
}

function formatDate(dateString: string): string {
  // Gracefully handle TBD or invalid dates
  if (!dateString || dateString === "TBD" || dateString === "Unknown Date" || !dateString.includes("-")) {
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
  userId: string;
  initialPredictions?: Record<string, PredictionChoice>;
  matches: Match[];
}

export function MatchList({
  userId,
  initialPredictions = {},
  matches,
}: MatchListProps) {
  const [predictions, setPredictions] =
    useState<Record<string, PredictionChoice>>(initialPredictions);

  // Filter to only show matches that have not happened yet (upcoming)
  const upcomingMatches = useMemo(() => {
    return matches.filter((m) => m.status === "upcoming");
  }, [matches]);

  const matchesByDate = useMemo(() => groupMatchesByDate(upcomingMatches), [upcomingMatches]);

  const handlePredict = async (matchId: string, choice: PredictionChoice) => {
    setPredictions((prev) => ({ ...prev, [matchId]: choice }));

    const supabase = createClient();
    const numericMatchId = parseInt(matchId, 10);

    try {
      const { data: existing, error: fetchError } = await supabase
        .from("predictions")
        .select("id")
        .eq("user_id", userId)
        .eq("match_id", numericMatchId)
        .maybeSingle();

      if (fetchError) {
        console.error(
          "Error checking existing prediction:",
          fetchError.message,
        );
      }

      if (existing) {
        const { error: updateError } = await supabase
          .from("predictions")
          .update({ choice })
          .eq("id", existing.id);

        if (updateError) {
          console.error("Error updating prediction:", updateError.message);
        }
      } else {
        const { error: insertError } = await supabase
          .from("predictions")
          .insert({
            user_id: userId,
            match_id: numericMatchId,
            choice,
          });

        if (insertError) {
          console.error("Error inserting prediction:", insertError.message);
        }
      }
    } catch (err) {
      console.error("Unexpected error saving prediction:", err);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(matchesByDate).map(([date, matches]) => (
        <section key={date} className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground px-1">
            {formatDate(date)}
          </h2>
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={predictions[match.id]}
              onPredict={handlePredict}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
