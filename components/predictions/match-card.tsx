"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Trash2 } from "lucide-react";
import {
  choices,
  formatTime,
  getPredictionLabel,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Prediction, PredictionChoice } from "@/types/predictions";
import { PredictionBar } from "./prediction-bar";
import { PredictionVotersDialog } from "./prediction-voters-dialog";
import { Match } from "@/types/matches";

type Base = {
  allPredictions?: Prediction[];
  showBar?: boolean;
};

type PredictMatchCardProps = Base & {
  mode?: "predict";
  match: Match;
  prediction?: PredictionChoice;
  submitting?: boolean;
  onPredict: (match_id: number, choice: PredictionChoice | null) => void;
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
  const { match, prediction, allPredictions, showBar = true } = props;

  const isResultCard = props.mode === "result";
  const submitting = !isResultCard ? props.submitting : false;
  const isCorrect = isResultCard ? props.isCorrect : undefined;
  const [localChoice, setLocalChoice] = useState<PredictionChoice | undefined>(
    prediction,
  );
  const [submittingAction, setSubmittingAction] = useState<
    "save" | "delete" | null
  >(null);

  // Sync local selection when parent prediction updates
  useEffect(() => {
    setLocalChoice(prediction);
  }, [prediction]);

  // Clear local submitting state when parent finishes
  useEffect(() => {
    if (!submitting) {
      setSubmittingAction(null);
    }
  }, [submitting]);

  const handleChoiceClick = (choice: PredictionChoice) => {
    setLocalChoice(choice);
  };

  const handleConfirm = async () => {
    if (!isResultCard && localChoice && !submitting) {
      setSubmittingAction("save");
      props.onPredict(match.id, localChoice);
    }
  };

  const handleDelete = async () => {
    if (!isResultCard && !submitting) {
      setSubmittingAction("delete");
      setLocalChoice(undefined);
      props.onPredict(match.id, null);
    }
  };

  const getTeamTextClass = (_choice: PredictionChoice) => "text-foreground";

  return (
    <div className="relative flex h-auto min-h-37 flex-col rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex min-w-0 flex-col gap-0.5">
          {match.group_name ? (
            <span className="font-semibold tracking-wider">
              Group {match.group_name}
            </span>
          ) : match.stage ? (
            <span className="font-semibold tracking-wider">
              {match.stage}
            </span>
          ) : null}
          {match.stadium && (
            <span className="truncate text-[11px] text-muted-foreground">
              {match.stadium}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {match.time && <span>{formatTime(match.time)}</span>}
        </div>
      </div>

      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex flex-1 flex-col items-center gap-2">
          <span className="relative shrink-0 select-none text-2xl leading-none">
            <span className="block overflow-hidden rounded-md shadow-sm">
              {match.flag_home}
            </span>
            {prediction === "home" && (
              <span className="absolute -right-1.5 -top-1.5 z-10 h-3 w-3 rounded-full border-2 border-white bg-primary dark:border-zinc-950" />
            )}
          </span>
          <span className="max-w-24 wrap-break-word text-balance text-center text-xs font-semibold leading-tight text-foreground">
            {match.home_team || "TBD"}
          </span>
        </div>

        {isResultCard && (match.score_line || match.status === "ongoing") ? (
          <div className="flex shrink-0 flex-col items-center justify-center min-h-[76px]">
            {match.score_line ? (
              <div className="rounded-md bg-zinc-50 px-2.5 py-0.5 text-sm tracking-wide text-zinc-900 dark:bg-zinc-800/40 dark:text-zinc-50">
                {match.score_line.replace("-", " – ")}
              </div>
            ) : (
              <div className="animate-pulse rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                Live
              </div>
            )}
            {prediction === "draw" && (
              <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
        ) : isResultCard ? (
          <div className="flex shrink-0 flex-col items-center justify-center min-h-[76px]">
            <div className="rounded-md bg-zinc-50 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground dark:bg-zinc-800/40">
              FT
            </div>
          </div>
        ) : (
          <div className="flex shrink-0 flex-col items-center justify-center min-h-[76px] gap-2">
            <div className="flex items-center gap-1.5">
              {choices
                .filter(({ value }) => {
                  const isKnockout = match.stage !== "Group Stage";
                  return !(isKnockout && value === "draw");
                })
                .map(({ value, label }) => {
                  const isConfirmed = prediction === value;
                  const isSelected = localChoice === value && !isConfirmed;

                  return (
                    <Button
                      key={value}
                      onClick={() => handleChoiceClick(value)}
                      variant={
                        isConfirmed ? "default" : isSelected ? "outline" : "ghost"
                      }
                      className={isSelected ? "border-[#93c5fd] bg-[#93c5fd]" : ""}
                      size="icon-xs"
                    >
                      {label}
                    </Button>
                  );
                })}
            </div>

            <div className="flex items-center gap-1">
              <Button
                onClick={handleConfirm}
                disabled={
                  submitting || !localChoice || localChoice === prediction
                }
                size="icon-xs"
                variant="outline"
              >
                {submittingAction === "save" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                )}
              </Button>
              <Button
                onClick={handleDelete}
                disabled={submitting || !prediction}
                size="icon-xs"
                variant="outline"
              >
                {submittingAction === "delete" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5 text-red-400" />
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col items-center gap-2">
          <span className="relative shrink-0 select-none text-2xl leading-none">
            <span className="block overflow-hidden rounded-lg shadow-sm">
              {match.flag_away}
            </span>
            {prediction === "away" && (
              <span className="absolute -right-1.5 -top-1.5 z-10 h-3 w-3 rounded-full border-2 border-white bg-primary dark:border-zinc-950" />
            )}
          </span>
          <span className="max-w-24 wrap-break-word text-balance text-center text-xs font-semibold leading-tight text-foreground">
            {match.away_team || "TBD"}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-3">
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showBar
              ? "max-h-40 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <PredictionBar predictions={allPredictions ?? []} />
        </div>
        <div className="flex items-center justify-between pt-1">
          {prediction && (
            <Badge
              variant="secondary"
              className={`h-5 px-2 py-0 text-xs ${
                isResultCard && isCorrect === false
                  ? "border-red-100 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-950/40 dark:text-red-400"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/40 dark:text-emerald-400"
              }`}
            >
              {isResultCard && isCorrect === false ? "✗" : "✓"}{" "}
              {getPredictionLabel(prediction, match)}
            </Badge>
          )}
          <div className="ml-auto">
            <PredictionVotersDialog predictions={allPredictions ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
