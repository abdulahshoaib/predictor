export type PredictionChoice = 'home' | 'draw' | 'away'

export type MatchStatus = 'upcoming' | 'live' | 'finished'

export interface Match {
  id: string
  team_home: string
  team_away: string
  flag_home: string
  flag_away: string
  match_date: string
  status: MatchStatus
  group?: string
}

export interface Prediction {
  match_id: string
  choice: PredictionChoice
}

export interface LeaderboardEntry {
  rank: number
  user_id: string
  display_name: string
  total_score: number
  correct_predictions: number
  total_predictions: number
}
