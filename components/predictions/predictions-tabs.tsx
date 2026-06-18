"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchList } from "./match-list";
import PredictionList from "./prediction-list";
import { mapDbMatchToMatch } from "@/lib/flags";
import type { Match, PredictionChoice } from "@/lib/types";
import { useAuth } from "@/components/auth-provider";
import { useAuthFetch } from "@/lib/hooks/use-auth-fetch";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

export function PredictionsTabs() {
  const { jwt, userId, loading: authLoading } = useAuth();
  const authFetch = useAuthFetch();

  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [fullTimeMatches, setFullTimeMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<
    Record<string, PredictionChoice>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!jwt) {
      setLoading(false);
      return;
    }

    async function load() {
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

          setUpcomingMatches(mappedUpcoming);
          setFullTimeMatches(mappedFullTime);
        }
      } catch (err) {
        console.error("Failed to load match predictions:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [jwt, authLoading, authFetch]);

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

  return (
    <Tabs defaultValue="upcoming" className="flex flex-col gap-6">
      <TabsList variant="line" className="w-full">
        <TabsTrigger value="upcoming" className="flex-1 gap-2">
          Upcoming Matches
        </TabsTrigger>
        <TabsTrigger value="my-predictions" className="flex-1 gap-2">
          My Predictions
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        <MatchList
          matches={upcomingMatches}
          predictions={predictions}
          onPredict={handlePredict}
          loading={loading}
        />
      </TabsContent>
      <TabsContent value="my-predictions">
        <PredictionList
          matches={fullTimeMatches}
          userPredictions={predictions}
          loading={loading}
        />
      </TabsContent>
    </Tabs>
  );
}
