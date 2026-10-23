/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  inverted = false,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  const devanagariSizes = {
    sm: 'text-[11px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className={`group flex items-center gap-3 cursor-pointer select-none transition-all duration-300 ${className}`}>
      {/* Animated Emblem Shield */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        {/* Outer glowing halo ring on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-emerald-600 via-amber-500 to-emerald-400 opacity-20 blur-xs group-hover:opacity-60 transition-opacity duration-500 animate-pulse" />

        {/* Shield Container */}
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Shield (Raksha) */}
          <path
            d="M32 4L54 13V31C54 44.8 44.6 57.5 32 61C19.4 57.5 10 44.8 10 31V13L32 4Z"
            className="fill-emerald-800 dark:fill-emerald-950 stroke-emerald-700/60 dark:stroke-emerald-600/40"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Protective Rim */}
          <path
            d="M32 8L49 15.5V30.5C49 41.5 41.8 51.5 32 54.5C22.2 51.5 15 41.5 15 30.5V15.5L32 8Z"
            className="fill-emerald-900/80 dark:fill-slate-900/90 stroke-amber-500/50"
            strokeWidth="1.2"
          />

          {/* Saffron / Sun Aura Accent */}
          <circle cx="32" cy="27" r="14" className="fill-amber-500/20" />

          {/* Protective Food Bowl (Annapatra) */}
          <path
            d="M20 38C20 45 25.4 48 32 48C38.6 48 44 45 44 38H20Z"
            className="fill-amber-500 dark:fill-amber-400 transition-colors duration-300 group-hover:fill-amber-400"
          />

          {/* Golden Grain Sheaf / Sprout (Anna) */}
          {/* Central Stem */}
          <path
            d="M32 45V18"
            stroke="#FDE68A"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="transition-all duration-500 group-hover:stroke-amber-300"
          />

          {/* Left Grain Kernels */}
          <path
            d="M32 23C27 21 25 25 32 28"
            className="fill-amber-300 stroke-amber-400"
            strokeWidth="1"
          />
          <path
            d="M32 29C26 27 24 32 32 34"
            className="fill-amber-300 stroke-amber-400"
            strokeWidth="1"
          />

          {/* Right Grain Kernels */}
          <path
            d="M32 20C37 18 39 22 32 25"
            className="fill-amber-300 stroke-amber-400"
            strokeWidth="1"
          />
          <path
            d="M32 26C38 24 40 29 32 31"
            className="fill-amber-300 stroke-amber-400"
            strokeWidth="1"
          />

          {/* Top Sprout Tip */}
          <circle cx="32" cy="17" r="2.2" className="fill-amber-200" />

          {/* Guarding Leaves */}
          <path
            d="M20 38C24 33 28 35 32 39"
            stroke="#34D399"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M44 38C40 33 36 35 32 39"
            stroke="#34D399"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>

        {/* Dynamic Rotation Accent Ring */}
        <div className="absolute inset-[-3px] rounded-xl border border-dashed border-amber-500/30 group-hover:border-amber-400/80 group-hover:rotate-45 transition-all duration-700 pointer-events-none" />
      </div>

      {/* Typography Brand Lockup */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-extrabold tracking-tight font-sans transition-colors duration-200 ${titleSizes[size]} ${
              inverted ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}
          >
            AnnaRaksha
          </span>
          <span
            className={`font-semibold tracking-wide text-amber-600 dark:text-amber-400 font-sans transition-transform duration-300 group-hover:translate-x-0.5 ${devanagariSizes[size]} hidden sm:inline`}
          >
            (अन्नरक्षा)
          </span>
        </div>

        {showTagline && (
          <span
            className={`text-[11px] font-medium tracking-normal mt-0.5 transition-colors duration-200 ${
              inverted ? 'text-emerald-200/80' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Predict · Prevent · Redistribute
          </span>
        )}
      </div>
    </div>
  );
};
