import { NextRequest, NextResponse } from 'next/server';
import { runInvestmentAgent } from '@/lib/agent';
import { getCachedVerdict, saveVerdictToCache } from '@/lib/db';

export const maxDuration = 60; // Allow up to 60 seconds for Vercel
export const dynamic = 'force-dynamic'; // Never statically cache this route

export async function POST(req: NextRequest) {
  try {
    const { company } = await req.json();

    if (!company || typeof company !== 'string' || company.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide a valid company name (at least 2 characters).' },
        { status: 400 }
      );
    }

    const trimmedCompany = company.trim();

    // 1. Check database cache first
    try {
      const cached = await getCachedVerdict(trimmedCompany);
      if (cached) {
        console.log(`[Cache Hit] Serving cached verdict for ${trimmedCompany}`);
        return NextResponse.json(cached);
      }
    } catch (cacheError) {
      console.warn('[Cache Read Failed] Continuing to agent execution:', cacheError);
    }

    // 2. Cache Miss: Run LangGraph Agent
    console.log(`[Cache Miss] Running investment agent for ${trimmedCompany}`);
    const verdict = await runInvestmentAgent(trimmedCompany);

    // 3. Save verdict in cache database
    try {
      await saveVerdictToCache(verdict);
    } catch (saveError) {
      console.warn('[Cache Save Failed] Result returned but not cached:', saveError);
    }

    return NextResponse.json(verdict);
  } catch (error: any) {
    console.error('Agent route error:', error);
    return NextResponse.json(
      { error: error.message ?? 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
