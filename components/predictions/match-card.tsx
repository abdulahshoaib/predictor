"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  choice_labels,
  choices,
  cn,
  formatTime,
  getPredictionLabel,
  getResultClass,
  getResultDotClass,
  getResultLabel,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Prediction, PredictionChoice } from "@/types/predictions";
import { PredictionBar } from "./prediction-bar";
import { PredictionVotersDialog } from "./prediction-voters-dialog";
import { Match } from "@/types/matches";

type Base = {
  allPredictions?: Prediction[];
};

type PredictMatchCardProps = Base & {
  mode?: "predict";
  match: Match;
  prediction?: PredictionChoice;
  submitting?: boolean;
  onPredict: (match_id: number, choice: PredictionChoice) => void;
  allPredictions?: Prediction[];
};

type ResultMatchCardProps = Base & {
  mode: "result";
  match: Match;
  prediction?: PredictionChoice;
  isCorrect?: boolean;
};

type MatchCardProps = PredictMatchCardProps | ResultMatchCardProps;

export function MatchCard(props: MatchCardProps) {
  const { match, prediction, allPredictions } = props;

  const isResultCard = props.mode === "result";
  const submitting = !isResultCard ? props.submitting : false;
  const isCorrect = isResultCard ? props.isCorrect : undefined;
  const predicted = Boolean(prediction);
  const resultClass = getResultClass(predicted, isCorrect);
  const [localChoice, setLocalChoice] = useState<PredictionChoice | undefined>(
    prediction,
  );

  // Sync local selection when parent prediction updates
  useEffect(() => {
    setLocalChoice(prediction);
  }, [prediction]);

  const handleChoiceClick = (choice: PredictionChoice) => {
    setLocalChoice(choice);
  };

  const handleConfirm = async () => {
    if (!isResultCard && localChoice && !submitting) {
      await props.onPredict(match.id, localChoice);
    }
  };

  const getTeamTextClass = (choice: PredictionChoice) => {
    if (
      !isResultCard ||
      match.status !== "completed" ||
      prediction !== choice
    ) {
      return "text-foreground";
    }

    return resultClass;
  };

  const getMarkerClass = () =>
    isResultCard
      ? match.status !== "completed"
        ? cn(
            "absolute -right-1.5 -top-1.5 z-10 h-3 w-3 rounded-full border-2 border-white bg-amber-500 dark:border-zinc-950",
          )
        : cn(
            "absolute -right-1.5 -top-1.5 z-10 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-950",
            getResultDotClass(predicted, isCorrect),
          )
      : "absolute -right-1.5 -top-1.5 z-10 h-3 w-3 animate-in zoom-in duration-300 rounded-full border-2 border-white bg-primary dark:border-zinc-950";

  return (
    <div className="relative flex h-auto min-h-37 flex-col rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex min-w-0 flex-col gap-0.5">
          {match.group_name && (
            <span className="font-semibold tracking-wider">
              Group {match.group_name}
            </span>
          )}
          {!isResultCard && match.stadium && (
            <span className="truncate text-[11px] text-muted-foreground">
              {match.stadium}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {match.time && <span>{formatTime(match.time)}</span>}
          {isResultCard && match.status === "completed" && (
            <span className="font-semibold text-zinc-400">FT</span>
          )}
        </div>
      </div>

      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex flex-1 flex-col items-center gap-2">
          <span className="relative shrink-0 select-none text-2xl leading-none">
            <span className="block overflow-hidden rounded-md shadow-sm">
              {match.flag_home}
            </span>
            {prediction === "home" && <span className={getMarkerClass()} />}
          </span>
          <span
            className={cn(
              "max-w-24 wrap-break-word text-balance text-center text-xs font-semibold leading-tight",
              getTeamTextClass("home"),
            )}
          >
            {match.home_team || "TBD"}
          </span>
        </div>

        {isResultCard ? (
          <div className="flex shrink-0 flex-col items-center gap-2">
            {match.score_line ? (
              <div className="rounded-md bg-zinc-50 px-2.5 py-0.5 text-sm tracking-wide text-zinc-900 dark:bg-zinc-800/40 dark:text-zinc-50">
                {match.score_line.replace("-", " – ")}
              </div>
            ) : match.status === "ongoing" ? (
              <div className="animate-pulse rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                Live
              </div>
            ) : (
              <div className="rounded-md bg-zinc-50 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground dark:bg-zinc-800/40">
                FT
              </div>
            )}
            {prediction === "draw" && (
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  match.status !== "completed"
                    ? "bg-amber-500"
                    : getResultDotClass(predicted, isCorrect),
                )}
              />
            )}
          </div>
        ) : (
          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="flex items-center gap-1.5">
              {choices.map(({ value, label }) => {
                const isConfirmed = prediction === value;
                const isSelected = localChoice === value && !isConfirmed;

                return (
                  <Button
                    key={value}
                    onClick={() => handleChoiceClick(value)}
                    variant={
                      isConfirmed ? "default" : isSelected ? "outline" : "ghost"
                    }
                    size="icon-xs"
                  >
                    {label}
                  </Button>
                );
              })}
            </div>

            {!isResultCard && localChoice !== prediction && (
              <Button
                onClick={handleConfirm}
                disabled={submitting}
                size="sm"
                className="h-6 px-4 text-xs"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Confirm"
                )}
              </Button>
            )}
          </div>
        )}

        <div className="flex flex-1 flex-col items-center gap-2">
          <span className="relative shrink-0 select-none text-2xl leading-none">
            <span className="block overflow-hidden rounded-lg shadow-sm">
              {match.flag_away}
            </span>
            {prediction === "away" && <span className={getMarkerClass()} />}
          </span>
          <span
            className={cn(
              "max-w-24 wrap-break-word text-balance text-center text-xs font-semibold leading-tight",
              getTeamTextClass("away"),
            )}
          >
            {match.away_team || "TBD"}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-3">
        <PredictionBar predictions={allPredictions ?? []} />
        <div className="flex items-center justify-between pt-1">
          {!isResultCard && prediction && (
            <Badge
              variant="secondary"
              className="h-5 border-emerald-100 bg-emerald-50 px-2 py-0 text-xs text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/40 dark:text-emerald-400"
            >
              ✓ {getPredictionLabel(prediction, match)}
            </Badge>
          )}
          <div className="ml-auto">
            <PredictionVotersDialog predictions={allPredictions ?? []} />
          </div>
        </div>
      </div>

      {isResultCard && (
        <div className="flex items-center justify-between gap-2 pt-3 text-xs tracking-wider text-muted-foreground">
          {prediction ? (
            <span className="min-w-0 truncate">
              Prediction:{" "}
              <span className={cn("font-bold", resultClass)}>
                {choice_labels[prediction]}
              </span>
            </span>
          ) : (
            <span>Prediction: None</span>
          )}
          <span
            className={cn(
              "shrink-0",
              match.status !== "completed"
                ? "text-amber-500 font-semibold"
                : resultClass,
            )}
          >
            {match.status === "completed"
              ? getResultLabel(predicted, isCorrect)
              : "Ongoing"}
          </span>
        </div>
      )}
    </div>
  );
}
