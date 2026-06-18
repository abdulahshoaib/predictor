import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data: claims, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !claims?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = claims.claims.sub as string;

  const { data: predictions, error } = await supabase
    .from("predictions")
    .select("match_id, choice")
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(predictions ?? []);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: claims, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !claims?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = claims.claims.sub as string;
  const body = await request.json();
  const { match_id, choice } = body;

  if (!match_id || !choice) {
    return NextResponse.json(
      { error: "match_id and choice are required" },
      { status: 400 },
    );
  }

  // Upsert: update if exists, insert if not
  const { data: existing } = await supabase
    .from("predictions")
    .select("id")
    .eq("user_id", userId)
    .eq("match_id", match_id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("predictions")
      .update({ choice })
      .eq("id", existing.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await supabase
      .from("predictions")
      .insert({ user_id: userId, match_id, choice });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
