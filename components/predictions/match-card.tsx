'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Match, PredictionChoice } from '@/lib/types'

interface MatchCardProps {
  match: Match
  prediction?: PredictionChoice
  onPredict: (matchId: string, choice: PredictionChoice) => void
}

const CHOICES: { value: PredictionChoice; label: string }[] = [
  { value: 'home', label: 'H' },
  { value: 'draw', label: 'D' },
  { value: 'away', label: 'A' },
]

export function MatchCard({ match, prediction, onPredict }: MatchCardProps) {
  const isLocked = match.status !== 'upcoming'

  return (
    <Card className="bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-zinc-900/80 dark:border-zinc-800/80 dark:text-zinc-100 transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 px-4 sm:py-5 sm:px-6">
        <TeamDisplay name={match.team_home} flag={match.flag_home} align="left" />

        <div className="flex items-center gap-2 order-last sm:order-none">
          {CHOICES.map(({ value, label }) => (
            <Button
              key={value}
              variant={prediction === value ? 'default' : 'outline'}
              size="icon"
              disabled={isLocked}
              onClick={() => onPredict(match.id, value)}
              className={cn(
                'h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all',
                prediction === value && 'ring-2 ring-primary/30 scale-110'
              )}
            >
              {label}
            </Button>
          ))}
        </div>

        <TeamDisplay name={match.team_away} flag={match.flag_away} align="right" />
      </CardContent>
    </Card>
  )
}

interface TeamDisplayProps {
  name: string
  flag: string
  align: 'left' | 'right'
}

function TeamDisplay({ name, flag, align }: TeamDisplayProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 min-w-[100px] sm:min-w-[120px]',
        align === 'right' && 'sm:flex-row-reverse sm:justify-start'
      )}
    >
      <span className="text-2xl leading-none">{flag}</span>
      <span className="font-semibold text-xs sm:text-sm uppercase tracking-wide">
        {name}
      </span>
    </div>
  )
}
