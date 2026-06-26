"use client";

import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import Image from "next/image";
import wc26Logo from "@/app/wc26.png";
import { useUserContext } from "@/context/userContext";
import { useLeaderboardContext } from "@/context/leaderboardContext";
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
  const { leaderboard, loading, error } = useLeaderboardContext();

  if (loading) {
    return (
      <main className="flex flex-col gap-8 md:flex-row items-start">
        <div className="flex-1 w-full max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Leaderboard</h1>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16"><Skeleton width={20} /></TableHead>
                <TableHead><Skeleton width={80} /></TableHead>
                <TableHead className="text-right"><Skeleton width={60} /></TableHead>
                <TableHead className="text-right"><Skeleton width={60} /></TableHead>
                <TableHead className="text-right"><Skeleton width={60} /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center"><Skeleton width={20} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton circle width={32} height={32} />
                      <Skeleton width={120} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right"><Skeleton width={40} /></TableCell>
                  <TableCell className="text-right"><Skeleton width={40} /></TableCell>
                  <TableCell className="text-right"><Skeleton width={30} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="w-full md:w-auto shrink-0 flex justify-center py-4 md:py-14">
          <Skeleton circle width={160} height={160} />
        </div>
      </main>
    );
  }

  if (error) return <div>{error}</div>;
  if (!user) return <div>No user</div>;
  if (!leaderboard) return <div>No leaderboard data</div>;

  return (
    <main className="flex flex-col gap-8 md:flex-row items-start">
      <div className="flex-1 w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Leaderboard</h1>
        </div>
        <LeaderboardTable
          entries={leaderboard.entries}
          user_name={user.user_name}
        />
      </div>
      <div className="w-full md:w-auto shrink-0 flex justify-center py-4 md:py-14">
        <Image
          src={wc26Logo}
          alt="World Cup 2026 Logo"
          width={160}
          height={160}
          className="h-40 w-auto select-none filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        />
      </div>
    </main>
  );
}
