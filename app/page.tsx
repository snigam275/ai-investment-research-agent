'use client';
import { useState, useEffect } from 'react';
import SearchForm from '@/components/SearchForm';
import LoadingState from '@/components/LoadingState';
import ResultsDashboard from '@/components/ResultsDashboard';
import { InvestmentVerdict } from '@/lib/types';
import { Sparkles, ShieldAlert, Sun, Moon } from 'lucide-react';

type AppState = 'idle' | 'loading' | 'result' | 'error';

const TICKER_ITEMS = [
  { symbol: 'RELIANCE', price: '₹2,945.50', change: '+1.25%', positive: true },
  { symbol: 'AAPL', price: '$189.84', change: '+2.11%', positive: true },
  { symbol: 'ZOMATO', price: '₹186.20', change: '+4.85%', positive: true },
  { symbol: 'TSLA', price: '$177.46', change: '-1.42%', positive: false },
  { symbol: 'INFY', price: '₹1,535.00', change: '+0.72%', positive: true },
  { symbol: 'NVDA', price: '$875.12', change: '+5.48%', positive: true },
  { symbol: 'MSFT', price: '$421.90', change: '-0.32%', positive: false },
  { symbol: 'TATA MOTORS', price: '₹955.10', change: '+2.15%', positive: true },
  { symbol: 'GOOGL', price: '$173.50', change: '+1.64%', positive: true },
];

export default function Home() {
  const [state, setState] = useState<AppState>('idle');
  const [company, setCompany] = useState('');
  const [result, setResult] = useState<InvestmentVerdict | null>(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Handle client-side theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  // Update DOM when theme state changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  };

  const handleSearch = async (name: string) => {
    setCompany(name);
    setState('loading');
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: name }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Unknown server error');

      setResult(data);
      setState('result');
    } catch (err: any) {
      console.error('Frontend error:', err);
      setError(err.message ?? 'Something went wrong. Please check your environment keys and try again.');
      setState('error');
    }
  };

  const handleReset = () => {
    setState('idle');
    setResult(null);
    setCompany('');
  };

  return (
    <main className="min-h-screen relative bg-bg-app text-fg-app flex flex-col justify-between overflow-x-hidden selection:bg-teal-500/30">
      
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-18 right-6 p-2.5 bg-card-bg border border-card-border rounded-xl text-text-muted hover:text-teal-600 dark:hover:text-indigo-400 hover:border-teal-500/40 transition-all duration-300 shadow-md cursor-pointer z-20 flex items-center justify-center"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-teal-650" />}
      </button>

      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--radial-indigo)] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-[var(--radial-violet)] rounded-full blur-[150px] pointer-events-none" />

      {/* Marquee stock ticker */}
      <div className="w-full bg-ticker-bg border-b border-ticker-border py-2.5 overflow-hidden backdrop-blur-md relative z-10 select-none transition-colors duration-300">
        <div className="animate-marquee flex whitespace-nowrap">
          {/* Double content to loop seamlessly */}
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
            <div key={index} className="flex items-center gap-2 mx-8 text-xs font-mono">
              <span className="font-bold text-text-main">{item.symbol}</span>
              <span className="text-text-muted">{item.price}</span>
              <span className={item.positive ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main page content container */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-5xl w-full mx-auto px-4 py-16 relative z-10">
        
        {/* Header container (only show when idle or error) */}
        {(state === 'idle' || state === 'error') && (
          <div className="text-center mb-12 space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 dark:bg-indigo-500/10 border border-teal-500/30 dark:border-indigo-500/30 text-teal-700 dark:text-indigo-400 rounded-full text-xs font-semibold tracking-wider uppercase mb-2 animate-pulse-slow">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Investment Research Workspace</span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent pb-1 bg-gradient-to-r ${
              theme === 'dark'
                ? 'from-slate-100 via-indigo-200 to-indigo-400'
                : 'from-teal-800 via-cyan-900 to-amber-600'
            }`}>
              AI Investment Research Agent
            </h1>
            <p className="text-text-muted text-base md:text-lg leading-relaxed font-light">
              Enter any public company. Our agent executes parallel search protocols across financial records, news cycles, competitors, and risk dimensions, returning structured verdicts instantly.
            </p>
          </div>
        )}

        {/* States Injection */}
        {(state === 'idle' || state === 'error') && (
          <div className="w-full space-y-8">
            <SearchForm onSubmit={handleSearch} isLoading={false} />
            
            {state === 'error' && (
              <div className="max-w-2xl mx-auto bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 text-rose-700 dark:text-rose-300 text-sm flex gap-3 items-start glow-rose">
                <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-rose-800 dark:text-rose-250">Execution Blocked</p>
                  <p className="leading-relaxed font-light">{error}</p>
                </div>
              </div>
            )}

            {/* Feature explanations */}
            <div className="grid md:grid-cols-3 gap-6 pt-10 max-w-3xl mx-auto text-text-muted text-xs text-center border-t border-border-main">
              <div className="space-y-2">
                <div className="text-teal-700 dark:text-indigo-400 font-bold uppercase tracking-wider">Parallel Research</div>
                <p className="leading-relaxed font-light">Executes 4 Tavily searches concurrently (Financials, News, Peers, Risks) to compile comprehensive intelligence.</p>
              </div>
              <div className="space-y-2 border-y md:border-y-0 md:border-x border-border-main py-4 md:py-0 md:px-6">
                <div className="text-teal-700 dark:text-indigo-400 font-bold uppercase tracking-wider">Gemini Synthesis</div>
                <p className="leading-relaxed font-light">Processes search results with Google Gemini 2.5 Flash using structured analysis prompt logic.</p>
              </div>
              <div className="space-y-2">
                <div className="text-teal-700 dark:text-indigo-400 font-bold uppercase tracking-wider">Decisive Verdicts</div>
                <p className="leading-relaxed font-light">Returns binary Invest/Pass actions, custom confidence ratings, and fully classified pros and cons lists.</p>
              </div>
            </div>
          </div>
        )}

        {state === 'loading' && <LoadingState company={company} />}

        {state === 'result' && result && (
          <ResultsDashboard result={result} onReset={handleReset} />
        )}

      </div>

      {/* Footer bar */}
      <footer className="w-full bg-bg-app border-t border-border-main py-6 text-center text-xs text-text-dim select-none relative z-10 transition-colors duration-300">
        <p>© {new Date().getFullYear()} AI Investment Research Agent. Powered by LangGraph.js, Gemini, and Tavily.</p>
      </footer>
    </main>
  );
}
