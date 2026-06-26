"use client";

import { useGroupStandingsContext } from "@/context/groupstandingsContext";
import Skeleton from "react-loading-skeleton";
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
import { ThirdPlacedTable } from "@/components/groupstandings/third-placed-table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TeamDialog } from "@/components/groupstandings/team-details";
import { Button } from "@/components/ui/button";

function GroupTable({
  groupName,
  entries,
}: {
  groupName: string;
  entries: GroupStandings[];
}) {
  return (
    <div className="rounded-md border">
      <div className="border-b px-4 py-3 font-semibold">Group {groupName}</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 text-center">#</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">Pld</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">GF</TableHead>
            <TableHead className="text-center">GA</TableHead>
            <TableHead className="text-center">GD</TableHead>
            <TableHead className="text-center">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.team}
              data-qualified={entry.qualified || undefined}
              className={cn(
                entry.qualified &&
                "border-l-2 border-l-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20",
              )}
            >
              <TableCell className="text-center text-muted-foreground">
                {entry.position}
              </TableCell>

              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-foreground">
                      <span className="flex h-5 w-5 items-center justify-center">
                        {getTeamFlag(entry.team)}
                      </span>
                      <span>{entry.team}</span>
                    </Button>
                  </DialogTrigger>

                  <TeamDialog team={entry.team} />
                </Dialog>
              </TableCell>

              <TableCell className="text-center">{entry.played}</TableCell>
              <TableCell className="text-center">{entry.wins}</TableCell>
              <TableCell className="text-center">{entry.draws}</TableCell>
              <TableCell className="text-center">{entry.losses}</TableCell>
              <TableCell className="text-center">{entry.gf}</TableCell>
              <TableCell className="text-center">{entry.ga}</TableCell>
              <TableCell
                className={cn(
                  "text-center font-medium",
                  entry.gd > 0 && "text-emerald-600",
                  entry.gd < 0 && "text-red-500",
                )}
              >
                {entry.gd > 0 ? "+" : ""}
                {entry.gd}
              </TableCell>
              <TableCell className="text-center font-bold">
                {entry.points}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function GroupStandingsPage() {
  const { groupStandings, loading, error } = useGroupStandingsContext();

  if (error) return <div className="text-red-500">{error}</div>;

  if (loading) {
    return (
      <main>
        <h1 className="mb-6 text-2xl font-bold">Group Standings</h1>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 space-y-6">
            {Array.from({ length: 3 }).map((_, gIdx) => (
              <div key={gIdx} className="rounded-md border">
                <div className="border-b px-4 py-3 font-semibold"><Skeleton width={80} /></div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8 text-center"><Skeleton width={15} /></TableHead>
                      <TableHead><Skeleton width={40} /></TableHead>
                      <TableHead className="text-center"><Skeleton width={20} /></TableHead>
                      <TableHead className="text-center"><Skeleton width={20} /></TableHead>
                      <TableHead className="text-center"><Skeleton width={20} /></TableHead>
                      <TableHead className="text-center"><Skeleton width={20} /></TableHead>
                      <TableHead className="text-center"><Skeleton width={20} /></TableHead>
                      <TableHead className="text-center"><Skeleton width={20} /></TableHead>
                      <TableHead className="text-center"><Skeleton width={20} /></TableHead>
                      <TableHead className="text-center"><Skeleton width={20} /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 4 }).map((_, tIdx) => (
                      <TableRow key={tIdx}>
                        <TableCell className="text-center"><Skeleton width={10} /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton circle width={20} height={20} />
                            <Skeleton width={80} />
                          </div>
                        </TableCell>
                        <TableCell className="text-center"><Skeleton width={15} /></TableCell>
                        <TableCell className="text-center"><Skeleton width={15} /></TableCell>
                        <TableCell className="text-center"><Skeleton width={15} /></TableCell>
                        <TableCell className="text-center"><Skeleton width={15} /></TableCell>
                        <TableCell className="text-center"><Skeleton width={15} /></TableCell>
                        <TableCell className="text-center"><Skeleton width={15} /></TableCell>
                        <TableCell className="text-center"><Skeleton width={15} /></TableCell>
                        <TableCell className="text-center"><Skeleton width={15} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
          <div className="w-full shrink-0 lg:w-56">
            <Skeleton height={400} />
          </div>
        </div>
      </main>
    );
  }

  const grouped = groupStandings.reduce<Record<string, GroupStandings[]>>(
    (acc, item) => {
      if (!acc[item.group_name]) acc[item.group_name] = [];
      acc[item.group_name].push(item);
      return acc;
    },
    {},
  );

  const sortedGroups = Object.entries(grouped).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <main>
      <h1 className="mb-6 text-2xl font-bold">Group Standings</h1>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-6">
          {sortedGroups.map(([groupName, entries]) => (
            <GroupTable
              key={groupName}
              groupName={groupName}
              entries={entries.sort((a, b) => a.position - b.position)}
            />
          ))}
        </div>
        <div className="w-full shrink-0 lg:w-56">
          <ThirdPlacedTable allTeams={groupStandings} />
        </div>
      </div>
    </main>
  );
}
