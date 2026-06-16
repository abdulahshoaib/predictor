import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { LeaderboardEntry } from '@/lib/types'

interface LeaderboardRowProps {
  entry: LeaderboardEntry
  isCurrentUser: boolean
}

const RANK_STYLES: Record<number, string> = {
  1: 'bg-yellow-500/15 text-yellow-950 dark:text-yellow-100 hover:bg-yellow-500/25',
  2: 'bg-slate-300/10 text-slate-800 dark:text-slate-100 hover:bg-slate-300/20',
  3: 'bg-amber-700/15 text-amber-950 dark:text-amber-100 hover:bg-amber-700/25',
}

export function LeaderboardRow({ entry, isCurrentUser }: LeaderboardRowProps) {
  const rowStyle = RANK_STYLES[entry.rank]
  const isLightRow = !rowStyle

  return (
    <tr
      className={cn(
        'border-b border-border transition-colors text-foreground',
        rowStyle,
        isLightRow && isCurrentUser && 'bg-primary/20 hover:bg-primary/30',
        isLightRow && !isCurrentUser && (entry.rank % 2 === 0 ? 'bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/85' : 'bg-white dark:bg-zinc-800/40 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/85')
      )}
    >
      <td className={cn(
        "px-3 sm:px-6 py-3 sm:py-4 text-center font-bold text-base",
        entry.rank === 1 && "text-yellow-600 dark:text-yellow-400",
        entry.rank === 2 && "text-slate-600 dark:text-slate-300",
        entry.rank === 3 && "text-amber-700 dark:text-amber-500"
      )}>
        {entry.rank}
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium">
        <span>{entry.display_name}</span>
        {isCurrentUser && (
          <Badge variant="secondary" className="ml-2">
            You
          </Badge>
        )}
      </td>
      <td className="hidden sm:table-cell px-6 py-4 text-center text-muted-foreground">
        {entry.correct_predictions}/{entry.total_predictions}
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 text-right font-bold text-base">
        {entry.total_score}
      </td>
    </tr>
  )
}
