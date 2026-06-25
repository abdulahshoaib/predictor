"use client";

import { PredictionChoice } from "@/types/predictions";
import { cn } from "@/lib/utils";

export interface MatchPrediction {
  prediction_choice: PredictionChoice;
}

interface PredictionBarProps {
  predictions: MatchPrediction[];
}

export function PredictionBar({ predictions }: PredictionBarProps) {
  const home = predictions.filter((p) => p.prediction_choice === "home").length;

  const draw = predictions.filter((p) => p.prediction_choice === "draw").length;

  const away = predictions.filter((p) => p.prediction_choice === "away").length;

  const total = predictions.length;

  const homePercent = total ? (home / total) * 100 : 0;
  const drawPercent = total ? (draw / total) * 100 : 0;
  const awayPercent = total ? (away / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "bg-emerald-500 transition-all duration-300",
              home === 0 && "hidden",
            )}
            style={{ width: `${homePercent}%` }}
          />

          <div
            className={cn(
              "bg-amber-400 transition-all duration-300",
              draw === 0 && "hidden",
            )}
            style={{ width: `${drawPercent}%` }}
          />

          <div
            className={cn(
              "bg-sky-500 transition-all duration-300",
              away === 0 && "hidden",
            )}
            style={{ width: `${awayPercent}%` }}
          />
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          H <strong>{homePercent.toFixed(0)}%</strong>
        </span>

        <span>
          D <strong>{drawPercent.toFixed(0)}%</strong>
        </span>

        <span>
          A <strong>{awayPercent.toFixed(0)}%</strong>
        </span>
      </div>

      <p className="text-center text-[11px] text-muted-foreground">
        {total} prediction{total !== 1 && "s"}
      </p>
    </div>
  );
}
