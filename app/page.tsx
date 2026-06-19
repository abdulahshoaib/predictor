import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Hero } from "@/components/hero";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import wc26Logo from "@/app/wc26.png";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen flex flex-col text-foreground">
      <Suspense fallback={null}>
        <HomeAuthCheck />
      </Suspense>

      {/* Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-black dark:text-zinc-100">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-bold tracking-tight text-zinc-950 hover:text-green-600 dark:text-white dark:hover:text-green-400 transition-colors"
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
          <div className="flex items-center gap-3">
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

      <Hero />

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 mt-auto">
        <div className="max-w-3xl mx-auto px-5 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <p>
            {"checkout other cool stuff by "}
            <Button variant="link" className="p-0 m-0 text-foreground">
              <a href="abdullahshoaib.dev">@abdullah</a>
            </Button>
          </p>
          <ThemeSwitcher />
        </div>
      </footer>
    </div>
  );
}
