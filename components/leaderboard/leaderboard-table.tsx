import { LeaderboardRow } from './leaderboard-row'
import type { LeaderboardEntry } from '@/lib/types'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  currentUserId: string
}

export function LeaderboardTable({
  entries,
  currentUserId,
}: LeaderboardTableProps) {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            <th className="px-6 py-3 text-center font-semibold w-20">Rank</th>
            <th className="px-6 py-3 text-left font-semibold">User</th>
            <th className="px-6 py-3 text-center font-semibold w-32">
              Correct
            </th>
            <th className="px-6 py-3 text-right font-semibold w-28">Points</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <LeaderboardRow
              key={entry.user_id}
              entry={entry}
              isCurrentUser={entry.user_id === currentUserId}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
