import { tavily } from '@tavily/core';

const client = tavily({ apiKey: process.env.TAVILY_API_KEY || '' });

export async function searchWeb(query: string, maxResults = 5): Promise<string> {
  if (!process.env.TAVILY_API_KEY) {
    console.warn('Tavily API key is missing. Skipping search.');
    return 'Search failed: Tavily API key is missing. Please set TAVILY_API_KEY.';
  }

  try {
    const response = await client.search(query, {
      maxResults,
      searchDepth: 'advanced',
      includeAnswer: true,
    });

    const answer = response.answer ? `Summary: ${response.answer}\n\n` : '';
    const results = (response.results || [])
      .map((r, i) => `[${i + 1}] ${r.title}\n${r.content}\nSource: ${r.url}`)
      .join('\n\n');

    return answer + results;
  } catch (error) {
    console.error('Tavily search error:', error);
    return `Search failed: ${error}`;
  }
}

export async function researchCompany(company: string) {
  const queries = {
    financials: `${company} financial results revenue profit 2024 annual report`,
    news: `${company} latest news 2024 business developments announcements`,
    competitors: `${company} competitors market share industry position analysis`,
    risks: `${company} risks challenges regulatory issues concerns investors`,
  };

  const [financials, news, competitors, risks] = await Promise.all([
    searchWeb(queries.financials),
    searchWeb(queries.news),
    searchWeb(queries.competitors),
    searchWeb(queries.risks),
  ]);

  return { financials, news, competitors, risks };
}
