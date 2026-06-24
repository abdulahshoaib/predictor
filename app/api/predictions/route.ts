import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data: predictions, error } = await supabase
    .from("prediction_details")
    .select("*");

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

  const userId = claims.claims.sub as string;

  const { match_id, prediction_choice } = await request.json();

  const { data, error } = await supabase
    .from("predictions")
    .upsert(
      {
        user_id: userId,
        match_id,
        prediction_choice,
      },
      {
        onConflict: "user_id,match_id",
      },
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
