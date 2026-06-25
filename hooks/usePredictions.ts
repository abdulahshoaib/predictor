import { useEffect, useState } from "react";
import { fetchPredictions, savePrediction } from "@/services/prediction";
import { Prediction, PredictionChoice } from "@/types/predictions";
import { createClient } from "@/lib/supabase/client";

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [allPredictions, setAllPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshPredictions() {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchPredictions();
      setPredictions(data);
      setAllPredictions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load predictions",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("predictions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "predictions",
        },
        async () => {
          const latest = await fetchPredictions();
          setAllPredictions(latest);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
      await savePrediction(match_id, choice);

      const data = await fetchPredictions();
      setPredictions(data);
      setAllPredictions(data);
    } catch (error) {
      setPredictions(previousPredictions);

      setError(error instanceof Error ? error.message : "Failed to Predict");
    }
  }

  return {
    predictions,
    allPredictions,
    loading,
    submitPrediction,
    error,
  };
}
