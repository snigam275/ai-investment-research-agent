import { InvestmentVerdict } from '@/lib/types';
import VerdictBadge from './VerdictBadge';
import ScoreGauge from './ScoreGauge';
import ResearchSection from './ResearchSection';
import { CheckCircle2, AlertOctagon, AlertTriangle, ArrowLeft } from 'lucide-react';

interface Props {
  result: InvestmentVerdict;
  onReset: () => void;
}

export default function ResultsDashboard({ result, onReset }: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in select-text">

      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100">{result.company}</h2>
        <div className="py-2">
          <VerdictBadge verdict={result.verdict} size="lg" />
        </div>
        <p className="text-slate-350 max-w-2xl mx-auto leading-relaxed text-base font-light">
          {result.summary}
        </p>
      </div>

      {/* Score + Reasoning */}
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 flex items-center justify-center backdrop-blur-md shadow-2xl">
          <ScoreGauge score={result.confidenceScore} />
        </div>
        <div className="md:col-span-3 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md shadow-2xl flex flex-col justify-center">
          <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-3">Analyst Reasoning</h3>
          <p className="text-slate-300 text-sm leading-relaxed font-light">{result.reasoning}</p>
        </div>
      </div>

      {/* Pros / Cons / Risks */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-emerald-950/10 border border-emerald-500/20 hover:border-emerald-500/30 rounded-2xl p-6 backdrop-blur-md transition-all duration-300 shadow-lg">
          <h3 className="font-bold text-emerald-400 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Strengths
          </h3>
          <ul className="space-y-3">
            {result.pros.map((p, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2 leading-relaxed">
                <span className="shrink-0 text-emerald-500">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-rose-950/10 border border-rose-500/20 hover:border-rose-500/30 rounded-2xl p-6 backdrop-blur-md transition-all duration-300 shadow-lg">
          <h3 className="font-bold text-rose-400 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" /> Key Weaknesses
          </h3>
          <ul className="space-y-3">
            {result.cons.map((c, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2 leading-relaxed">
                <span className="shrink-0 text-rose-500">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-950/10 border border-amber-500/20 hover:border-amber-500/30 rounded-2xl p-6 backdrop-blur-md transition-all duration-300 shadow-lg">
          <h3 className="font-bold text-amber-400 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Major Risks
          </h3>
          <ul className="space-y-3">
            {result.risks.map((r, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2 leading-relaxed">
                <span className="shrink-0 text-amber-500">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Research Breakdown */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-200 text-lg tracking-wide">Research Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {result.research.map((r, i) => (
            <ResearchSection key={i} research={r} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-6 border-t border-slate-800">
        <span>Analysis generated at {new Date(result.timestamp).toLocaleString()}</span>
        <button
          onClick={onReset}
          className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Analyze another company</span>
        </button>
      </div>
    </div>
  );
}
