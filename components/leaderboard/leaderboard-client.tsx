"use client";

import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import Image from "next/image";
import wc26Logo from "@/app/wc26.png";
import { useUserContext } from "@/context/userContext";
import { useLeaderboardContext } from "@/context/leaderboardContext";

function LeaderboardContent() {
  const { user } = useUserContext();
  const { leaderboard, loading, error } = useLeaderboardContext();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user</div>;
  if (!leaderboard) return <div>No leaderboard data</div>;

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 flex flex-col md:flex-row gap-8 items-start">
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

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
