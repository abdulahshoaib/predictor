import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hasEnvVars =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function formatDate(dateString: string) {
  const date = new Date(dateString);

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

  return date.toISOString().split("T")[0];
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
