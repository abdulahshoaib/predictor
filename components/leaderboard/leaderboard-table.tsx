import { LeaderboardRow } from './leaderboard-row'
import type { LeaderboardEntry } from '@/lib/types'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  currentUserId: string
}

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <span className="text-4xl">🏆</span>
        <p className="text-sm text-muted-foreground">No players on the leaderboard yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-1 pb-2 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="w-7 shrink-0 text-center">#</span>
        <span className="flex-1">Player</span>
        <span className="hidden sm:inline">Correct</span>
        <span className="shrink-0">Points</span>
      </div>

      {entries.map((entry) => (
        <LeaderboardRow
          key={entry.user_id}
          entry={entry}
          isCurrentUser={entry.user_id === currentUserId}
        />
      ))}
    </div>
  )
}
