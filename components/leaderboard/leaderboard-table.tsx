import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LeaderboardEntry } from "@/types/leaderboard";
import { Crown } from "lucide-react";
import { User } from "@phosphor-icons/react";

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
          <TableHead className="text-right">Correct</TableHead>
          <TableHead className="text-right">Accuracy</TableHead>
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

            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar size="lg">
                  {entry.avatar_url ? (
                    <AvatarImage src={entry.avatar_url} alt={entry.user_name} />
                  ) : (
                    <AvatarFallback className="bg-transparent">
                      <User className="size-5" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <span>{entry.user_name}</span>
              </div>
            </TableCell>

            <TableCell className="text-right tabular-nums text-muted-foreground">
              {entry.total_correct}/{entry.total_predictions}
            </TableCell>
            <TableCell className="text-right tabular-nums text-muted-foreground">
              {entry.accuracy_percentage != null
                ? `${Math.round(entry.accuracy_percentage)}%`
                : "—"}
            </TableCell>
            <TableCell className="text-right font-medium tabular-nums">
              {entry.total_points}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
