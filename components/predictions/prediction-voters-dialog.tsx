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
import { choice_labels, cn } from "@/lib/utils";

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

      <DialogContent className="sm:max-w-xl md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Prediction Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Column
            label={choice_labels.home}
            users={home.map((p) => ({
              name: p.user_name,
              points: p.points_earned,
            }))}
            dotClass="bg-emerald-500"
          />
          <Column
            label={choice_labels.draw}
            users={draw.map((p) => ({
              name: p.user_name,
              points: p.points_earned,
            }))}
            dotClass="bg-amber-400"
          />
          <Column
            label={choice_labels.away}
            users={away.map((p) => ({
              name: p.user_name,
              points: p.points_earned,
            }))}
            dotClass="bg-sky-500"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Column({
  label,
  users,
  dotClass,
}: {
  label: string;
  users: { name: string; points?: number | null }[];
  dotClass: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 border-b pb-1.5">
        <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
        <span className="text-sm font-semibold">
          {label}{" "}
          <span className="font-normal text-muted-foreground">
            ({users.length})
          </span>
        </span>
      </div>

      {users.length > 0 ? (
        <ul className="flex flex-col gap-0.5">
          {users.map((user) => (
            <li
              key={user.name}
              className="flex items-center justify-between rounded px-1 py-0.5 text-xs hover:bg-muted"
            >
              <span className="truncate text-muted-foreground">
                {user.name}
              </span>

              {user.points != null && (
                <span
                  className={cn(
                    "shrink-0 font-semibold tabular-nums",
                    user.points > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : user.points < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-zinc-600 dark:text-zinc-400",
                  )}
                >
                  {user.points > 0 ? "+" : ""}
                  {user.points}pt
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs italic text-muted-foreground">None</p>
      )}
    </div>
  );
}
