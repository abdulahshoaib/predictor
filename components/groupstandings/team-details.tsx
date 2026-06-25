"use client";
import { useMatchContext } from "@/context/matchContext";
import { DialogHeader, DialogTitle } from "../ui/dialog";

interface TeamDialogProps {
  team: string;
}

export function TeamDialog({ team }: TeamDialogProps) {
  const { upcoming, fulltime } = useMatchContext();

  const team_upcoming = upcoming.filter(
    (match) => match.home_team === team || match.away_team === team,
  );

  const team_fulltime = fulltime.filter(
    (match) => match.home_team === team || match.away_team === team,
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle> {team} </DialogTitle>
      </DialogHeader>
    </>
  );
}
