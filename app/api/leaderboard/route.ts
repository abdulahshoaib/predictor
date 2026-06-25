import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Leaderboard } from "@/types/leaderboard";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: claims, error: authError } = await supabase.auth.getClaims();

    if (authError || !claims?.claims) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from("leaderboard").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const leaderboard: Leaderboard = {
      entries:
        data?.map((entry) => ({
          rank: entry.rank,
          user_id: entry.user_id,
          user_name: entry.username,
          total_points: Number(entry.total_points),
          correct_predictions: entry.correct_predictions,
          total_predictions: entry.total_predictions,
        })) ?? [],
    };

    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      { status: 500 },
    );
  }
}
