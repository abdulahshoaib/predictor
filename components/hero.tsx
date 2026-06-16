import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <div className="relative w-full py-16 md:py-24 flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center gap-4 max-w-xl px-6">
        {/* Category Tag */}
        <span className="text-xs font-semibold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase select-none">
          World Cup 2026
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
          Predict the World Cup
        </h1>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <Button asChild size="lg">
            <Link href="/predictions" className="flex items-center gap-1.5">
              Start Predicting <ArrowRight className="size-3.5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/leaderboard">Leaderboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
