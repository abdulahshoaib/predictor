"use client";

import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LeaderboardToggle() {
  const { leaderboard, updateLeaderboardOpt } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    if (isUpdating) return;
    
    if (leaderboard === 'disabled') {
      const confirmEnable = window.confirm("Are you sure you want to enable global leaderboard visibility? Your username and score will be shown to other users.");
      if (!confirmEnable) return;
    }

    setIsUpdating(true);
    const newStatus = leaderboard === 'enabled' ? 'disabled' : 'enabled';
    await updateLeaderboardOpt(newStatus);
    router.refresh();
    setIsUpdating(false);
  };

  return (
    <div className="w-full pb-6 border-b border-zinc-150 dark:border-zinc-800/60 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-base font-bold text-zinc-900 dark:text-white">Leaderboard Visibility</h2>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          Toggle whether your rank and profile are visible on the global matchmaking leaderboard.
        </p>
      </div>
      <button
        onClick={handleToggle}
        disabled={isUpdating}
        className={cn(
          "px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed",
          leaderboard === 'enabled'
            ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
            : "bg-zinc-100 border-zinc-200 text-zinc-700 dark:bg-zinc-850 dark:border-zinc-750 dark:text-zinc-300 hover:bg-zinc-200"
        )}
      >
        {leaderboard === 'enabled' ? '✓ Visible on Leaderboard' : '✗ Hidden from Leaderboard'}
      </button>
    </div>
  );
}
