export type PredictionChoice = "home" | "draw" | "away";
export type PredictionStatus = "correct" | "incorrect" | null;

export interface Prediction {
  id: number;
  match_id: number;
  prediction_choice: PredictionChoice;
  user_name: string;
  created_at?: string;
  user_id?: string;
  status?: PredictionStatus;
  points_earned?: number | null;
  result?: number | null;
}
