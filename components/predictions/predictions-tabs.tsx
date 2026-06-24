"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMatchContext } from "@/context/matchContext";
import { usePredictionsContext } from "@/context/predictionsContext";
import { useUserContext } from "@/context/userContext";
import { formatDate, groupByDate } from "@/lib/utils";
import type { Match } from "@/types/matches";
import type { PredictionChoice } from "@/types/predictions";
import { MatchCard } from "./match-card";

type PredictedMatch = Match & {
  prediction?: PredictionChoice;
  isCorrect?: boolean;
};

export function PredictionsTabs() {
  const { upcoming, fulltime, loading } = useMatchContext();
  const { predictions, submitPrediction } = usePredictionsContext();
  const { user } = useUserContext();

  const predictionMap = useMemo(
    () =>
      new Map(
        predictions
          .filter((p) => p.user_id === user?.id)
          .map((p) => [p.match_id, p]),
      ),
    [predictions, user?.id],
  );

  const upcomingMatches = useMemo(
    () =>
      [...upcoming]
        .filter(
          (m) =>
            m.status !== "finished" &&
            m.status !== "live" &&
            m.home_team !== "TBD" &&
            m.away_team !== "TBD",
        )
        .sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
        ),
    [upcoming],
  );

  const predictedMatches = useMemo<PredictedMatch[]>(
    () =>
      fulltime.map((match) => {
        const prediction = predictionMap.get(match.id);

        return {
          ...match,
          prediction: prediction?.prediction_choice,
          isCorrect: prediction?.status === "correct",
        };
      }),
    [fulltime, predictionMap],
  );

  const groupedUpcoming = useMemo(
    () => groupByDate(upcomingMatches),
    [upcomingMatches],
  );

  const groupedPredicted = useMemo(
    () => groupByDate(predictedMatches),
    [predictedMatches],
  );

  const handlePredict = async (match_id: number, choice: PredictionChoice) => {
    await submitPrediction(match_id, choice);
  };

  const renderLoading = (text: string) => (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      <p className="text-sm">{text}</p>
    </div>
  );

  const renderGroupedMatches = (
    groups: Record<string, Match[] | PredictedMatch[]>,
    mode: "predict" | "result",
    emptyMessage: string,
  ) => {
    const dates = Object.keys(groups).sort((a, b) => a.localeCompare(b));

    if (dates.length === 0) {
      return (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      );
    }

    return (
      <div className="flex flex-col gap-10">
        {dates.map((date) => (
          <section key={date} className="flex flex-col gap-3">
            <h2 className="px-1 text-sm font-medium tracking-wider text-white/90">
              {formatDate(date)}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groups[date].map((match) => {
                if (mode === "result") {
                  const predictedMatch = match as PredictedMatch;

                  return (
                    <MatchCard
                      key={predictedMatch.id}
                      mode="result"
                      match={predictedMatch}
                      prediction={predictedMatch.prediction}
                      isCorrect={predictedMatch.isCorrect}
                    />
                  );
                }

                const prediction = predictionMap.get(match.id);

                return (
                  <MatchCard
                    key={match.id}
                    match={match}
                    prediction={prediction?.prediction_choice}
                    onPredict={handlePredict}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="upcoming" className="flex w-full flex-col gap-8">
      <div className="flex justify-center">
        <TabsList className="grid w-full max-w-md grid-cols-2 rounded-full border border-border/50 bg-muted/30 p-1">
          <TabsTrigger
            value="upcoming"
            className="rounded-full transition-all data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            Upcoming
          </TabsTrigger>

          <TabsTrigger
            value="my-predictions"
            className="rounded-full transition-all data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            Predicted
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="upcoming"
        className="mt-0 focus-visible:outline-none focus-visible:ring-0"
      >
        {loading
          ? renderLoading("Loading matches...")
          : renderGroupedMatches(
              groupedUpcoming,
              "predict",
              "No upcoming matches found.",
            )}
      </TabsContent>

      <TabsContent
        value="my-predictions"
        className="mt-0 focus-visible:outline-none focus-visible:ring-0"
      >
        {loading
          ? renderLoading("Loading predictions...")
          : renderGroupedMatches(
              groupedPredicted,
              "result",
              "You haven't made any predictions yet.",
            )}
      </TabsContent>
    </Tabs>
  );
}
