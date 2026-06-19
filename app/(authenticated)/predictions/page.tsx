import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { PredictionsTabs } from "@/components/predictions/predictions-tabs";

async function PredictionsContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <h1 className="text-2xl font-bold mb-6">Match Predictions</h1>
      <PredictionsTabs />
    </main>
  );
}

export default function PredictionsPage() {
  return (
    <Suspense fallback={null}>
      <PredictionsContent />
    </Suspense>
  );
}
