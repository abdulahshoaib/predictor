"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PredictionsTabs } from "@/components/predictions/predictions-tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PredictionsPageClient() {
  const [showBar, setShowBar] = useState(true);

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Match Predictions</h1>
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
      <PredictionsTabs showBar={showBar} />
    </>
  );
}
