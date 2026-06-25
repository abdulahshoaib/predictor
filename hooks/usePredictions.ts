"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchPredictions, savePrediction } from "@/services/prediction";
import { Prediction, PredictionChoice } from "@/types/predictions";
import { createClient } from "@/lib/supabase/client";

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingMatchId, setSubmittingMatchId] = useState<number | null>(
    null,
  );
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
      toast.error("Failed to load predictions");
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
          try {
            const latest = await fetchPredictions();
            setPredictions(latest);
          } catch {
            // fetchPredictions failure on real-time sync is non-critical
          }
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
    setSubmittingMatchId(match_id);

    try {
      await savePrediction(match_id, choice);

      const data = await fetchPredictions();
      setPredictions(data);
      toast.success("Prediction saved");
    } catch (error) {
      toast.error("Failed to save prediction");

      setError(error instanceof Error ? error.message : "Failed to Predict");
    } finally {
      setSubmittingMatchId(null);
    }
  }

  return {
    predictions,
    loading,
    submittingMatchId,
    submitPrediction,
    error,
  };
}
