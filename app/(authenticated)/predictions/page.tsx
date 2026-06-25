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

function LoadingSkeleton() {
  return (
    <main>
      <div className="mb-6 h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-md border bg-muted"
          />
        ))}
      </div>
    </main>
  );
}

export default function PredictionsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PredictionsContent />
    </Suspense>
  );
}
