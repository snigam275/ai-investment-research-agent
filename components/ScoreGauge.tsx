'use client';
import { useEffect, useState } from 'react';

interface Props {
  score: number; // 0-100
}

export default function ScoreGauge({ score }: Props) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    // Trigger progress animation on mount
    const timer = setTimeout(() => {
      const targetOffset = circumference - (score / 100) * circumference;
      setOffset(targetOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  // Determine colors based on thresholds
  const isHigh = score >= 60;
  const isMid = score >= 40 && score < 60;

  const glowColorClass = isHigh
    ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]'
    : isMid
      ? 'drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]'
      : 'drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]';

  const labelColorClass = isHigh 
    ? 'text-emerald-600 dark:text-emerald-400' 
    : isMid 
      ? 'text-amber-600 dark:text-amber-400' 
      : 'text-rose-600 dark:text-rose-400';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center">
        <svg width="150" height="150" viewBox="0 0 140 140" className="transform -rotate-90">
          <defs>
            <linearGradient id="scoreEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="scoreAmber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="scoreRose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          {/* Background circle track */}
          <circle 
            cx="70" 
            cy="70" 
            r={radius} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="10" 
            className="text-slate-200 dark:text-slate-800 opacity-60 transition-colors duration-300"
          />
          {/* Progress circle */}
          <circle
            cx="70" 
            cy="70" 
            r={radius}
            fill="none"
            stroke={isHigh ? 'url(#scoreEmerald)' : isMid ? 'url(#scoreAmber)' : 'url(#scoreRose)'}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-[1200ms] ease-out ${glowColorClass}`}
          />
        </svg>
        {/* Absolute centered labels */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tighter ${labelColorClass} transition-colors duration-300`}>
            {score}
          </span>
          <span className="text-[10px] text-text-dim uppercase font-semibold tracking-wider -mt-1 transition-colors duration-300">
            confidence
          </span>
        </div>
      </div>
      <p className="text-xs text-text-muted font-medium tracking-wide uppercase transition-colors duration-300">Confidence Rating</p>
    </div>
  );
}
