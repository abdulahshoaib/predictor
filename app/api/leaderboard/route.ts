import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Leaderboard } from "@/types/leaderboard";

export async function GET() {
  const supabase = await createClient();

  const { data: claims, error: authError } = await supabase.auth.getClaims();

  if (authError || !claims?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("rank");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const leaderboard: Leaderboard = {
    entries:
      data?.map((entry) => ({
        rank: entry.rank,
        user_id: entry.user_id,
        user_name: entry.user_name,
        total_score: Number(entry.total_score),
        correct_predictions: entry.correct_predictions,
        total_predictions: entry.total_predictions,
      })) ?? [],
  };

  return NextResponse.json(leaderboard);
}
