'use client';
import { useState } from 'react';
import { Sparkles, Search } from 'lucide-react';

interface Props {
  onSubmit: (company: string) => void;
  isLoading: boolean;
}

const EXAMPLES = ['Reliance Industries', 'Apple Inc', 'Zomato', 'Tesla', 'Infosys'];

export default function SearchForm({ onSubmit, isLoading }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Enter a company name (e.g. Tata Motors, Nvidia)"
            className="w-full pl-12 pr-5 py-4 bg-slate-900/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-base rounded-2xl shadow-xl focus:border-indigo-500/85 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 select-text"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-300 text-base shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <span className="animate-pulse">Researching...</span>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze Company</span>
            </>
          )}
        </button>
      </form>

      <div className="flex flex-wrap gap-2 items-center justify-center text-sm">
        <span className="text-slate-500 font-medium tracking-wide">Popular:</span>
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            type="button"
            onClick={() => { setValue(ex); onSubmit(ex); }}
            disabled={isLoading}
            className="text-xs bg-slate-900/50 hover:bg-indigo-950/20 text-slate-400 hover:text-indigo-400 border border-slate-800/80 hover:border-indigo-500/40 rounded-full px-3.5 py-1.5 transition-all duration-300 font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
