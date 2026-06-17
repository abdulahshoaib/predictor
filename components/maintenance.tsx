"use client";

import Image from "next/image";
import wc26Logo from "@/app/wc26.png";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

export function Maintenance() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <Image
          src={wc26Logo}
          alt="World Cup 2026 Logo"
          width={96}
          height={96}
          className="h-24 w-auto select-none"
          priority
        />
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Under Maintenance
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We&apos;re currently performing scheduled maintenance. Please check
            back shortly.
          </p>
        </div>
        <Button
          size="default"
          variant="outline"
          className="font-semibold hover:cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeft className="mr-2" />
          Go Back Home
        </Button>
      </div>
    </div>
  );
}
