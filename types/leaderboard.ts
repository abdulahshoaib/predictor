export type Leaderboard = {
  entries: LeaderboardEntry[];
};

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  user_name: string;
  avatar_url: string | null;
  total_points: number;
  total_predictions: number;
  total_correct: number;
  accuracy_percentage: number | null;
}
