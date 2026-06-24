"use client";

import { ReactNode } from "react";
import { MatchProvider } from "@/context/matchContext";
import { LeaderboardProvider } from "@/context/leaderboardContext";
import { PredictionsProvider } from "@/context/predictionsContext";
import { UserProvider } from "@/context/userContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <MatchProvider>
        <LeaderboardProvider>
          <PredictionsProvider>{children}</PredictionsProvider>
        </LeaderboardProvider>
      </MatchProvider>
    </UserProvider>
  );
}
