"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getTeamFlag } from "@/lib/flags";
import { GroupStandings } from "@/types/group_standing";

export function ThirdPlacedTable({ allTeams }: { allTeams: GroupStandings[] }) {
  const thirdPlaced = allTeams
    .filter((t) => t.position === 3)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });

  return (
    <div className="rounded-md border">
      <div className="border-b px-4 py-3 font-semibold">
        3<sup>rd</sup> Place Teams
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 text-center">#</TableHead>
            <TableHead>Team</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {thirdPlaced.map((entry, idx) => {
            const qualifies = idx < 8;
            return (
              <TableRow
                key={entry.team}
                className={cn(
                  qualifies &&
                    "border-l-[3px] border-l-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20",
                )}
              >
                <TableCell className="text-center font-medium">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center">
                      {getTeamFlag(entry.team)}
                    </span>
                    <span>
                      {entry.team.replace("Bosnia and Herzegovina", "Bosnia")}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
