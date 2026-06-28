import { NextRequest, NextResponse } from 'next/server';
import { runInvestmentAgent } from '@/lib/agent';

export const maxDuration = 60; // Allow up to 60 seconds for Vercel

export async function POST(req: NextRequest) {
  try {
    const { company } = await req.json();

    if (!company || typeof company !== 'string' || company.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide a valid company name (at least 2 characters).' },
        { status: 400 }
      );
    }

    const verdict = await runInvestmentAgent(company.trim());

    return NextResponse.json(verdict);
  } catch (error: any) {
    console.error('Agent error:', error);
    return NextResponse.json(
      { error: error.message ?? 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
