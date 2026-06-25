"use client";

import { ReactNode } from "react";
import { MatchProvider } from "@/context/matchContext";
import { LeaderboardProvider } from "@/context/leaderboardContext";
import { PredictionsProvider } from "@/context/predictionsContext";
import { UserProvider } from "@/context/userContext";
import { GroupStandingsProvider } from "@/context/groupstandingsContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <MatchProvider>
        <LeaderboardProvider>
          <GroupStandingsProvider>
            <PredictionsProvider>{children}</PredictionsProvider>
          </GroupStandingsProvider>
        </LeaderboardProvider>
      </MatchProvider>
    </UserProvider>
  );
}
