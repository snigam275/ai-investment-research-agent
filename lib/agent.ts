import { StateGraph, Annotation, START, END } from '@langchain/langgraph';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { researchCompany } from './tools';
import { buildAnalysisPrompt } from './prompts';
import { ResearchCategory, InvestmentVerdict } from './types';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Define LangGraph State using Annotation
const AgentStateAnnotation = Annotation.Root({
  company: Annotation<string>({
    reducer: (left, right) => right ?? left,
    default: () => '',
  }),
  research: Annotation<ResearchCategory[]>({
    reducer: (left, right) => right ?? left,
    default: () => [],
  }),
  verdict: Annotation<InvestmentVerdict | null>({
    reducer: (left, right) => right ?? left,
    default: () => null,
  }),
  error: Annotation<string | null>({
    reducer: (left, right) => right ?? left,
    default: () => null,
  }),
});

type AgentStateType = typeof AgentStateAnnotation.State;

// Node 1: Research the company using Tavily
async function researchNode(state: AgentStateType) {
  const { company } = state;
  if (!company) {
    throw new Error('No company name provided to research node');
  }

  try {
    const raw = await researchCompany(company);

    const research: ResearchCategory[] = [
      {
        category: 'financials' as const,
        query: `${company} financials`,
        findings: raw.financials.slice(0, 1500),
        sentiment: 'neutral' as const,
      },
      {
        category: 'news' as const,
        query: `${company} news`,
        findings: raw.news.slice(0, 1500),
        sentiment: 'neutral' as const,
      },
      {
        category: 'competitors' as const,
        query: `${company} competitors`,
        findings: raw.competitors.slice(0, 1500),
        sentiment: 'neutral' as const,
      },
      {
        category: 'risks' as const,
        query: `${company} risks`,
        findings: raw.risks.slice(0, 1500),
        sentiment: 'neutral' as const,
      },
    ];

    return { research };
  } catch (err: any) {
    console.error('Research node error:', err);
    return { error: `Failed to research company: ${err.message || err}` };
  }
}

// Node 2: Analyze research with Gemini and produce verdict
async function analysisNode(state: AgentStateType) {
  const { company, research, error } = state;

  if (error) {
    return { verdict: null };
  }

  if (!process.env.GOOGLE_API_KEY) {
    return { error: 'Gemini API key is missing. Please set GOOGLE_API_KEY.' };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const prompt = buildAnalysisPrompt(company, {
      financials: research.find(r => r.category === 'financials')?.findings ?? '',
      news: research.find(r => r.category === 'news')?.findings ?? '',
      competitors: research.find(r => r.category === 'competitors')?.findings ?? '',
      risks: research.find(r => r.category === 'risks')?.findings ?? '',
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown code fences if present
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(jsonText);

    const verdict: InvestmentVerdict = {
      company,
      verdict: parsed.verdict,
      confidenceScore: parsed.confidenceScore,
      summary: parsed.summary,
      reasoning: parsed.reasoning,
      pros: parsed.pros || [],
      cons: parsed.cons || [],
      risks: parsed.risks || [],
      research: parsed.research || [],
      timestamp: new Date().toISOString(),
    };

    return { verdict };
  } catch (err: any) {
    console.error('Analysis node error:', err);
    return { error: `Failed to analyze company findings: ${err.message || err}` };
  }
}

// Build the LangGraph state machine
function buildGraph() {
  const graph = new StateGraph(AgentStateAnnotation)
    .addNode('conductResearch', researchNode)
    .addNode('analysis', analysisNode)
    .addEdge(START, 'conductResearch')
    .addEdge('conductResearch', 'analysis')
    .addEdge('analysis', END);

  return graph.compile();
}

export async function runInvestmentAgent(company: string): Promise<InvestmentVerdict> {
  const app = buildGraph();

  const result = await app.invoke({
    company,
    research: [],
    verdict: null,
    error: null,
  });

  if (result.error) {
    throw new Error(result.error);
  }

  if (!result.verdict) {
    throw new Error('Agent did not produce a verdict');
  }

  return result.verdict;
}
