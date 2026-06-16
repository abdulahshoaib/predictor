"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Match, PredictionChoice } from "@/lib/types";
import { MapPin, Clock, Crown, Check, X } from "lucide-react";

interface MatchCardProps {
  match: Match;
  prediction?: PredictionChoice;
  onPredict: (matchId: string, choice: PredictionChoice) => void;
}

const CHOICES: { value: PredictionChoice; label: string }[] = [
  { value: "home", label: "H" },
  { value: "draw", label: "D" },
  { value: "away", label: "A" },
];

export function MatchCard({ match, prediction, onPredict }: MatchCardProps) {
  const isLocked = match.status !== "upcoming";

  const getWinnerOutcome = (): string | null => {
    if (!match.winner) return null;
    const winnerClean = match.winner.trim().toLowerCase();
    const homeClean = match.team_home.trim().toLowerCase();
    const awayClean = match.team_away.trim().toLowerCase();
    
    if (winnerClean === 'home' || winnerClean === homeClean) return 'home';
    if (winnerClean === 'away' || winnerClean === awayClean) return 'away';
    if (winnerClean === 'draw' || winnerClean === 'd') return 'draw';
    return null;
  };

  const outcome = getWinnerOutcome();
  const isHomeWinner = outcome === 'home';
  const isAwayWinner = outcome === 'away';

  const formattedTime = match.time ? (() => {
    try {
      return new Date(match.time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return null;
    }
  })() : null;

  const getButtonStyles = (value: PredictionChoice) => {
    const isSelected = prediction === value;
    
    if (match.status === "upcoming") {
      if (isSelected) {
        if (value === "home") {
          return "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 border-emerald-400/30 scale-105 font-bold hover:from-emerald-500 hover:to-teal-500 hover:text-white";
        }
        if (value === "draw") {
          return "bg-gradient-to-br from-zinc-500 to-slate-500 text-white shadow-md shadow-zinc-500/20 border-zinc-400/30 scale-105 font-bold hover:from-zinc-500 hover:to-slate-500 hover:text-white";
        }
        if (value === "away") {
          return "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/20 border-blue-400/30 scale-105 font-bold hover:from-blue-500 hover:to-indigo-500 hover:text-white";
        }
      }
      return "text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80";
    }

    if (match.status === "live") {
      if (isSelected) {
        return "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/10 animate-pulse font-bold";
      }
      return "opacity-30 text-zinc-400 dark:text-zinc-600 cursor-not-allowed";
    }

    // status === "finished"
    const isActualOutcome = outcome === value;
    if (isSelected) {
      if (isActualOutcome) {
        // Correct prediction!
        return "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/10 font-bold";
      } else {
        // Incorrect prediction
        return "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/10 font-bold";
      }
    }

    if (isActualOutcome) {
      // Correct outcome, but not predicted by the user
      return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 font-semibold";
    }

    // Not selected, and not actual outcome
    return "opacity-25 text-zinc-400 dark:text-zinc-500 cursor-not-allowed";
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-[2px] backdrop-blur-md",
      "bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-900/40 dark:border-zinc-800/80 dark:text-zinc-100",
      match.status === 'finished' && prediction && outcome === prediction && "border-emerald-500/30 dark:border-emerald-500/20 shadow-emerald-500/5 hover:border-emerald-500/40",
      match.status === 'live' && "border-red-500/20 dark:border-red-500/10 shadow-red-500/5"
    )}>
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-zinc-500/5 dark:to-white/5 opacity-50 pointer-events-none" />
      
      <CardContent className="flex flex-col gap-4 p-5 relative z-10">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/50 pb-3">
          <div className="flex items-center gap-2">
            {match.stage && (
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border-primary/20">
                {match.stage}
              </Badge>
            )}
            {match.group && (
              <Badge variant="outline" className="text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/50">
                Group {match.group}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Prediction status pill */}
            {match.status === 'finished' && (
              <>
                {prediction === outcome ? (
                  <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border border-emerald-500/20 shadow-sm">
                    <Check className="h-3 w-3 stroke-[2.5]" /> Correct
                  </span>
                ) : prediction ? (
                  <span className="flex items-center gap-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border border-rose-500/20 shadow-sm">
                    <X className="h-3 w-3 stroke-[2.5]" /> Incorrect
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-zinc-100 text-zinc-500 dark:bg-zinc-800/80 dark:text-zinc-400 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border border-zinc-200/60 dark:border-zinc-700/50">
                    Unpredicted
                  </span>
                )}
              </>
            )}

            {match.status === "live" && (
              <div className="relative flex items-center gap-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-rose-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-600 dark:bg-rose-400"></span>
                </span>
                Live
              </div>
            )}
            {match.status === "finished" && (
              <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-500 border border-zinc-200/50 dark:bg-zinc-800/60 dark:text-zinc-400 dark:border-zinc-700/50">
                Finished
              </Badge>
            )}
            {match.status === "upcoming" && (
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-blue-500/20 text-blue-600 bg-blue-500/5 dark:text-blue-400 dark:border-blue-500/10">
                Upcoming
              </Badge>
            )}
          </div>
        </div>

        {/* Teams and Buttons */}
        <div className="flex items-center justify-between gap-4 py-1">
          <TeamDisplay
            name={match.team_home}
            flag={match.flag_home}
            align="left"
            isWinner={isHomeWinner}
            isFinished={match.status === 'finished'}
          />

          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="flex items-center p-1 bg-zinc-100/80 dark:bg-zinc-950/40 rounded-full border border-zinc-200/50 dark:border-zinc-800/60 flex-row gap-0.5 shadow-inner">
              {CHOICES.map(({ value, label }) => {
                const isSelected = prediction === value;
                const isActualOutcome = outcome === value;
                const styles = getButtonStyles(value);
                return (
                  <Button
                    key={value}
                    variant="ghost"
                    size="sm"
                    disabled={isLocked}
                    onClick={() => onPredict(match.id, value)}
                    className={cn(
                      "h-9 px-3.5 sm:px-4 rounded-full transition-all duration-300 text-xs font-bold cursor-pointer relative",
                      styles
                    )}
                  >
                    <span className="flex items-center gap-1 justify-center">
                      {label}
                      {match.status === 'finished' && isSelected && isActualOutcome && (
                        <Check className="h-3 w-3 stroke-[2.5]" />
                      )}
                      {match.status === 'finished' && isSelected && !isActualOutcome && (
                        <X className="h-3 w-3 stroke-[2.5]" />
                      )}
                    </span>
                  </Button>
                );
              })}
            </div>
            {match.status === 'finished' && (
              <span className={cn(
                "text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-zinc-100/50 dark:bg-zinc-900/50",
                prediction === outcome 
                  ? "text-emerald-600 dark:text-emerald-500" 
                  : prediction 
                    ? "text-rose-600 dark:text-rose-500"
                    : "text-zinc-500"
              )}>
                {prediction === outcome 
                  ? "Prediction Hit" 
                  : prediction 
                    ? "Prediction Missed"
                    : `Winner: ${outcome === 'home' ? 'Home' : outcome === 'away' ? 'Away' : 'Draw'}`
                }
              </span>
            )}
            {match.status === 'live' && (
              <span className="text-[9px] text-blue-600 dark:text-blue-400 uppercase font-black tracking-wider animate-pulse">
                Predictions Locked
              </span>
            )}
          </div>

          <TeamDisplay
            name={match.team_away}
            flag={match.flag_away}
            align="right"
            isWinner={isAwayWinner}
            isFinished={match.status === 'finished'}
          />
        </div>

        {/* Bottom Location and Time Bar */}
        {(match.stadium || formattedTime) && (
          <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs text-muted-foreground border-t border-zinc-200/40 dark:border-zinc-800/30 pt-3">
            {match.stadium ? (
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <MapPin className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
                <span className="truncate max-w-[180px] sm:max-w-[240px]">{match.stadium}</span>
              </div>
            ) : (
              <div />
            )}

            {formattedTime && (
              <div className="flex items-center gap-1.5 font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100/80 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md text-[11px] border border-zinc-200/30 dark:border-zinc-700/20">
                <Clock className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
                <span>{formattedTime}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface TeamDisplayProps {
  name: string;
  flag: string;
  align: "left" | "right";
  isWinner: boolean;
  isFinished: boolean;
}

function TeamDisplay({ name, flag, align, isWinner, isFinished }: TeamDisplayProps) {
  const isRight = align === "right";
  
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center gap-3 transition-all duration-300 group flex-1",
        isRight ? "sm:flex-row-reverse text-center sm:text-right" : "text-center sm:text-left",
        isFinished && !isWinner && "opacity-40 filter grayscale-[20%]",
        isFinished && isWinner && "scale-[1.02]"
      )}
    >
      {/* Flag Circle Container */}
      <div className={cn(
        "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md shrink-0",
        "bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200/50 dark:border-zinc-700/50",
        isWinner && "ring-2 ring-amber-500/50 dark:ring-amber-500/30 scale-105 shadow-amber-500/10",
        "group-hover:scale-110 group-hover:shadow-lg"
      )}>
        <span className="text-2xl sm:text-3xl leading-none select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
          {flag}
        </span>
      </div>

      {/* Name and Winner Details */}
      <div className={cn(
        "flex flex-col min-w-0 max-w-[110px] sm:max-w-[150px]",
        isRight ? "items-center sm:items-end" : "items-center sm:items-start"
      )}>
        <div className={cn(
          "flex items-center gap-1",
          isRight && "flex-row-reverse"
        )}>
          <span className={cn(
            "font-extrabold text-xs sm:text-sm tracking-wide uppercase transition-colors duration-200 truncate",
            isWinner 
              ? "text-amber-600 dark:text-amber-400 font-black" 
              : "text-zinc-800 dark:text-zinc-200"
          )}>
            {name}
          </span>
          {isWinner && (
            <div className="flex items-center justify-center p-0.5 rounded-full bg-amber-500/10 text-amber-500 shrink-0">
              <Crown className="h-3 w-3 fill-amber-500/30 animate-pulse" />
            </div>
          )}
        </div>
        
        {isFinished && isWinner && (
          <span className="text-[9px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider mt-0.5">
            Winner
          </span>
        )}
      </div>
    </div>
  );
}
