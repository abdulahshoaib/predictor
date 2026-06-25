"use client";

import { createContext, useContext, ReactNode } from "react";
import { useGroupStandings } from "@/hooks/useGroupStandings";

type GroupStandingsContextType = ReturnType<typeof useGroupStandings>;

const GroupStandingsContext = createContext<GroupStandingsContextType | null>(
  null,
);

export function GroupStandingsProvider({ children }: { children: ReactNode }) {
  const groupStandingsData = useGroupStandings();

  return (
    <GroupStandingsContext.Provider value={groupStandingsData}>
      {children}
    </GroupStandingsContext.Provider>
  );
}

export function useGroupStandingsContext() {
  const context = useContext(GroupStandingsContext);

  if (!context) {
    throw new Error(
      "useGroupStandingsContext must be used within GroupStandingsProvider",
    );
  }

  return context;
}
