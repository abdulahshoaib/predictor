"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth-provider";
import { useAuthFetch } from "@/lib/hooks/use-auth-fetch";
import { mapDbMatchToMatch } from "@/lib/flags";
import type { Match, PredictionChoice } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

interface PredictionsContextValue {
  upcomingMatches: Match[];
  fullTimeMatches: Match[];
  predictions: Record<string, PredictionChoice>;
  loading: boolean;
  handlePredict: (matchId: string, choice: PredictionChoice) => Promise<void>;
  refresh: () => Promise<void>;
}

const PredictionsContext = createContext<PredictionsContextValue | null>(null);

export function PredictionsProvider({ children }: { children: React.ReactNode }) {
  const { jwt, userId, loading: authLoading } = useAuth();
  const authFetch = useAuthFetch();

  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [fullTimeMatches, setFullTimeMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<string, PredictionChoice>>({});
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const load = useCallback(async (force = false) => {
    if (authLoading) return;
    if (!jwt) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const pRes = await authFetch(`${API}/predict`);
      const predsData = pRes.ok ? await pRes.json() : [];

      let predsList: any[] = [];
      if (Array.isArray(predsData)) {
        predsList = predsData;
      } else if (predsData && typeof predsData === "object") {
        predsList =
          predsData.predictions || predsData.data || predsData.results || [];
      }

      const lookup: Record<string, PredictionChoice> = {};
      for (const p of predsList) {
        const matchId = p?.match_id || p?.matchId;
        const choice = p?.choice || p?.prediction_choice;
        if (matchId && choice) {
          lookup[String(matchId)] = choice as PredictionChoice;
        }
      }
      setPredictions(lookup);

      const mRes = await authFetch(`${API}/matches`);
      if (mRes.ok) {
        const { upcoming = [], full_time = [] } = await mRes.json();

        const mappedUpcoming = upcoming.map(mapDbMatchToMatch);
        const mappedFullTime = full_time.map(mapDbMatchToMatch);

        // Combine and de-duplicate matches to safely partition by status
        const allMatches = [...mappedUpcoming, ...mappedFullTime];
        const uniqueMatchesMap = new Map<string, Match>();
        allMatches.forEach((m) => {
          uniqueMatchesMap.set(m.id, m);
        });
        const uniqueMatches = Array.from(uniqueMatchesMap.values());

        const finalUpcoming = uniqueMatches.filter((m) => m.status === "upcoming");
        const finalFullTime = uniqueMatches.filter(
          (m) => m.status === "finished" || m.status === "live"
        );

        setUpcomingMatches(finalUpcoming);
        setFullTimeMatches(finalFullTime);
      }
      setHasLoaded(true);
    } catch (err) {
      console.error("Failed to load match predictions:", err);
    } finally {
      setLoading(false);
    }
  }, [jwt, authLoading, authFetch]);

  useEffect(() => {
    if (authLoading) return;
    if (!jwt) {
      setLoading(false);
      return;
    }

    // Only load if we haven't loaded yet
    if (!hasLoaded) {
      load();
    }
  }, [jwt, authLoading, hasLoaded, load]);

  // Clear data if the user logs out
  useEffect(() => {
    if (!authLoading && !jwt) {
      setUpcomingMatches([]);
      setFullTimeMatches([]);
      setPredictions({});
      setHasLoaded(false);
    }
  }, [jwt, authLoading]);

  const handlePredict = async (matchId: string, choice: PredictionChoice) => {
    setPredictions((prev) => ({ ...prev, [matchId]: choice }));

    try {
      const res = await authFetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_id: parseInt(matchId, 10),
          user_id: userId,
          prediction_choice: choice,
        }),
      });
      if (!res.ok) throw new Error("Failed to save prediction");
    } catch (err) {
      console.error("Failed to save prediction:", err);
    }
  };

  const refresh = useCallback(async () => {
    await load(true);
  }, [load]);

  return (
    <PredictionsContext.Provider
      value={{
        upcomingMatches,
        fullTimeMatches,
        predictions,
        loading,
        handlePredict,
        refresh,
      }}
    >
      {children}
    </PredictionsContext.Provider>
  );
}

export function usePredictions() {
  const context = useContext(PredictionsContext);
  if (!context) {
    throw new Error("usePredictions must be used within a PredictionsProvider");
  }
  return context;
}
