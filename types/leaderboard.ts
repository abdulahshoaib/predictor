export type Leaderboard = {
  entries: LeaderboardEntry[];
};

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  user_name: string;
  total_score: number;
  correct_predictions: number;
  total_predictions: number;
}
