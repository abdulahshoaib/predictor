import React from "react";

interface WorldCupLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function WorldCupLogo({ className = "", showText = true, size = "md" }: WorldCupLogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-20",
  };

  return (
    <div className={`flex items-center gap-3 ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto filter drop-shadow-md select-none"
      >
        <defs>
          {/* Main 26 text gradient */}
          <linearGradient id="twentySixGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" /> {/* Emerald */}
            <stop offset="40%" stopColor="#14b8a6" /> {/* Teal */}
            <stop offset="100%" stopColor="#0284c7" /> {/* Sky Blue */}
          </linearGradient>
          {/* Trophy gold gradient */}
          <linearGradient id="trophyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" /> {/* Amber */}
            <stop offset="50%" stopColor="#f59e0b" /> {/* Gold */}
            <stop offset="100%" stopColor="#d97706" /> {/* Dark Gold */}
          </linearGradient>
          {/* Soft backglow */}
          <radialGradient id="logoGlow" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Backglow Circle */}
        <circle cx="50" cy="60" r="45" fill="url(#logoGlow)" />

        {/* Bold stacked '2' */}
        <text
          x="50"
          y="50"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="50"
          textAnchor="middle"
          fill="url(#twentySixGrad)"
          className="font-black select-none"
        >
          2
        </text>

        {/* Bold stacked '6' */}
        <text
          x="50"
          y="92"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="50"
          textAnchor="middle"
          fill="url(#twentySixGrad)"
          className="font-black select-none"
        >
          6
        </text>

        {/* Golden Trophy overlaid */}
        {/* Base shadow */}
        <ellipse cx="50" cy="78" rx="12" ry="2" fill="black" fillOpacity="0.15" />
        
        {/* Trophy cup body */}
        <path
          d="M 38 42
             C 38 28, 62 28, 62 42
             C 62 53, 54 59, 54 68
             L 46 68
             C 46 59, 38 53, 38 42 Z"
          fill="url(#trophyGrad)"
          stroke="#ffffff"
          strokeWidth="1"
        />

        {/* Cup details/shading */}
        <path
          d="M 42 42 C 42 34, 58 34, 58 42"
          stroke="#ffffff"
          strokeOpacity="0.4"
          strokeWidth="1"
          fill="none"
        />

        {/* Left handle */}
        <path
          d="M 38 38 C 32 38, 32 46, 38 48 C 37 46, 37 40, 38 38"
          fill="url(#trophyGrad)"
          stroke="#ffffff"
          strokeWidth="0.5"
        />

        {/* Right handle */}
        <path
          d="M 62 38 C 68 38, 68 46, 62 48 C 63 46, 63 40, 62 38"
          fill="url(#trophyGrad)"
          stroke="#ffffff"
          strokeWidth="0.5"
        />

        {/* Stem connection */}
        <path
          d="M 46 68 H 54 V 71 H 46 Z"
          fill="#d97706"
        />

        {/* Lower base tier 1 */}
        <path
          d="M 43 71 H 57 V 74 H 43 Z"
          fill="url(#trophyGrad)"
        />

        {/* Lower base tier 2 */}
        <path
          d="M 39 74 H 61 L 63 78 H 37 Z"
          fill="#b45309"
        />

        {/* Golden star at the top */}
        <path
          d="M 50 16 L 52 20 L 56 20 L 53 23 L 55 27 L 50 25 L 45 27 L 47 23 L 44 20 L 48 20 Z"
          fill="#fbbf24"
        />
      </svg>

      {showText && (
        <div className="flex flex-col text-left select-none">
          <span className="font-black tracking-tight leading-none text-zinc-900 dark:text-white text-base">
            WORLD CUP
          </span>
          <span className="font-extrabold tracking-widest text-emerald-500 dark:text-emerald-400 text-xs leading-none mt-0.5">
            2026 PREDICTOR
          </span>
        </div>
      )}
    </div>
  );
}
