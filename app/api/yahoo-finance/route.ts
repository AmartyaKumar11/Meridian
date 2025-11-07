import { NextRequest, NextResponse } from 'next/server';

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

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=${interval}`;
    
    console.log('Proxying Yahoo Finance request:', {
      symbol,
      interval,
      from: new Date(parseInt(period1) * 1000).toISOString(),
      to: new Date(parseInt(period2) * 1000).toISOString(),
    });

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
        { status: 200 } // Return 200 so client can handle the error message
      );
    }

    const data = await response.json();
    
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
