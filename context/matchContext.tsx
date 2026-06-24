"use client";

import { createContext, useContext, ReactNode } from "react";
import { useMatches } from "@/hooks/useMatches";

type MatchContextType = ReturnType<typeof useMatches>;

const MatchContext = createContext<MatchContextType | null>(null);

export function MatchProvider({ children }: { children: ReactNode }) {
  const matchData = useMatches();

  return (
    <MatchContext.Provider value={matchData}>{children}</MatchContext.Provider>
  );
}

export function useMatchContext() {
  const context = useContext(MatchContext);

  if (!context) {
    throw new Error("useMatchContext must be used within MatchProvider");
  }

  return context;
}
