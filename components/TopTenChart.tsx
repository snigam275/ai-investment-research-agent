'use client';
import { useState } from 'react';
import { InvestmentVerdict } from '@/lib/types';
import { ChevronRight, BarChart2 } from 'lucide-react';

interface Props {
  data: InvestmentVerdict[];
  onSelectCompany: (verdict: InvestmentVerdict) => void;
}

export default function TopTenChart({ data, onSelectCompany }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-card-bg border border-card-border rounded-3xl p-10 text-center space-y-4 max-w-2xl mx-auto shadow-sm transition-colors duration-300">
        <div className="w-12 h-12 bg-teal-500/10 dark:bg-indigo-500/10 text-teal-650 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto text-xl animate-pulse">
          <BarChart2 className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-text-main">No Historical Research Found</h3>
        <p className="text-xs text-text-muted max-w-sm mx-auto font-light leading-relaxed">
          Analyze a company name to initiate research. Once compiled, it will be stored in your database and appear in this visual analyst chart!
        </p>
      </div>
    );
  }

  // Dimension settings
  const width = 600;
  const height = 240;
  const paddingX = 40;
  const paddingY = 35;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Calculate coordinates
  const points = data.map((item, index) => {
    const x = paddingX + (data.length > 1 ? (index / (data.length - 1)) * chartWidth : chartWidth / 2);
    const y = height - paddingY - (item.confidenceScore / 100) * chartHeight;
    return { x, y, item, index };
  });

  // Construct SVG Path
  let linePath = '';
  let areaPath = '';
  if (points.length > 1) {
    linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    // Area path goes to bottom X axis
    areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  }

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="w-full bg-card-bg border border-card-border rounded-3xl p-6 shadow-md transition-colors duration-300 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <h3 className="font-bold text-sm text-text-main uppercase tracking-widest">Research Leaderboard</h3>
          <p className="text-[11px] text-text-muted font-light">Researched companies ranked by confidence metrics</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-text-muted">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          <span>INVEST</span>
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full ml-2" />
          <span>PASS</span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[500px] w-full relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[25, 50, 75, 100].map(level => {
              const y = height - paddingY - (level / 100) * chartHeight;
              return (
                <g key={level} className="opacity-40">
                  <line 
                    x1={paddingX} 
                    y1={y} 
                    x2={width - paddingX} 
                    y2={y} 
                    stroke="currentColor" 
                    strokeDasharray="4 4" 
                    strokeWidth="1"
                    className="text-border-main"
                  />
                  <text 
                    x={paddingX - 10} 
                    y={y + 4} 
                    textAnchor="end" 
                    fontSize="9" 
                    className="fill-text-dim font-mono font-bold"
                  >
                    {level}
                  </text>
                </g>
              );
            })}

            {/* Render Area & Line if more than 1 point */}
            {points.length > 1 && (
              <>
                <path d={areaPath} fill="url(#chartGradient)" />
                <path d={linePath} fill="none" stroke="url(#strokeGradient)" strokeWidth="3" strokeLinecap="round" />
              </>
            )}

            {/* Nodes */}
            {points.map((p) => {
              const isHovered = hoveredIndex === p.index;
              const nodeColor = p.item.verdict === 'INVEST' ? '#10b981' : '#f43f5e';
              return (
                <g key={p.index} className="transition-all duration-300">
                  {/* Glowing shadow circle */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 12 : 7}
                    fill={nodeColor}
                    opacity={isHovered ? 0.3 : 0.15}
                    className="transition-all duration-300"
                  />
                  {/* Outer circle */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 4}
                    fill={nodeColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="transition-all duration-300 cursor-pointer"
                  />
                  {/* Company Name X label */}
                  <text
                    x={p.x}
                    y={height - paddingY + 18}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    className="fill-text-muted hover:fill-text-main transition-colors duration-300 cursor-pointer"
                    onClick={() => onSelectCompany(p.item)}
                  >
                    {p.item.company.length > 9 ? `${p.item.company.slice(0, 8)}…` : p.item.company}
                  </text>

                  {/* Large invisible interactive hover circle */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="24"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(p.index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => onSelectCompany(p.item)}
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Floating Highlight Card on Hover */}
      {activePoint && (
        <div 
          className="absolute z-20 bottom-24 left-1/2 transform -translate-x-1/2 bg-slate-950/95 dark:bg-slate-900/95 border border-slate-800 dark:border-slate-850 rounded-2xl p-4 shadow-2xl w-64 text-slate-100 glow-indigo animate-fade-in"
          style={{ pointerEvents: 'auto' }}
          onMouseEnter={() => setHoveredIndex(activePoint.index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-xs text-white truncate max-w-[150px]">{activePoint.item.company}</h4>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
              activePoint.item.verdict === 'INVEST' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {activePoint.item.verdict}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Confidence Rating:</span>
              <span className="font-bold text-slate-200">{activePoint.item.confidenceScore}%</span>
            </div>
            
            {/* Top Pros as bullets */}
            {activePoint.item.pros && activePoint.item.pros.length > 0 && (
              <div className="space-y-1">
                <span className="text-[9px] text-emerald-450 font-bold uppercase tracking-wider block">Key Strength:</span>
                <p className="text-[10px] text-slate-300 leading-relaxed italic">
                  &ldquo;{activePoint.item.pros[0]}&rdquo;
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectCompany(activePoint.item)}
            className="w-full py-1.5 bg-teal-650 hover:bg-teal-500 text-white font-bold rounded-lg text-[10px] transition-colors flex items-center justify-center gap-1 cursor-pointer border-0"
          >
            <span>View Full Report</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
