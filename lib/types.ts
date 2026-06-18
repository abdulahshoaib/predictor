export type PredictionChoice = "home" | "draw" | "away";

export type MatchStatus = "upcoming" | "live" | "finished";

export interface Match {
  id: string;
  team_home: string;
  team_away: string;
  flag_home: string;
  flag_away: string;
  match_date: string;
  time?: string | null;
  stadium?: string | null;
  status: MatchStatus;
  stage?: string | null;
  group?: string;
  winner?: string | null;
  score_line?: string | null;
}

export interface Prediction {
  id: string;
  created_at: string;
  match_id: number;
  user_id: string;
  choice: PredictionChoice;
  result: number | null;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  total_score: number;
  correct_predictions: number;
  total_predictions: number;
}
