import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { NavBar } from "@/components/predictions/nav-bar";
import { MatchList } from "@/components/predictions/match-list";
import { mapDbMatchToMatch } from "@/lib/flags";

import type { Match, PredictionChoice } from "@/lib/types";

async function PredictionsContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const userId = data.claims.sub as string;
  const username = data.claims.user_metadata?.username as string;

  // Fetch matches from Supabase DB
  const { data: dbMatches, error: matchesError } = await supabase
    .from("matches")
    .select("*")
    .order("time", { ascending: true });

  console.log(JSON.stringify(dbMatches, null, 2));

  let matches: Match[] = [];
  if (dbMatches && dbMatches.length > 0) {
    matches = dbMatches.map(mapDbMatchToMatch);
  } else {
    if (matchesError) {
      // eslint-disable-next-line no-console
      console.error(
        "Error fetching matches from Supabase:",
        matchesError.message,
      );
    }
  }

  const { data: predictionsData } = await supabase
    .from("predictions")
    .select("match_id, choice")
    .eq("user_id", userId);

  const initialPredictions: Record<string, PredictionChoice> = {};
  if (predictionsData) {
    predictionsData.forEach((p) => {
      initialPredictions[String(p.match_id)] = p.choice as PredictionChoice;
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar userIdentifier={username} />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-2xl font-bold mb-6">Match Predictions</h1>
        <MatchList
          userId={userId}
          initialPredictions={initialPredictions}
          matches={matches}
        />
      </main>
    </div>
  );
}

export default function PredictionsPage() {
  return (
    <Suspense fallback={null}>
      <PredictionsContent />
    </Suspense>
  );
}
