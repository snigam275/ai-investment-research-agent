import clsx from 'clsx';
import { TrendingUp, XCircle } from 'lucide-react';

interface Props {
  verdict: 'INVEST' | 'PASS';
  size?: 'sm' | 'lg';
}

export default function VerdictBadge({ verdict, size = 'lg' }: Props) {
  const isInvest = verdict === 'INVEST';
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 font-bold rounded-full tracking-wider transition-all duration-300',
        size === 'lg' 
          ? 'text-xl md:text-2xl px-8 py-3 border-2' 
          : 'text-xs md:text-sm px-4 py-1 border',
        isInvest
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.1)] dark:shadow-[0_0_15px_rgba(16,185,129,0.15)] glow-emerald'
          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 dark:border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.1)] dark:shadow-[0_0_15px_rgba(244,63,94,0.15)] glow-rose'
      )}
    >
      {isInvest ? (
        <>
          <TrendingUp className={size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />
          <span>INVEST</span>
        </>
      ) : (
        <>
          <XCircle className={size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />
          <span>PASS</span>
        </>
      )}
    </span>
  );
}
