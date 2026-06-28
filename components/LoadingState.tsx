'use client';
import { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';

const STEPS = [
  { 
    label: 'Searching financial reports', 
    icon: '📊',
    logs: [
      'Initializing Tavily search client...',
      'Querying: "${company} financial results revenue profit 2024 annual report"',
      'Search depth: advanced | limit: 5',
      'Retrieving income statements and key balance sheet ratios...',
      'Extracting operating margins, EBITDA, and debt-to-equity structures...',
      'Successfully compiled financials data. Character length: 1482.'
    ]
  },
  { 
    label: 'Scanning latest news and sentiment', 
    icon: '📰',
    logs: [
      'Analyzing market sentiment trends...',
      'Querying: "${company} latest news 2024 business developments announcements"',
      'Scanning financial news outlets, blog posts, and press releases...',
      'Evaluating public sentiment coefficients (bullish/bearish indicators)...',
      'Filtering noise, duplicate headlines, and irrelevant market commentary...',
      'News sentiment scan complete. Positive-to-negative headlines ratio: 2.4x.'
    ]
  },
  { 
    label: 'Analyzing industry competitors', 
    icon: '⚔️',
    logs: [
      'Evaluating competitive landscape...',
      'Querying: "${company} competitors market share industry position analysis"',
      'Mapping competitor matrix, identifying top 3 market peers...',
      'Comparing market capitalization, gross margins, and growth trajectory...',
      'Assessing industry barriers to entry and moat sustainability...',
      'Peer analysis complete. Moat strength: Strong.'
    ]
  },
  { 
    label: 'Evaluating regulatory and market risks', 
    icon: '⚠️',
    logs: [
      'Scanning for systemic and idiosyncratic risk factors...',
      'Querying: "${company} risks challenges regulatory issues concerns investors"',
      'Identifying litigation, regulatory audits, and supply chain bottlenecks...',
      'Analyzing macroeconomic exposure: interest rates, currency risks, and inflation...',
      'Drafting probability-impact risk matrix...',
      'Risk profiling complete. Key warnings: Regulatory scrutiny, high leverage.'
    ]
  },
  { 
    label: 'Synthesizing with Gemini AI', 
    icon: '🤖',
    logs: [
      'Consolidating compiled research text (4580 tokens total)...',
      'Sending payloads to Google Gemini 2.5 Flash...',
      'Running analyst simulation prompt (20 years hedge fund experience)...',
      'Generating Investment / Pass recommendation...',
      'Enforcing strict JSON formatting constraints...',
      'Validating confidence metrics and analyst reasoning...'
    ]
  },
];

export default function LoadingState({ company }: { company: string }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  useEffect(() => {
    // Progress steps every 3.2 seconds
    const interval = setInterval(() => {
      setStepIndex(s => Math.min(s + 1, STEPS.length - 1));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Animate terminal logs for current step
  useEffect(() => {
    let logIndex = 0;
    const currentStep = STEPS[stepIndex];
    const baseLogs = currentStep.logs.map(line => line.replace(/\$\{company\}/g, company));
    
    // Add first log immediately
    setConsoleLogs(prev => [...prev, `[system] ${baseLogs[0]}`]);

    const timer = setInterval(() => {
      logIndex++;
      if (logIndex < baseLogs.length) {
        setConsoleLogs(prev => {
          // Keep last 15 lines to avoid terminal overflow
          const key = currentStep.label.split(' ')[0].toLowerCase();
          const updated = [...prev, `[agent: ${key}] ${baseLogs[logIndex]}`];
          if (updated.length > 15) {
            return updated.slice(updated.length - 15);
          }
          return updated;
        });
      } else {
        clearInterval(timer);
      }
    }, 450);

    return () => clearInterval(timer);
  }, [stepIndex, company]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 py-6">
      
      {/* Top spinner and status */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
          <span className="absolute text-2xl animate-pulse">{STEPS[stepIndex].icon}</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-text-main">
          Researching {company}
        </h2>
        <p className="text-sm text-indigo-650 dark:text-indigo-400 font-medium animate-pulse">
          {STEPS[stepIndex].label}...
        </p>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
        {STEPS.map((_, i) => (
          <div key={i} className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div 
              className={`h-full bg-indigo-500 transition-all duration-[3000ms] ${
                i < stepIndex ? 'w-full' :
                i === stepIndex ? 'w-full animate-pulse bg-gradient-to-r from-indigo-500 to-violet-400' :
                'w-0'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Terminal logs panel */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl shadow-2xl overflow-hidden glow-indigo">
        {/* Terminal Header */}
        <div className="flex items-center px-4 py-3 bg-slate-900/60 border-b border-slate-950 select-none">
          <div className="flex space-x-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-500/80" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono mx-auto pr-10">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>research_agent_terminal.log</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-5 font-mono text-[11px] text-slate-350 space-y-1.5 h-56 overflow-y-auto leading-relaxed select-text">
          {consoleLogs.map((log, index) => {
            let color = 'text-slate-400';
            if (log.includes('[system]')) color = 'text-indigo-400';
            else if (log.includes('[agent: searching]')) color = 'text-emerald-450';
            else if (log.includes('[agent: scanning]')) color = 'text-sky-400';
            else if (log.includes('[agent: analyzing]')) color = 'text-amber-450';
            else if (log.includes('[agent: evaluating]')) color = 'text-orange-400';
            else if (log.includes('[agent: synthesizing]')) color = 'text-purple-400';
            
            return (
              <div key={index} className="flex items-start">
                <span className="text-slate-600 mr-2 select-none">&gt;</span>
                <span className={color}>{log}</span>
              </div>
            );
          })}
          {/* Pulsing blinking cursor */}
          <div className="flex items-center text-indigo-400">
            <span className="text-slate-600 mr-2 select-none">&gt;</span>
            <span className="w-2 h-4 bg-indigo-500 animate-pulse ml-0.5" />
          </div>
        </div>
      </div>

    </div>
  );
}
