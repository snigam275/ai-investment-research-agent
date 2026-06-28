import { NextResponse } from 'next/server';
import { getTopVerdicts } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Prevent static generation caching

export async function GET() {
  try {
    const verdicts = await getTopVerdicts(10);
    return NextResponse.json(verdicts);
  } catch (error: any) {
    console.error('Error fetching top verdicts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch top verdicts' },
      { status: 500 }
    );
  }
}
