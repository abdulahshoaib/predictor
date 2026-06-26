"use client";

import { useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  const { upcoming, fulltime, loading: matchesLoading } = useMatchContext();
  const {
    predictions,
    loading: predictionsLoading,
    submittingMatchId,
    submitPrediction,
  } = usePredictionsContext();
  const { user } = useUserContext();

  const loading = matchesLoading || predictionsLoading;

  const userPredictions = useMemo(
    () => predictions.filter((p) => p.user_id === user?.id),
    [predictions, user?.id],
  );

  const predictionMap = useMemo(
    () => new Map(userPredictions.map((p) => [p.match_id, p])),
    [userPredictions],
  );

  const predictionsByMatch = useMemo(() => {
    return predictions.reduce((map, prediction) => {
      if (!map.has(prediction.match_id)) {
        map.set(prediction.match_id, []);
      }

      map.get(prediction.match_id)!.push(prediction);

      return map;
    }, new Map<number, typeof predictions>());
  }, [predictions]);

  const upcomingMatches = useMemo(
    () =>
      [...upcoming]
        .filter(
          (m) =>
            m.status !== "completed" &&
            m.status !== "ongoing" &&
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
      fulltime
        .map((match) => {
          const prediction = predictionMap.get(match.id);

          return {
            ...match,
            prediction: prediction?.prediction_choice,
            isCorrect:
              match.status === "completed"
                ? prediction?.status === "correct"
                : undefined,
          };
        })
        .sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
        ),
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

  const renderLoading = () => (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h2 className="px-1 text-sm font-medium tracking-wider text-white/90">
          <Skeleton width={120} />
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="relative flex h-auto min-h-37 flex-col rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="mb-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-semibold tracking-wider">
                    <Skeleton width={60} />
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    <Skeleton width={100} />
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Skeleton width={40} />
                </div>
              </div>

              <div className="flex w-full items-start justify-between gap-2">
                <div className="flex flex-1 flex-col items-center gap-2">
                  <span className="relative shrink-0 select-none text-2xl leading-none">
                    <Skeleton width={32} height={24} className="rounded-md" />
                  </span>
                  <Skeleton width={60} />
                </div>

                <div className="flex shrink-0 flex-col items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <Skeleton width={28} height={24} className="rounded-md" />
                    <Skeleton width={28} height={24} className="rounded-md" />
                    <Skeleton width={28} height={24} className="rounded-md" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-center gap-2">
                  <span className="relative shrink-0 select-none text-2xl leading-none">
                    <Skeleton width={32} height={24} className="rounded-md" />
                  </span>
                  <Skeleton width={60} />
                </div>
              </div>

              <div className="mt-auto pt-3">
                <Skeleton height={8} className="mb-2" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton width={80} height={20} />
                  <div className="ml-auto">
                    <Skeleton circle width={24} height={24} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderGroupedMatches = (
    groups: Record<string, Match[] | PredictedMatch[]>,
    mode: "predict" | "result",
    emptyMessage: string,
  ) => {
    const dates = Object.keys(groups).sort((a, b) =>
      mode === "result" ? b.localeCompare(a) : a.localeCompare(b),
    );

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
                      allPredictions={
                        predictionsByMatch.get(predictedMatch.id) ?? []
                      }
                    />
                  );
                }

                const prediction = predictionMap.get(match.id);

                return (
                  <MatchCard
                    key={match.id}
                    match={match}
                    prediction={prediction?.prediction_choice}
                    submitting={submittingMatchId === match.id}
                    onPredict={handlePredict}
                    allPredictions={predictionsByMatch.get(match.id) ?? []}
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
