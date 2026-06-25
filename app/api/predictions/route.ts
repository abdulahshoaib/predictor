import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data: predictions, error } = await supabase
    .from("prediction_details")
    .select("id, created_at, match_id, user_id, status, prediction_choice, points_earned, username as user_name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(predictions);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: claims, error: authError } = await supabase.auth.getClaims();

  if (authError || !claims?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user_id = claims.claims.sub as string;

  const { match_id, prediction_choice } = await request.json();

  try {
    await supabase.from("predictions").upsert(
      {
        user_id: user_id,
        match_id,
        prediction_choice,
      },
      {
        onConflict: "user_id,match_id",
      },
    );

    const { data, error } = await supabase
      .from("prediction_details")
      .select("id, created_at, match_id, user_id, status, prediction_choice, points_earned, username as user_name")
      .eq("user_id", user_id)
      .eq("match_id", match_id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
  }
}
