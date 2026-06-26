import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Match } from "@/types/matches";

export async function GET() {
  const supabase = await createClient();

  const { data: claims, error: authError } = await supabase.auth.getClaims();

  if (authError || !claims?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: matches, error } = await supabase
    .from("matches")
    .select("*")
    .order("time", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = Date.now();

  const upcoming =
    matches.filter((m: Match) => m.status === "scheduled" && new Date(m.time).getTime() > now) ?? [];

  const fulltime =
    matches.filter((m: Match) => m.status === "completed" || m.status === "ongoing") ?? [];

  return NextResponse.json({
    upcoming: upcoming,
    predicted: fulltime,
  });
}
