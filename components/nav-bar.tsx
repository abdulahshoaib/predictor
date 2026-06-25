"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import wc26Logo from "@/app/wc26.png";
import { useUserContext } from "@/context/userContext";
import { useLeaderboardContext } from "@/context/leaderboardContext";
import { useMemo } from "react";
import { CalendarCheck, Trophy } from "@phosphor-icons/react";

const NAV_LINKS = [
  { href: "/predictions", label: "Predictions", icon: CalendarCheck },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function NavBar() {
  const pathname = usePathname();

  const { user, loading } = useUserContext();
  const { leaderboard } = useLeaderboardContext();

  const user_name = user?.user_name;
  const me = useMemo(
    () => leaderboard?.entries.find((entry) => entry.user_name === user_name),
    [leaderboard, user_name],
  );

  const rank = me?.rank ?? 0;
  const points = me?.total_points ?? 0;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white text-zinc-900 dark:border-zinc-200/10 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <div className="flex items-center gap-6">
          <Link
            href="/predictions"
            className="hidden sm:flex items-center gap-2 text-base font-bold tracking-tight text-zinc-950 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
          >
            <Image
              src={wc26Logo}
              alt="World Cup 2026 Logo"
              width={24}
              height={24}
              className="h-6 w-auto"
            />
            <span>WC Predictor</span>
          </Link>

          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Button
                key={link.href}
                asChild
                variant="ghost"
                size="sm"
                className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900"
              >
                <Link
                  href={link.href}
                  className={cn(
                    pathname.startsWith(link.href) &&
                      "bg-zinc-100 text-zinc-950 font-semibold dark:bg-zinc-900 dark:text-white",
                  )}
                >
                  <link.icon className="size-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-3">
          {loading ? (
            <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded" />
          ) : user_name ? (
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50/80 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50 dark:hover:bg-emerald-950/60 transition-all cursor-pointer"
                    title="Leaderboard Settings"
                  >
                    <span className="sm:hidden">🏆#{rank}</span>
                    <span className="hidden sm:inline">
                      🏆 #{rank} • {points} {points === 1 ? "pt" : "pts"}
                    </span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Leaderboard Scoring</DialogTitle>
                    <DialogDescription>
                      How points are calculated for the global leaderboard.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between border-b border-zinc-200 p-3.5 dark:border-zinc-800">
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Correct Prediction
                      </span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        +3 points
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-zinc-200 p-3.5 dark:border-zinc-800">
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Incorrect Prediction
                      </span>
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">
                        -1 point
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5">
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        No Prediction
                      </span>
                      <span className="text-sm font-bold text-zinc-500">
                        0 points
                      </span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <span className="hidden sm:inline text-sm text-zinc-500 dark:text-zinc-400">
                {user_name}
              </span>
            </div>
          ) : null}
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
