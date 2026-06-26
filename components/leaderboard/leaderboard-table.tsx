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
import {
  Crown,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { User } from "@phosphor-icons/react";
import { useState, useMemo } from "react";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  user_name: string;
}

type SortKey = "rank" | "accuracy";
type SortDir = "asc" | "desc";

export function LeaderboardTable({
  entries,
  user_name,
}: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "rank" ? "asc" : "desc");
    }
  };

  const sorted = useMemo(() => {
    const copy = [...entries];
    if (sortKey === "rank") {
      copy.sort((a, b) =>
        sortDir === "asc" ? a.rank - b.rank : b.rank - a.rank,
      );
    } else {
      copy.sort((a, b) => {
        const va = a.accuracy_percentage ?? -1;
        const vb = b.accuracy_percentage ?? -1;
        return sortDir === "asc" ? va - vb : vb - va;
      });
    }
    return copy;
  }, [entries, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    const active = sortKey === col;
    return (
      <span className="inline-flex flex-col leading-none ml-1 -mb-0.5">
        <ChevronUp
          className={`size-3 ${active ? (sortDir === "asc" ? "text-foreground" : "text-muted-foreground/30") : "text-muted-foreground/30"}`}
        />
        <ChevronDown
          className={`size-3 -mt-1 ${active ? (sortDir === "desc" ? "text-foreground" : "text-muted-foreground/30") : "text-muted-foreground/30"}`}
        />
      </span>
    );
  };

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
          <TableHead
            className={`w-16 text-center cursor-pointer select-none transition-colors ${
              sortKey === "rank"
                ? "text-foreground bg-muted/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => toggleSort("rank")}
          >
            #<SortIcon col="rank" />
          </TableHead>
          <TableHead>Player</TableHead>
          <TableHead className="text-right">Correct</TableHead>
          <TableHead
            className={`text-right cursor-pointer select-none transition-colors ${
              sortKey === "accuracy"
                ? "text-foreground bg-muted/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => toggleSort("accuracy")}
          >
            Accuracy
            <SortIcon col="accuracy" />
          </TableHead>
          <TableHead className="text-right">Points</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sorted.map((entry) => (
          <TableRow
            key={entry.user_id}
            className={
              entry.user_name === user_name
                ? "bg-emerald-500/10 font-medium"
                : ""
            }
          >
            <TableCell
              className={`text-center ${sortKey === "rank" ? "bg-muted/20" : ""}`}
            >
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
            <TableCell
              className={`text-right tabular-nums text-muted-foreground ${sortKey === "accuracy" ? "bg-muted/20" : ""}`}
            >
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
