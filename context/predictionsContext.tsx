"use client";

import { createContext, useContext, ReactNode } from "react";
import { usePredictions } from "@/hooks/usePredictions";

type PredictionsContextType = ReturnType<typeof usePredictions>;

const PredictionsContext = createContext<PredictionsContextType | null>(null);

export function PredictionsProvider({ children }: { children: ReactNode }) {
  const predictionData = usePredictions();

  return (
    <PredictionsContext.Provider value={predictionData}>
      {children}
    </PredictionsContext.Provider>
  );
}

export function usePredictionsContext() {
  const context = useContext(PredictionsContext);

  if (!context) {
    throw new Error(
      "usePredictionsContext must be used within PredictionsProvider",
    );
  }

  return context;
}
