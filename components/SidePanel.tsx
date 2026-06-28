'use client';
import { InvestmentVerdict } from '@/lib/types';
import VerdictBadge from './VerdictBadge';
import ScoreGauge from './ScoreGauge';
import ResearchSection from './ResearchSection';
import { X, CheckCircle2, AlertOctagon, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: InvestmentVerdict | null;
}

export default function SidePanel({ isOpen, onClose, result }: Props) {
  // Disable body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !result) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-xs z-40 transition-opacity duration-300 animate-fade-in cursor-pointer"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-bg-app border-l border-border-main shadow-2xl z-50 flex flex-col transition-transform duration-300 translate-x-0 animate-slide-in select-text">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-main">
          <div>
            <h3 className="font-bold text-base text-text-main">Company Dossier</h3>
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">historical report</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-800/60 rounded-lg text-text-muted hover:text-text-main transition-colors cursor-pointer border-0"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {/* Header Info */}
          <div className="text-center space-y-3 pb-4 border-b border-border-main/50">
            <h4 className="text-2xl font-extrabold text-text-main tracking-tight">{result.company}</h4>
            <div className="py-1">
              <VerdictBadge verdict={result.verdict} size="sm" />
            </div>
            <p className="text-xs text-text-muted leading-relaxed font-light">
              {result.summary}
            </p>
          </div>

          {/* Dials & Analyst Reasoning */}
          <div className="grid grid-cols-1 gap-5">
            <div className="bg-card-bg border border-card-border rounded-2xl p-4 flex items-center justify-center">
              <ScoreGauge score={result.confidenceScore} />
            </div>
            <div className="space-y-2">
              <h5 className="text-[10px] uppercase tracking-widest font-bold text-text-dim">Analyst Synthesis</h5>
              <p className="text-xs text-text-muted leading-relaxed font-light bg-card-bg border border-card-border rounded-xl p-3.5">
                {result.reasoning}
              </p>
            </div>
          </div>

          {/* Strengths / Weaknesses / Risks */}
          <div className="space-y-4">
            <div className="bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-555/25 dark:border-emerald-500/20 rounded-xl p-4">
              <h5 className="font-bold text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
              </h5>
              <ul className="space-y-1.5">
                {result.pros.map((p, i) => (
                  <li key={i} className="text-[11px] text-text-muted flex gap-1.5 leading-relaxed">
                    <span className="text-emerald-500 shrink-0">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-500/5 dark:bg-rose-950/10 border border-rose-555/25 dark:border-rose-500/20 rounded-xl p-4">
              <h5 className="font-bold text-rose-600 dark:text-rose-400 text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" /> Weaknesses
              </h5>
              <ul className="space-y-1.5">
                {result.cons.map((c, i) => (
                  <li key={i} className="text-[11px] text-text-muted flex gap-1.5 leading-relaxed">
                    <span className="text-rose-500 shrink-0">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-500/5 dark:bg-amber-950/10 border border-amber-555/25 dark:border-amber-500/20 rounded-xl p-4">
              <h5 className="font-bold text-amber-600 dark:text-amber-400 text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Risks
              </h5>
              <ul className="space-y-1.5">
                {result.risks.map((r, i) => (
                  <li key={i} className="text-[11px] text-text-muted flex gap-1.5 leading-relaxed">
                    <span className="text-amber-500 shrink-0">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Research Categories */}
          <div className="space-y-3 pt-2">
            <h5 className="text-[10px] uppercase tracking-widest font-bold text-text-dim">Research Breakdown</h5>
            <div className="space-y-3">
              {result.research.map((r, i) => (
                <ResearchSection key={i} research={r} />
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-border-main bg-card-bg/25 text-[10px] text-text-dim text-center">
          Generated at {new Date(result.timestamp).toLocaleString()}
        </div>
      </div>
    </>
  );
}
