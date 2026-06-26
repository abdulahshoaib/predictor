import { Prediction, PredictionChoice } from "@/types/predictions";

export async function fetchPredictions() {
  const res = await fetch("/api/predictions");

  if (!res.ok) {
    throw new Error("Failed to fetch Predictions");
  }

  return res.json() as Promise<Prediction[]>;
}

export async function savePrediction(
  match_id: number,
  choice: PredictionChoice | null,
): Promise<Prediction | null> {
  const res = await fetch("/api/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      match_id,
      prediction_choice: choice,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to save prediction");
  }

  return res.json();
}
