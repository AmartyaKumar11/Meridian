export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

// In-memory cache for stock data
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const period1 = searchParams.get('period1');
    const period2 = searchParams.get('period2');
    const interval = searchParams.get('interval');

    if (!symbol || !period1 || !period2 || !interval) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check in-memory cache
    const cacheKey = `${symbol}:${period1}:${period2}:${interval}`;
    const cached = cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      console.log('✅ Serving from in-memory cache:', cacheKey);
      return NextResponse.json(cached.data);
    }

    // For intraday intervals (5m, 15m, etc.), use range parameter for better results
    const intradayIntervals = ['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h'];
    const useRangeParam = intradayIntervals.includes(interval);
    
    let url: string;
    if (useRangeParam) {
      // Use range parameter for intraday data
      const range = searchParams.get('range') || '1d';
      url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
      console.log('Proxying Yahoo Finance request (range mode):', {
        symbol,
        interval,
        range,
      });
    } else {
      // Use period1/period2 for daily/weekly data
      url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=${interval}`;
      console.log('Proxying Yahoo Finance request (period mode):', {
        symbol,
        interval,
        from: new Date(parseInt(period1) * 1000).toISOString(),
        to: new Date(parseInt(period2) * 1000).toISOString(),
      });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Yahoo Finance API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return NextResponse.json(
        { chart: { error: 'Yahoo Finance API error', result: null } },
        { status: 200 }
      );
    }

    const data = await response.json();
    
    // Cache the successful response
    if (data?.chart?.result) {
      cache.set(cacheKey, { data, timestamp: Date.now() });
      console.log('💾 Cached stock data for:', cacheKey);
    }
    
    // Log if data structure is unexpected
    if (!data?.chart?.result) {
      console.error('Unexpected Yahoo Finance response structure:', data);
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Yahoo Finance data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Yahoo Finance' },
      { status: 500 }
    );
  }
}
