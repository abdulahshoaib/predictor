import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/server";

export async function GET() {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const { supabase, user } = await requireUser();

  const body = await request.json();
  const updates: Record<string, string> = {};

  if (body.user_name !== undefined) {
    const trimmed = String(body.user_name).trim().toLowerCase();

    if (trimmed.length < 2 || trimmed.length > 24) {
      return NextResponse.json(
        { error: "Username must be 2–24 characters" },
        { status: 400 },
      );
    }

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("user_name", trimmed)
      .neq("id", user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    updates.user_name = trimmed;
  }

  if (body.avatar_url !== undefined) {
    updates.avatar_url = body.avatar_url;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
