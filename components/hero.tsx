import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import wc26Logo from "@/app/wc26.png";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <main className="flex-1 mx-auto max-w-5xl px-5 py-12 flex flex-col md:flex-row items-center gap-8 justify-between">
      <div className="flex-1 w-full max-w-3xl flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            World Cup 2026 Predictor
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Predict the outcome of every match, collect points, and rise to the
            top of the global leaderboard. Join the tournament excitement and
            test your football knowledge!
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              asChild
              size="default"
              className="font-semibold bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
            >
              <Link href="/predictions">Start Predicting <ArrowRight className="ml-2 inline-block" /></Link>
            </Button>
            <Button
              asChild
              size="default"
              variant="outline"
              className="font-semibold"
            >
              <Link href="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards matching the design system */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <h3 className="font-bold text-xs uppercase tracking-wide text-green-600 dark:text-green-400 mb-2">
              1. Predict
            </h3>
            <p className="text-sm text-muted-foreground">
              Cast your predictions (Home Win, Draw, or Away Win) before
              kickoff.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <h3 className="font-bold text-xs uppercase tracking-wide text-green-600 dark:text-green-400 mb-2">
              2. Score
            </h3>
            <p className="text-sm text-muted-foreground">
              Earn points for correct outcomes as match results are confirmed.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <h3 className="font-bold text-xs uppercase tracking-wide text-green-600 dark:text-green-400 mb-2">
              3. Win
            </h3>
            <p className="text-sm text-muted-foreground">
              Track your ranking on the live leaderboard and beat your friends.
            </p>
          </div>
        </div>
      </div>

      {/* Right side Logo */}
      <div className="w-full md:w-auto shrink-0 flex justify-center py-4 md:py-0">
        <Image
          src={wc26Logo}
          alt="World Cup 2026 Logo"
          width={200}
          height={200}
          className="h-48 w-auto select-none filter drop-shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
        />
      </div>
    </main>
  );
}
