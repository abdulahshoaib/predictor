import { useEffect, useState } from "react";
import { fetchPredictions, savePrediction } from "@/services/prediction";
import { Prediction, PredictionChoice } from "@/types/predictions";

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshPredictions() {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchPredictions();
      setPredictions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load predictions",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshPredictions();
  }, []);

  async function submitPrediction(match_id: number, choice: PredictionChoice) {
    const previousPredictions = [...predictions];

    // Optimistic update
    setPredictions((prev) => {
      const existing = prev.find((p) => p.match_id === match_id);

      if (existing) {
        return prev.map((p) =>
          p.match_id === match_id ? { ...p, prediction_choice: choice } : p,
        );
      }

      return [
        ...prev,
        {
          id: -Date.now(),
          match_id,
          prediction_choice: choice,
        } as Prediction,
      ];
    });

    try {
      const savedPrediction = await savePrediction(match_id, choice);

      setPredictions((prev) => [
        ...prev.filter((p) => p.match_id !== match_id),
        savedPrediction,
      ]);
    } catch (error) {
      setPredictions(previousPredictions);

      setError(error instanceof Error ? error.message : "Failed to Predict");
    }
  }

  return {
    predictions,
    loading,
    submitPrediction,
    error,
  };
}
