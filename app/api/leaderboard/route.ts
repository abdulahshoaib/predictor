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

    const userIds = data?.map((e) => e.user_id) ?? [];

    const { data: users } = await supabase
      .from("users")
      .select("id, avatar_url")
      .in("id", userIds);

    const avatarMap = new Map(
      users?.map((u) => [u.id, u.avatar_url]) ?? [],
    );

    const leaderboard: Leaderboard = {
      entries:
        data?.map((entry) => ({
          rank: entry.rank,
          user_id: entry.user_id,
          user_name: entry.username,
          avatar_url: avatarMap.get(entry.user_id) ?? null,
          total_points: Number(entry.total_points),
          total_predictions: entry.total_predictions,
          total_correct: entry.total_correct,
          accuracy_percentage: entry.accuracy_percentage,
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
