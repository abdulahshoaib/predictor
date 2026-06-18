import Image from "next/image";
import wc26Logo from "@/app/wc26.png";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background p-6 md:p-10">
      {/* Localized smooth gradient background elements */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-112 w-md rounded-full bg-teal-500/10 blur-[120px]" />

      <div className="relative z-10 flex max-w-sm flex-col items-center gap-6 text-center">
        <h1 className="bg-linear-to-br from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-3xl font-extrabold tracking-tighter text-transparent drop-shadow-xl md:text-4xl">
          World Cup Predictor
        </h1>

        <Image
          src={wc26Logo}
          alt="World Cup 2026 Logo"
          width={96}
          height={96}
          className="h-24 w-auto select-none"
          priority
        />

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Applying some finishing touches
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Just be right back
          </p>
        </div>

        <div className="flex flex-row items-center justify-center">
          <p>Meanwhile,</p>
          <Button asChild className="text-tertiary" variant="link">
            <a
              href="https://abdullahshoaib.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              checkout my Portfolio
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
