"use client";

import { createContext, useContext, ReactNode } from "react";
import { useLeaderboard } from "@/hooks/useLeaderboard";

type LeaderboardContextType = ReturnType<typeof useLeaderboard>;

const LeaderboardContext = createContext<LeaderboardContextType | null>(null);

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const leaderboardData = useLeaderboard();

  return (
    <LeaderboardContext.Provider value={leaderboardData}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboardContext() {
  const context = useContext(LeaderboardContext);

  if (!context) {
    throw new Error(
      "useLeaderboardContext must be used within LeaderboardProvider",
    );
  }

  return context;
}
