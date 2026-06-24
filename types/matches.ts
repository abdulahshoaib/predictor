export type MatchStatus = "upcoming" | "live" | "finished";

export interface Match {
  id: number;
  home_team: string;
  away_team: string;
  time: string;
  stadium: string | null;
  status: MatchStatus;
  stage: string | null;
  group_name: string;
  winner: string | null;
  score_line: string | null;

  /*
   * Get Each Country flag
   */
  flag_home: React.ReactNode;
  flag_away: React.ReactNode;
}
