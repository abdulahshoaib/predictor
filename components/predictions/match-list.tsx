'use client'

import { useState, useMemo } from 'react'
import { MatchCard } from './match-card'
import { MOCK_MATCHES } from '@/lib/mock-data'
import type { PredictionChoice } from '@/lib/types'

function groupMatchesByDate(matches: typeof MOCK_MATCHES) {
  return matches.reduce<Record<string, typeof MOCK_MATCHES>>(
    (groups, match) => {
      const date = match.match_date
      if (!groups[date]) groups[date] = []
      groups[date].push(match)
      return groups
    },
    {}
  )
}

function formatDate(dateString: string): string {
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function MatchList() {
  const [predictions, setPredictions] = useState<
    Record<string, PredictionChoice>
  >({})

  // TODO: Replace with Supabase fetch — fetch user's existing predictions
  const matchesByDate = useMemo(() => groupMatchesByDate(MOCK_MATCHES), [])

  const handlePredict = (matchId: string, choice: PredictionChoice) => {
    setPredictions((prev) => ({ ...prev, [matchId]: choice }))
    // TODO: Send to Supabase — supabase.from('predictions').upsert({ match_id, choice, user_id })
  }

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(matchesByDate).map(([date, matches]) => (
        <section key={date} className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground px-1">
            {formatDate(date)}
          </h2>
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={predictions[match.id]}
              onPredict={handlePredict}
            />
          ))}
        </section>
      ))}
    </div>
  )
}
