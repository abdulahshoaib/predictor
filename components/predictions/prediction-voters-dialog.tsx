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

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Prediction Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4">
          <Column
            label={choice_labels.home}
            count={home.length}
            users={home.map((p) => p.user_name)}
            dotClass="bg-emerald-500"
          />
          <Column
            label={choice_labels.draw}
            count={draw.length}
            users={draw.map((p) => p.user_name)}
            dotClass="bg-amber-400"
          />
          <Column
            label={choice_labels.away}
            count={away.length}
            users={away.map((p) => p.user_name)}
            dotClass="bg-sky-500"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Column({
  label,
  count,
  users,
  dotClass,
}: {
  label: string;
  count: number;
  users: string[];
  dotClass: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 border-b pb-1.5">
        <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
        <span className="text-sm font-semibold">
          {label}{" "}
          <span className="font-normal text-muted-foreground">({count})</span>
        </span>
      </div>

      {users.length > 0 ? (
        <ul className="flex flex-col gap-0.5">
          {users.map((name, i) => (
            <li
              key={i}
              className="truncate rounded px-1 py-0.5 text-xs text-muted-foreground hover:bg-muted"
            >
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs italic text-muted-foreground">None</p>
      )}
    </div>
  );
}
