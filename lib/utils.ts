import { Match } from "@/types/matches";
import { PredictionChoice } from "@/types/predictions";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hasEnvVars =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function formatDate(dateString: string) {
  const [y, m, d] = dateString.split("-").map(Number);
  const date = new Date(y, m - 1, d);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTime(isoString: string) {
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

export function getDateKey(time?: string) {
  if (!time) return "TBD";

  const date = new Date(time);

  if (isNaN(date.getTime())) return "TBD";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function groupByDate<T extends { time?: string }>(matches: T[]) {
  return matches.reduce<Record<string, T[]>>((groups, match) => {
    const key = getDateKey(match.time);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(match);

    return groups;
  }, {});
}

export function getPredictionLabel(
  prediction: PredictionChoice,
  match: Match,
): string {
  if (prediction === "home") return match.home_team;
  if (prediction === "away") return match.away_team;
  return "Draw";
}

export const choices: { value: PredictionChoice; label: string }[] = [
  { value: "home", label: "H" },
  { value: "draw", label: "D" },
  { value: "away", label: "A" },
];

export const choice_labels: Record<PredictionChoice, string> = {
  home: "Home Win",
  draw: "Draw",
  away: "Away Win",
};

export function getResultClass(predicted: boolean, isCorrect?: boolean) {
  if (!predicted) return "text-zinc-400 dark:text-zinc-500";
  if (isCorrect === true) return "text-emerald-600 dark:text-emerald-400";
  if (isCorrect === false) return "text-red-500 dark:text-red-400";
  return "text-zinc-500";
}

export function getResultDotClass(predicted: boolean, isCorrect?: boolean) {
  if (!predicted) return "bg-zinc-400";
  if (isCorrect === true) return "bg-emerald-500";
  if (isCorrect === false) return "bg-red-500";
  return "bg-zinc-400";
}

export function getResultLabel(predicted: boolean, isCorrect?: boolean) {
  if (!predicted) return "Not Predicted";
  if (isCorrect === true) return "Correct";
  if (isCorrect === false) return "Wrong";
  return "Pending";
}
