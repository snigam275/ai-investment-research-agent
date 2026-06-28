import { ResearchCategory } from '@/lib/types';
import clsx from 'clsx';
import { BarChart3, Newspaper, Swords, AlertTriangle } from 'lucide-react';

const ICONS = {
  financials: BarChart3,
  news: Newspaper,
  competitors: Swords,
  risks: AlertTriangle,
};

const LABELS = {
  financials: 'Financial Analysis',
  news: 'Market Sentiment & News',
  competitors: 'Competitive Position',
  risks: 'Key Risk Factors',
};

const SENTIMENT_STYLES = {
  positive: 'bg-emerald-950/10 border-emerald-500/20 text-emerald-100 hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]',
  neutral: 'bg-slate-900/40 border-slate-800/80 text-slate-100 hover:border-slate-700',
  negative: 'bg-rose-950/10 border-rose-500/20 text-rose-100 hover:border-rose-500/40 hover:shadow-[0_0_15px_rgba(244,63,94,0.1)]',
};

const SENTIMENT_BADGE = {
  positive: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
  neutral: 'bg-slate-800/60 text-slate-400 border border-slate-700',
  negative: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
};

interface Props {
  research: ResearchCategory;
}

export default function ResearchSection({ research }: Props) {
  const Icon = ICONS[research.category] || BarChart3;
  return (
    <div className={clsx(
      'rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1',
      SENTIMENT_STYLES[research.sentiment]
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className={clsx(
          'p-2.5 rounded-xl border',
          research.sentiment === 'positive' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
          research.sentiment === 'negative' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
          'bg-slate-800/80 border-slate-700/60 text-indigo-400'
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-sm tracking-wider uppercase text-slate-200">
          {LABELS[research.category]}
        </h3>
        <span className={clsx(
          'ml-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider',
          SENTIMENT_BADGE[research.sentiment]
        )}>
          {research.sentiment}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-slate-300 font-light whitespace-pre-line">{research.findings}</p>
    </div>
  );
}
