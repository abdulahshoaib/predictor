import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { LeaderboardToggle } from "./leaderboard-toggle";
import type { LeaderboardEntry } from "@/lib/types";
import Image from "next/image";
import wc26Logo from "@/app/wc26.png";

async function PreviewContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  let entries: LeaderboardEntry[] = [];

  try {
    const [usersRes, predictionsRes, matchesRes] = await Promise.all([
      supabase
        .from("users")
        .select("id, username, points, leaderboard")
        .eq("leaderboard", "enabled")
        .order("points", { ascending: false }),
      supabase.from("predictions").select("user_id, match_id, choice, result"),
      supabase
        .from("matches")
        .select("id, status, winner, home_team, away_team"),
    ]);

    if (usersRes.error) {
      console.warn(usersRes.error.message);
    } else if (usersRes.data) {
      const matchesMap = new Map<string, any>();
      if (matchesRes.data) {
        matchesRes.data.forEach((m) => {
          matchesMap.set(String(m.id), m);
        });
      }

      const getMatchOutcome = (match: any): string | null => {
        if (!match.winner) return null;
        const winnerClean = match.winner.trim().toLowerCase();
        const homeClean = (match.home_team || "").trim().toLowerCase();
        const awayClean = (match.away_team || "").trim().toLowerCase();

        if (winnerClean === "home" || winnerClean === homeClean) return "home";
        if (winnerClean === "away" || winnerClean === awayClean) return "away";
        if (winnerClean === "draw" || winnerClean === "d") return "draw";
        return null;
      };

      const userStats = new Map<string, { correct: number; total: number }>();
      if (predictionsRes.data) {
        predictionsRes.data.forEach((p) => {
          const userId = p.user_id;
          const match = matchesMap.get(String(p.match_id));

          if (!userStats.has(userId)) {
            userStats.set(userId, { correct: 0, total: 0 });
          }

          const stats = userStats.get(userId)!;
          stats.total += 1;

          let isCorrect = false;
          if (p.result !== null && p.result !== undefined) {
            isCorrect = p.result > 0;
          } else if (
            match &&
            (match.status === "finished" ||
              match.status === "ft" ||
              match.status === "completed")
          ) {
            const outcome = getMatchOutcome(match);
            isCorrect = outcome !== null && p.choice === outcome;
          }

          if (isCorrect) {
            stats.correct += 1;
          }
        });
      }

      entries = usersRes.data.map((user) => {
        const stats = userStats.get(user.id) || { correct: 0, total: 0 };
        return {
          rank: 0, // Assigned below
          user_id: user.id,
          display_name: user.username || "Anonymous",
          total_score: Number(user.points || 0),
          correct_predictions: stats.correct,
          total_predictions: stats.total,
        };
      });

      // Sort by points desc, then correct predictions desc
      entries.sort((a, b) => {
        if (b.total_score !== a.total_score) {
          return b.total_score - a.total_score;
        }
        return b.correct_predictions - a.correct_predictions;
      });

      // Assign ranks
      entries.forEach((entry, idx) => {
        entry.rank = idx + 1;
      });
    }
  } catch (e) {
    console.error("Error computing leaderboard preview:", e);
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 flex flex-col md:flex-row gap-8 items-start animate-in fade-in duration-300">
      <div className="flex-1 w-full max-w-3xl">
        <LeaderboardToggle />
        <h1 className="text-2xl font-bold mb-6">Leaderboard Preview</h1>
        <LeaderboardTable
          entries={entries}
          currentUserId={data.claims.sub as string}
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

export default function LeaderboardPreviewPage() {
  return (
    <Suspense fallback={null}>
      <PreviewContent />
    </Suspense>
  );
}
