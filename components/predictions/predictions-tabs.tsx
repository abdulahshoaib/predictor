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
    <Tabs defaultValue="upcoming" className="flex flex-col gap-8 w-full">
      {/* Centered pill-shaped switch */}
      <div className="flex w-full justify-center">
        <TabsList className="grid w-full max-w-md grid-cols-2 rounded-full border border-border/50 bg-muted/30 p-1">
          <TabsTrigger
            value="upcoming"
            className="rounded-full transition-all data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger
            value="my-predictions"
            className="rounded-full transition-all data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Predicted
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="upcoming"
        className="mt-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <MatchList
          matches={upcomingMatches}
          predictions={predictions}
          onPredict={handlePredict}
          loading={loading}
        />
      </TabsContent>

      <TabsContent
        value="my-predictions"
        className="mt-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <PredictionList
          matches={fullTimeMatches}
          userPredictions={predictions}
          loading={loading}
        />
      </TabsContent>
    </Tabs>
  );
}
