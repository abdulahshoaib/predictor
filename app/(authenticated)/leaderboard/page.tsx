"use client";

import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useUserContext } from "@/context/userContext";
import { useLeaderboardContext } from "@/context/leaderboardContext";
import { Button } from "@/components/ui/button";
import Skeleton from "react-loading-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function leaderboardPage() {
  const { user } = useUserContext();
  const { leaderboard, loading, error, refetch } = useLeaderboardContext();

  if (loading) {
    return (
      <main>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <Button variant="outline" size="icon" onClick={refetch}>
            <RefreshCw className="size-4" />
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center cursor-pointer select-none transition-colors text-muted-foreground">
                #<span className="inline-flex flex-col leading-none ml-1 -mb-0.5">
                  <ChevronUp className="size-3 text-muted-foreground/30" />
                  <ChevronDown className="size-3 -mt-1 text-muted-foreground/30" />
                </span>
              </TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Correct</TableHead>
              <TableHead className="text-right cursor-pointer select-none transition-colors text-muted-foreground">
                Accuracy<span className="inline-flex flex-col leading-none ml-1 -mb-0.5">
                  <ChevronUp className="size-3 text-muted-foreground/30" />
                  <ChevronDown className="size-3 -mt-1 text-muted-foreground/30" />
                </span>
              </TableHead>
              <TableHead className="text-right cursor-pointer select-none transition-colors text-muted-foreground">
                Points<span className="inline-flex flex-col leading-none ml-1 -mb-0.5">
                  <ChevronUp className="size-3 text-muted-foreground/30" />
                  <ChevronDown className="size-3 -mt-1 text-muted-foreground/30" />
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="text-center"><Skeleton width={20} height={20} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton circle width={40} height={40} />
                    <Skeleton width={120} height={20} />
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground"><Skeleton width={40} /></TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground"><Skeleton width={40} /></TableCell>
                <TableCell className="text-right font-medium tabular-nums"><Skeleton width={30} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    );
  }

  if (error) return <div>{error}</div>;
  if (!user) return <div>No user</div>;
  if (!leaderboard) return <div>No leaderboard data</div>;

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <Button variant="outline" size="icon" onClick={refetch}>
          <RefreshCw className="size-4" />
        </Button>
      </div>
      <LeaderboardTable
        entries={leaderboard.entries}
        user_name={user.user_name}
      />
    </main>
  );
}
