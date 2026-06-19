import React from "react";
import type { Match, MatchStatus } from "./types";
import {
  Dz,
  Ar,
  Au,
  At,
  Be,
  Br,
  Cm,
  Ca,
  Cl,
  Co,
  Cr,
  Hr,
  Dk,
  Ec,
  Eg,
  Gb,
  Fr,
  De,
  Gh,
  Gr,
  Hu,
  Ir,
  Iq,
  It,
  Ci,
  Jp,
  Mx,
  Ma,
  Nl,
  Nz,
  Ng,
  Py,
  Pe,
  Pl,
  Pt,
  Qa,
  Ro,
  Ru,
  Sa,
  Sn,
  Rs,
  Za,
  Kr,
  Es,
  Se,
  Ch,
  Tn,
  Tr,
  Ua,
  Us,
  Uy,
  GbSct,
  GbWls,
  No,
  Cz,
  Uz,
  Jo,
  Pa,
  Cd,
  Cv,
  Ba,
  Ht,
  Cw,
} from "react-flag-icons";

export function getTeamFlag(teamName: string): React.ReactNode {
  const name = teamName.trim().toLowerCase();

  const mapping: Record<string, React.ElementType> = {
    algeria: Dz,
    argentina: Ar,
    australia: Au,
    austria: At,
    belgium: Be,
    brazil: Br,
    cameroon: Cm,
    canada: Ca,
    chile: Cl,
    colombia: Co,
    "costa rica": Cr,
    croatia: Hr,
    denmark: Dk,
    ecuador: Ec,
    egypt: Eg,
    curaçao: Cw,
    england: Gb,
    france: Fr,
    germany: De,
    ghana: Gh,
    greece: Gr,
    hungary: Hu,
    iran: Ir,
    iraq: Iq,
    italy: It,
    "ivory coast": Ci,
    japan: Jp,
    mexico: Mx,
    morocco: Ma,
    netherlands: Nl,
    "new zealand": Nz,
    nigeria: Ng,
    paraguay: Py,
    peru: Pe,
    poland: Pl,
    portugal: Pt,
    qatar: Qa,
    romania: Ro,
    russia: Ru,
    "saudi arabia": Sa,
    scotland: GbSct,
    senegal: Sn,
    serbia: Rs,
    "south africa": Za,
    "south korea": Kr,
    spain: Es,
    sweden: Se,
    switzerland: Ch,
    tunisia: Tn,
    turkey: Tr,
    türkiye: Tr,
    norway: No,
    "czech republic": Cz,
    uzbekistan: Uz,
    ukraine: Ua,
    "united states": Us,
    panama: Pa,
    jordan: Jo,
    "dr congo": Cd,
    "cabo verde": Cv,
    haiti: Ht,
    "bosnia and herzegovina": Ba,
    usa: Us,
    uruguay: Uy,
  };

  const FlagComponent = mapping[name];

  if (!FlagComponent) {
    return null; // Returns nothing if the team is not found
  }

  return <FlagComponent />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDbMatchToMatch(dbMatch: any): Match {
  // Extract date component from 'time'
  let matchDate = "TBD";
  if (dbMatch.time) {
    const parts = dbMatch.time.split(/[T ]/);
    if (parts[0]) {
      matchDate = parts[0];
    }
  } else if (dbMatch.date) {
    matchDate = dbMatch.date;
  }

  // Normalize status values to MatchStatus
  let status: MatchStatus = "upcoming";
  const rawStatus = String(dbMatch.status || "").toLowerCase();
  if (rawStatus === "ongoing") {
    status = "live";
  } else if (rawStatus === "completed") {
    status = "finished";
  }

  // Auto-move/force status to 'live' if time has passed
  if (status === "upcoming" && dbMatch.time) {
    try {
      const matchTime = new Date(dbMatch.time).getTime();
      if (!isNaN(matchTime) && matchTime < Date.now()) {
        status = "live";
      }
    } catch {
      // ignore parsing error
    }
  }

  return {
    id: String(dbMatch.id),
    team_home: dbMatch.home_team || "TBD",
    team_away: dbMatch.away_team || "TBD",
    flag_home: getTeamFlag(dbMatch.home_team || ""),
    flag_away: getTeamFlag(dbMatch.away_team || ""),
    match_date: matchDate,
    time: dbMatch.time || null,
    stadium: dbMatch.stadium || null,
    status,
    stage: dbMatch.stage || null,
    group: dbMatch.group_name || undefined,
    winner: dbMatch.winner || dbMatch.result || null,
    score_line: dbMatch.score_line || null,
  };
}
