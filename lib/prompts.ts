export function buildAnalysisPrompt(
  company: string,
  research: {
    financials: string;
    news: string;
    competitors: string;
    risks: string;
  }
): string {
  return `You are a senior investment analyst with 20 years of experience at a top-tier hedge fund. Analyze the following research on "${company}" and provide a structured investment recommendation.

## RESEARCH DATA

### FINANCIALS
${research.financials}

### RECENT NEWS & SENTIMENT
${research.news}

### COMPETITIVE LANDSCAPE
${research.competitors}

### RISKS & CONCERNS
${research.risks}

## YOUR TASK

Based on this research, provide a complete investment analysis in the following JSON format. Return ONLY valid JSON, no markdown, no explanation outside the JSON:

{
  "verdict": "INVEST" or "PASS",
  "confidenceScore": <integer 0-100>,
  "summary": "<2-3 sentence executive summary of your recommendation>",
  "reasoning": "<3-4 sentence detailed reasoning explaining the verdict>",
  "pros": ["<pro 1>", "<pro 2>", "<pro 3>"],
  "cons": ["<con 1>", "<con 2>", "<con 3>"],
  "risks": ["<risk 1>", "<risk 2>", "<risk 3>"],
  "research": [
    {
      "category": "financials",
      "query": "Financial health and performance",
      "findings": "<2-3 sentence summary of financial findings>",
      "sentiment": "positive" or "neutral" or "negative"
    },
    {
      "category": "news",
      "query": "Recent news and market sentiment",
      "findings": "<2-3 sentence summary of news findings>",
      "sentiment": "positive" or "neutral" or "negative"
    },
    {
      "category": "competitors",
      "query": "Competitive position and market share",
      "findings": "<2-3 sentence summary of competitive findings>",
      "sentiment": "positive" or "neutral" or "negative"
    },
    {
      "category": "risks",
      "query": "Key risks and concerns",
      "findings": "<2-3 sentence summary of risk findings>",
      "sentiment": "positive" or "neutral" or "negative"
    }
  ]
}

Decision guidelines:
- INVEST (score 60-100): Strong fundamentals, positive news, competitive moat, manageable risks
- PASS (score 0-59): Weak financials, negative sentiment, serious risks, or insufficient data
- Be decisive. A score of exactly 50 is not acceptable.
- Base the verdict strictly on the research data provided, not prior knowledge.`;
}
