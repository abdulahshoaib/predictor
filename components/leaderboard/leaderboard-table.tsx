import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaderboardEntry } from "@/types/leaderboard";
import { Crown } from "lucide-react";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  user_name: string;
}

export function LeaderboardTable({
  entries,
  user_name,
}: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <span className="text-4xl">🏆</span>
        <p className="text-sm text-muted-foreground">
          No players on the leaderboard yet.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16 text-center">#</TableHead>
          <TableHead>Player</TableHead>
          <TableHead className="text-right">Points</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {entries.map((entry) => (
          <TableRow
            key={entry.user_id}
            className={
              entry.user_name === user_name
                ? "bg-emerald-500/10 font-medium"
                : ""
            }
          >
            <TableCell className="text-center">
              {entry.rank <= 3 ? (
                <Crown
                  className={
                    entry.rank === 1
                      ? "mx-auto h-5 w-5 text-yellow-500"
                      : entry.rank === 2
                        ? "mx-auto h-5 w-5 text-zinc-400"
                        : "mx-auto h-5 w-5 text-amber-700"
                  }
                />
              ) : (
                entry.rank
              )}
            </TableCell>

            <TableCell>{entry.user_name}</TableCell>

            <TableCell className="text-right">{entry.total_points}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
