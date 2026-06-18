"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Match, PredictionChoice } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function formatTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPredictionLabel(prediction: PredictionChoice, match: Match): string {
  if (prediction === "home") return match.team_home;
  if (prediction === "away") return match.team_away;
  return "Draw";
}

interface MatchCardProps {
  match: Match;
  prediction?: PredictionChoice;
  onPredict: (matchId: string, choice: PredictionChoice) => void;
}

const CHOICES: { value: PredictionChoice; label: string }[] = [
  { value: "home", label: "H" },
  { value: "draw", label: "D" },
  { value: "away", label: "A" },
];

export function MatchCard({ match, prediction, onPredict }: MatchCardProps) {
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
    if (localChoice) {
      onPredict(match.id, localChoice);
    }
  };

  return (
    <div className="py-4 border-b border-zinc-100 dark:border-zinc-800/50 last:border-b-0">
      {/* Top row: meta */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2.5">
        <div className="flex items-center gap-1.5">
          {match.group && (
            <span className="font-semibold uppercase tracking-wider">
              {match.group}
            </span>
          )}
          {match.stage && (
            <span className="uppercase tracking-wider">{match.stage}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {match.time && <span>{formatTime(match.time)}</span>}
          {match.status && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 uppercase tracking-wide">
              {match.status}
            </Badge>
          )}
          {prediction && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30">
              ✓ {getPredictionLabel(prediction, match)}
            </Badge>
          )}
        </div>
      </div>

      {/* Teams row */}
      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl leading-none select-none shrink-0 relative">
            {match.flag_home}
            {prediction === "home" && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white dark:border-zinc-950 animate-in zoom-in duration-300" />
            )}
          </span>
          <span
            className={cn(
              "text-xs font-bold uppercase truncate transition-colors",
              prediction === "home"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-foreground",
            )}
          >
            {match.team_home}
          </span>
        </div>

        {/* Prediction buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {CHOICES.map(({ value, label }) => {
            const isConfirmed = prediction === value;
            const isSelected = localChoice === value && !isConfirmed;

            return (
              <Button
                key={value}
                onClick={() => handleChoiceClick(value)}
                variant={isConfirmed ? "default" : isSelected ? "outline" : "ghost"}
                size="icon-xs"
                className={cn(
                  "rounded-full font-bold text-xs transition-all",
                  isConfirmed && "bg-primary text-white hover:bg-primary",
                  isSelected && "border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-950/40 dark:hover:bg-blue-950/60",
                )}
              >
                {label}
              </Button>
            );
          })}
        </div>

        {/* Away */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span
            className={cn(
              "text-xs font-bold uppercase truncate text-right transition-colors",
              prediction === "away"
                ? "text-primary"
                : "text-foreground",
            )}
          >
            {match.team_away}
          </span>
          <span className="text-xl leading-none select-none shrink-0 relative">
            {match.flag_away}
            {prediction === "away" && (
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white dark:border-zinc-950 animate-in zoom-in duration-300" />
            )}
          </span>
        </div>
      </div>

      {/* Confirm button */}
      {localChoice !== prediction && (
        <div className="mt-2.5 flex justify-center">
          <Button onClick={handleConfirm} size="xs">
            Confirm Prediction
          </Button>
        </div>
      )}
    </div>
  );
}
