import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

async function HomeAuthCheck() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect("/predictions");
  }

  return null;
}

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Suspense fallback={null}>
        <HomeAuthCheck />
      </Suspense>

      {/* Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-black dark:text-zinc-100">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <Link
            href="/"
            className="text-base font-bold tracking-tight text-zinc-950 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
          >
            WC Predictor
          </Link>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Suspense
              fallback={
                <div className="h-8 w-20 bg-muted animate-pulse rounded animate-duration-500" />
              }
            >
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-3xl px-5 py-12 flex flex-col justify-center gap-8">
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
              className="font-semibold bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <Link href="/predictions">Start Predicting</Link>
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
            <h3 className="font-bold text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-2">
              1. Predict
            </h3>
            <p className="text-sm text-muted-foreground">
              Cast your predictions (Home Win, Draw, or Away Win) before
              kickoff.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <h3 className="font-bold text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-2">
              2. Score
            </h3>
            <p className="text-sm text-muted-foreground">
              Earn points for correct outcomes as match results are confirmed.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <h3 className="font-bold text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-2">
              3. Win
            </h3>
            <p className="text-sm text-muted-foreground">
              Track your ranking on the live leaderboard and beat your friends.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 mt-auto">
        <div className="max-w-3xl mx-auto px-5 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <p>© 2026 World Cup Predictor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
