"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import wc26Logo from "@/app/wc26.png";

const NAV_LINKS = [
  { href: "/predictions", label: "Predictions" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function NavBar() {
  const pathname = usePathname();
  const { username, points, leaderboard, loading, updateLeaderboardOpt } =
    useAuth();

  const [isOpen, setIsOpen] = useState(false);
  // Tracks the pending (unsaved) selection inside the popup
  const [pending, setPending] = useState<"enabled" | "disabled" | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync pending state when popup opens or leaderboard value changes
  useEffect(() => {
    if (isOpen) {
      setPending(leaderboard);
      setSaved(false);
    }
  }, [isOpen, leaderboard]);

  const hasChange = pending !== null && pending !== leaderboard;

  const handleConfirm = async () => {
    if (!hasChange || saving || pending === null) return;
    setSaving(true);
    await updateLeaderboardOpt(pending);
    setSaving(false);
    setSaved(true);
    // Close after short delay so user sees the saved state
    setTimeout(() => setIsOpen(false), 700);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white text-zinc-900 dark:border-zinc-200/10 dark:bg-black dark:text-zinc-100">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-6">
            <Link
              href="/predictions"
              className="flex items-center gap-2 text-base font-bold tracking-tight text-zinc-950 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
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
                    {link.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            {loading ? (
              <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded" />
            ) : username ? (
              <div className="flex items-center gap-2">
                {points !== null && (
                  <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50/80 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50 dark:hover:bg-emerald-950/60 transition-all cursor-pointer"
                    title="Leaderboard Settings"
                  >
                    🏆 {points} {points === 1 ? "pt" : "pts"}
                  </button>
                )}
                <span className="hidden sm:inline text-sm text-zinc-500 dark:text-zinc-400">
                  {username}
                </span>
              </div>
            ) : null}
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Leaderboard Settings Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => !saving && setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-sm rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                Leaderboard Settings
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Control whether your profile appears on the global leaderboard.
              </p>
            </div>

            {/* Toggle options */}
            <div className="px-4 pb-4 flex flex-col gap-2">
              {/* Enabled option */}
              <button
                onClick={() => setPending("enabled")}
                disabled={saving}
                className={cn(
                  "w-full flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-150 cursor-pointer disabled:opacity-50",
                  pending === "enabled"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-600"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    pending === "enabled"
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-zinc-300 dark:border-zinc-600",
                  )}
                >
                  {pending === "enabled" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
                <div>
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      pending === "enabled"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-zinc-700 dark:text-zinc-300",
                    )}
                  >
                    Visible on Leaderboard
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Your rank, username, and points are public.
                  </p>
                </div>
              </button>

              {/* Disabled option */}
              <button
                onClick={() => setPending("disabled")}
                disabled={saving}
                className={cn(
                  "w-full flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-150 cursor-pointer disabled:opacity-50",
                  pending === "disabled"
                    ? "border-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 dark:border-zinc-600"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    pending === "disabled"
                      ? "border-zinc-500 bg-zinc-500 dark:border-zinc-400 dark:bg-zinc-400"
                      : "border-zinc-300 dark:border-zinc-600",
                  )}
                >
                  {pending === "disabled" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
                <div>
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      pending === "disabled"
                        ? "text-zinc-700 dark:text-zinc-300"
                        : "text-zinc-700 dark:text-zinc-300",
                    )}
                  >
                    Hidden from Leaderboard
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Your profile won&apos;t appear in the rankings.
                  </p>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 border-t border-zinc-100 dark:border-zinc-800 px-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/40">
              <Button
                onClick={() => setIsOpen(false)}
                disabled={saving}
                variant="destructive"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!hasChange || saving || saved}
                variant="default"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Saving…
                  </span>
                ) : saved ? (
                  "✓ Saved"
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
