"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Prediction } from "@/types/predictions";
import { choice_labels } from "@/lib/utils";

interface PredictionVotersDialogProps {
  predictions: Prediction[];
}

export function PredictionVotersDialog({
  predictions,
}: PredictionVotersDialogProps) {
  const home = predictions.filter((p) => p.prediction_choice === "home");
  const draw = predictions.filter((p) => p.prediction_choice === "draw");
  const away = predictions.filter((p) => p.prediction_choice === "away");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 text-xs">
          Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Prediction Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Section
            label={choice_labels.home}
            count={home.length}
            users={home.map((p) => p.user_name)}
            barClass="bg-emerald-500"
          />
          <Section
            label={choice_labels.draw}
            count={draw.length}
            users={draw.map((p) => p.user_name)}
            barClass="bg-amber-400"
          />
          <Section
            label={choice_labels.away}
            count={away.length}
            users={away.map((p) => p.user_name)}
            barClass="bg-sky-500"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  label,
  count,
  users,
  barClass,
}: {
  label: string;
  count: number;
  users: string[];
  barClass: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${barClass}`} />
        <span className="text-sm font-semibold">
          {label}{" "}
          <span className="font-normal text-muted-foreground">({count})</span>
        </span>
      </div>

      {users.length > 0 ? (
        <p className="pl-4 text-xs text-muted-foreground">
          {users.join(", ")}
        </p>
      ) : (
        <p className="pl-4 text-xs text-muted-foreground italic">
          No predictions
        </p>
      )}
    </div>
  );
}
