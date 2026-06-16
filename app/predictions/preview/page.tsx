import { NavBar } from "@/components/predictions/nav-bar";
import { MatchList } from "@/components/predictions/match-list";
import { createClient } from "@supabase/supabase-js";
import { mapDbMatchToMatch } from "@/lib/flags";
import type { Match } from "@/lib/types";
import { Suspense } from "react";

async function PredictionsPreviewContent() {
  let matches: Match[] = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
    const { data: dbMatches } = await supabase
      .from("matches")
      .select("*")
      .order("time", { ascending: true });

    if (dbMatches && dbMatches.length > 0) {
      matches = dbMatches.map(mapDbMatchToMatch);
    }
  } catch (e) {
    console.error("Error fetching matches in preview page:", e);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar userIdentifier="preview@demo.com" />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-2xl font-bold mb-6">Match Predictions</h1>
        <MatchList
          userId="preview-user"
          initialPredictions={{}}
          matches={matches}
        />
      </main>
    </div>
  );
}

export default function PredictionsPreview() {
  return (
    <Suspense fallback={null}>
      <PredictionsPreviewContent />
    </Suspense>
  );
}
