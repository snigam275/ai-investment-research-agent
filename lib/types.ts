export interface ResearchCategory {
  category: 'financials' | 'news' | 'competitors' | 'risks';
  query: string;
  findings: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface InvestmentVerdict {
  company: string;
  verdict: 'INVEST' | 'PASS';
  confidenceScore: number; // 0-100
  summary: string;
  reasoning: string;
  pros: string[];
  cons: string[];
  risks: string[];
  research: ResearchCategory[];
  timestamp: string;
}

export interface AgentState {
  company: string;
  research: ResearchCategory[];
  verdict: InvestmentVerdict | null;
  error: string | null;
}
