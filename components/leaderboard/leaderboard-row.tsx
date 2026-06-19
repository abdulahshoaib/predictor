import { Crown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/types";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}

function RankIndicator({ rank }: { rank: number }) {
  if (rank === 1) {
    return <Crown className="w-4 h-4 text-yellow-500 shrink-0" />;
  }
  if (rank === 2) {
    return (
      <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-black text-zinc-500 dark:text-zinc-300 shrink-0">
        2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-[10px] font-black text-amber-600 dark:text-amber-500 shrink-0">
        3
      </span>
    );
  }
  return (
    <span className="text-sm font-bold tabular-nums text-muted-foreground">
      {rank}
    </span>
  );
}

export function LeaderboardRow({ entry, isCurrentUser }: LeaderboardRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800/50 last:border-b-0 px-1",
        isCurrentUser &&
          "bg-primary/5 dark:bg-primary/10 -mx-1 px-2 rounded-lg",
      )}
    >
      {/* Rank */}
      <span className="w-7 shrink-0 flex items-center justify-center">
        <RankIndicator rank={entry.rank} />
      </span>

      {/* Name */}
      <span className="flex-1 text-sm font-medium truncate text-foreground flex items-center gap-1.5">
        {entry.display_name}
        {isCurrentUser && <Star className="w-2.5 h-2.5" />}
      </span>

      {/* Points */}
      <span className="text-sm font-bold tabular-nums text-foreground shrink-0">
        {entry.total_score}{" "}
        <span className="text-[10px] font-semibold text-muted-foreground">
          pts
        </span>
      </span>
    </div>
  );
}
