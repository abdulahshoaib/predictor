"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Match, PredictionChoice } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

function getPredictionLabel(
  prediction: PredictionChoice,
  match: Match,
): string {
  if (prediction === "home") return match.team_home;
  if (prediction === "away") return match.team_away;
  return "Draw";
}

type PredictMatchCardProps = {
  mode?: "predict";
  match: Match;
  prediction?: PredictionChoice;
  onPredict: (matchId: string, choice: PredictionChoice) => void;
};

type ResultMatchCardProps = {
  mode: "result";
  match: Match;
  prediction?: PredictionChoice;
  isCorrect?: boolean;
};

type MatchCardProps = PredictMatchCardProps | ResultMatchCardProps;

const CHOICES: { value: PredictionChoice; label: string }[] = [
  { value: "home", label: "H" },
  { value: "draw", label: "D" },
  { value: "away", label: "A" },
];

const CHOICE_LABELS: Record<PredictionChoice, string> = {
  home: "Home Win",
  draw: "Draw",
  away: "Away Win",
};

function getResultClass(predicted: boolean, isCorrect?: boolean) {
  if (!predicted) return "text-zinc-400 dark:text-zinc-500";
  if (isCorrect === true) return "text-emerald-600 dark:text-emerald-400";
  if (isCorrect === false) return "text-red-500 dark:text-red-400";
  return "text-zinc-500";
}

function getResultDotClass(predicted: boolean, isCorrect?: boolean) {
  if (!predicted) return "bg-zinc-400";
  if (isCorrect === true) return "bg-emerald-500";
  if (isCorrect === false) return "bg-red-500";
  return "bg-zinc-400";
}

function getResultLabel(predicted: boolean, isCorrect?: boolean) {
  if (!predicted) return "Not Predicted";
  if (isCorrect === true) return "Correct";
  if (isCorrect === false) return "Wrong";
  return "Pending";
}

export function MatchCard(props: MatchCardProps) {
  const { match, prediction } = props;
  const isResultCard = props.mode === "result";
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

  const handleConfirm = () => {
    if (!isResultCard && localChoice) {
      props.onPredict(match.id, localChoice);
    }
  };

  const getTeamTextClass = (choice: PredictionChoice) => {
    if (!isResultCard || prediction !== choice) return "text-foreground";
    return resultClass;
  };

  const getMarkerClass = () =>
    isResultCard
      ? cn(
          "absolute -right-1.5 -top-1.5 z-10 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-950",
          getResultDotClass(predicted, isCorrect),
        )
      : "absolute -right-1.5 -top-1.5 z-10 h-3 w-3 animate-in zoom-in duration-300 rounded-full border-2 border-white bg-primary dark:border-zinc-950";

  return (
    <div className="relative flex h-auto min-h-[148px] flex-col rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex min-w-0 items-center gap-1.5">
          {match.group && (
            <span className=" font-semibold tracking-wider">
              Group {match.group}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {match.time && <span>{formatTime(match.time)}</span>}
          {isResultCard ? (
            match.status === "live" ? (
              <></>
            ) : (
              <span className="font-semibold text-zinc-400">FT</span>
            )
          ) : prediction ? (
            <Badge
              variant="secondary"
              className="h-5 border-emerald-100 bg-emerald-50 px-2 py-0 text-xs text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/40 dark:text-emerald-400"
            >
              ✓ {getPredictionLabel(prediction, match)}
            </Badge>
          ) : null}
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
            {match.team_home || "TBD"}
          </span>
        </div>

        {isResultCard ? (
          <div className="flex shrink-0 flex-col items-center gap-2">
            {match.score_line ? (
              <div className="rounded-md bg-zinc-50 px-2.5 py-0.5 text-sm tracking-wide text-zinc-900 dark:bg-zinc-800/40 dark:text-zinc-50">
                {match.score_line.replace("-", " – ")}
              </div>
            ) : (
              <div className="rounded-md bg-zinc-50 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground dark:bg-zinc-800/40">
                {match.status === "live" ? "Live" : "FT"}
              </div>
            )}
            {prediction === "draw" && (
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  getResultDotClass(predicted, isCorrect),
                )}
              />
            )}
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-1.5">
            {CHOICES.map(({ value, label }) => {
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
                  className={cn(
                    "h-7 w-7 rounded-full text-xs font-bold transition-all",
                    isConfirmed &&
                      "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
                    isSelected &&
                      "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400",
                    !isConfirmed &&
                      !isSelected &&
                      "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {label}
                </Button>
              );
            })}
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
            {match.team_away || "TBD"}
          </span>
        </div>
      </div>

      {isResultCard && (
        <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-xs tracking-wider text-muted-foreground">
          {prediction ? (
            <span className="min-w-0 truncate">
              Prediction:{" "}
              <span className={cn("font-bold", resultClass)}>
                {CHOICE_LABELS[prediction]}
              </span>
            </span>
          ) : (
            <span>Prediction: None</span>
          )}
          <span
            className={cn(
              "shrink-0",
              match.status === "live"
                ? "text-amber-500 font-semibold animate-pulse"
                : resultClass,
            )}
          >
            {match.status === "live"
              ? "Ongoing"
              : getResultLabel(predicted, isCorrect)}
          </span>
        </div>
      )}

      {!isResultCard && localChoice !== prediction && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <Button
            onClick={handleConfirm}
            size="sm"
            className="h-6 rounded-full px-4 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-1 duration-200"
          >
            Confirm
          </Button>
        </div>
      )}
    </div>
  );
}
