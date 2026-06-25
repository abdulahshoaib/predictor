import { Suspense } from "react";
import { PredictionsTabs } from "@/components/predictions/predictions-tabs";

async function PredictionsContent() {
  return (
    <main>
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
