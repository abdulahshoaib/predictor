import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data: claims, error: authError } =
    await supabase.auth.getClaims();

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

  return NextResponse.json(matches ?? []);
}
