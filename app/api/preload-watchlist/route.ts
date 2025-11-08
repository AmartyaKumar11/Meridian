import { NextResponse } from 'next/server';

// Preload caching is disabled. Redis will only cache stocks on-demand when visited.
export async function GET() {
  return NextResponse.json({
    message: 'Preload caching is disabled. Stocks are cached on-demand when visited.'
  });
}
