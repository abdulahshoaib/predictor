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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Skeleton from "react-loading-skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import wc26Logo from "@/app/wc26.png";
import { useUserContext } from "@/context/userContext";
import { useLeaderboardContext } from "@/context/leaderboardContext";
import { useMemo, useState } from "react";
import {
  CalendarCheck,
  Table,
  Trophy,
  User,
  SignOut,
  PencilSimple,
} from "@phosphor-icons/react";
import { UsernameDialog } from "@/components/username-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/predictions", label: "Predictions", icon: CalendarCheck },
  { href: "/groupstandings", label: "Groups", icon: Table },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading, setUser } = useUserContext();
  const { leaderboard, refetch: refetchLeaderboard } = useLeaderboardContext();

  const user_name = user?.user_name;
  const me = useMemo(
    () => leaderboard?.entries.find((entry) => entry.user_name === user_name),
    [leaderboard, user_name],
  );

  const rank = me?.rank ?? 0;
  const points = me?.total_points ?? 0;
  const [usernameOpen, setUsernameOpen] = useState(false);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 rounded-full p-1.5 pr-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <span className="hidden sm:inline text-sm text-zinc-600 dark:text-zinc-400">
                      {user_name}
                    </span>
                    <Avatar size="sm">
                      {user?.avatar_url ? (
                        <AvatarImage src={user.avatar_url} alt={user_name} />
                      ) : (
                        <AvatarFallback className="bg-transparent">
                          <User className="size-3" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Avatar size="sm">
                      {user?.avatar_url ? (
                        <AvatarImage src={user.avatar_url} alt={user_name} />
                      ) : (
                        <AvatarFallback className="bg-transparent">
                          <User className="size-3" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="truncate">{user_name}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setUsernameOpen(true)}>
                    <PencilSimple className="size-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={logout}>
                    <SignOut className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <UsernameDialog
                user={user}
                onUpdate={(updated) => {
                  setUser(updated);
                  refetchLeaderboard();
                }}
                open={usernameOpen}
                onOpenChange={setUsernameOpen}
              />
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
