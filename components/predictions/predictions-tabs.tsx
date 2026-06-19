"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchList } from "./match-list";
import PredictionList from "./prediction-list";
import { usePredictions } from "./predictions-provider";

export function PredictionsTabs() {
  const {
    upcomingMatches,
    fullTimeMatches,
    predictions,
    loading,
    handlePredict,
  } = usePredictions();

  return (
    <Tabs defaultValue="upcoming" className="flex flex-col gap-8 w-full">
      {/* Centered pill-shaped switch */}
      <div className="flex w-full justify-center">
        <TabsList className="grid w-full max-w-md grid-cols-2 rounded-full border border-border/50 bg-muted/30 p-1">
          <TabsTrigger
            value="upcoming"
            className="rounded-full transition-all data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger
            value="my-predictions"
            className="rounded-full transition-all data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Predicted
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="upcoming"
        className="mt-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <MatchList
          matches={upcomingMatches}
          predictions={predictions}
          onPredict={handlePredict}
          loading={loading}
        />
      </TabsContent>

      <TabsContent
        value="my-predictions"
        className="mt-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <PredictionList
          matches={fullTimeMatches}
          userPredictions={predictions}
          loading={loading}
        />
      </TabsContent>
    </Tabs>
  );
}
