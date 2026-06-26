"use client";

import { useState } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PredictionsTabs } from "@/components/predictions/predictions-tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMatchContext } from "@/context/matchContext";
import { usePredictionsContext } from "@/context/predictionsContext";

export function PredictionsPageClient() {
  const [showBar, setShowBar] = useState(true);
  const { refreshMatches } = useMatchContext();
  const { refreshPredictions } = usePredictionsContext();

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Match Predictions</h1>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    refreshMatches();
                    refreshPredictions();
                  }}
                >
                  <RefreshCw className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh data</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowBar((v) => !v)}
                >
                  {showBar ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeOff className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showBar ? "Hide prediction bar" : "Show prediction bar"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <PredictionsTabs showBar={showBar} />
    </>
  );
}
