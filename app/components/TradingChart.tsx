"use client";

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface TradingChartProps {
  symbol: string;
  interval: string;
}

export default function TradingChart({ symbol, interval }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const allDataRef = useRef<any[]>([]);
  const oldestTimestampRef = useRef<number>(0);
  const isLoadingMoreRef = useRef<boolean>(false);

  // Convert interval to Finnhub resolution and timestamp range
  const getTimeRange = (interval: string) => {
    const now = Math.floor(Date.now() / 1000);
    let from = now;
    let resolution = '1';

    switch(interval) {
      case '1d':
        from = now - (24 * 60 * 60);
        resolution = '1'; // 1 minute
        break;
      case '5d':
        from = now - (5 * 24 * 60 * 60);
        resolution = '5'; // 5 minutes
        break;
      case '1m':
        from = now - (30 * 24 * 60 * 60);
        resolution = '15'; // 15 minutes
        break;
      case '3m':
        from = now - (90 * 24 * 60 * 60);
        resolution = '60'; // 1 hour
        break;
      case '1y':
        from = now - (365 * 24 * 60 * 60);
        resolution = 'D'; // Daily
        break;
      case '5y':
        from = now - (5 * 365 * 24 * 60 * 60);
        resolution = 'W'; // Weekly
        break;
      case '10y':
        from = now - (10 * 365 * 24 * 60 * 60);
        resolution = 'M'; // Monthly
        break;
      default:
        from = now - (24 * 60 * 60);
        resolution = '1';
    }

    return { from, to: now, resolution };
  };

  // Fetch data from Finnhub
  const fetchChartData = async (fromTimestamp?: number, appendData: boolean = false) => {
    if (!appendData) setIsLoading(true);
    
    try {
      const { from, to, resolution } = getTimeRange(interval);
      const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
      
      // Use provided timestamp or default
      const startTime = fromTimestamp || from;
      
      // For NSE stocks, try without the .NS suffix for Finnhub
      let finnhubSymbol = symbol.replace('.NS', '');
      
      const response = await fetch(
        `https://finnhub.io/api/v1/stock/candle?symbol=${finnhubSymbol}&resolution=${resolution}&from=${startTime}&to=${to}&token=${apiKey}`
      );
      
      const data = await response.json();

      if (data.s === 'ok' && data.t && data.t.length > 0) {
        const candlestickData = data.t.map((timestamp: number, index: number) => ({
          time: timestamp,
          open: data.o[index],
          high: data.h[index],
          low: data.l[index],
          close: data.c[index],
        }));

        if (appendData) {
          // Prepend older data
          allDataRef.current = [...candlestickData, ...allDataRef.current];
          oldestTimestampRef.current = candlestickData[0]?.time || oldestTimestampRef.current;
        } else {
          // Initial load
          allDataRef.current = candlestickData;
          oldestTimestampRef.current = candlestickData[0]?.time || 0;
        }

        if (candlestickSeriesRef.current) {
          candlestickSeriesRef.current.setData(allDataRef.current);
        }
      } else {
        // If no data from Finnhub, generate sample data for demo
        console.warn('No data from Finnhub, using sample data for:', symbol);
        generateSampleData(fromTimestamp, appendData);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      generateSampleData(fromTimestamp, appendData);
    } finally {
      if (!appendData) setIsLoading(false);
    }
  };

  // Generate sample candlestick data for demo purposes
  const generateSampleData = (fromTimestamp?: number, appendData: boolean = false) => {
    const now = Math.floor(Date.now() / 1000);
    const { from } = getTimeRange(interval);
    const dataPoints = 100;
    
    let startTime = fromTimestamp || from;
    let endTime = appendData ? oldestTimestampRef.current : now;
    
    const timeStep = Math.floor((endTime - startTime) / dataPoints);
    
    let price = appendData 
      ? (allDataRef.current[0]?.open || 1000)
      : 1000 + Math.random() * 500;
    
    const sampleData = [];

    for (let i = 0; i < dataPoints; i++) {
      const timestamp = startTime + (i * timeStep);
      const change = (Math.random() - 0.5) * 20;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * 10;
      const low = Math.min(open, close) - Math.random() * 10;

      sampleData.push({
        time: timestamp,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
      });

      price = close;
    }

    if (appendData) {
      // Prepend older data
      allDataRef.current = [...sampleData, ...allDataRef.current];
      oldestTimestampRef.current = sampleData[0]?.time || oldestTimestampRef.current;
    } else {
      // Initial load
      allDataRef.current = sampleData;
      oldestTimestampRef.current = sampleData[0]?.time || 0;
    }

    if (candlestickSeriesRef.current) {
      candlestickSeriesRef.current.setData(allDataRef.current);
      console.log('Set chart data:', allDataRef.current.length, 'candles');
    }
  };

  // Load more historical data when scrolling back
  const loadMoreHistoricalData = async () => {
    if (!oldestTimestampRef.current || isLoadingMoreRef.current) return;
    
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    
    // Calculate how far back to fetch based on interval
    const { resolution } = getTimeRange(interval);
    let additionalTime = 0;
    
    switch(interval) {
      case '1d':
        additionalTime = 24 * 60 * 60; // 1 more day
        break;
      case '5d':
        additionalTime = 5 * 24 * 60 * 60; // 5 more days
        break;
      case '1m':
        additionalTime = 30 * 24 * 60 * 60; // 1 more month
        break;
      case '3m':
        additionalTime = 90 * 24 * 60 * 60; // 3 more months
        break;
      case '1y':
        additionalTime = 365 * 24 * 60 * 60; // 1 more year
        break;
      case '5y':
        additionalTime = 5 * 365 * 24 * 60 * 60; // 5 more years
        break;
      case '10y':
        additionalTime = 10 * 365 * 24 * 60 * 60; // 10 more years
        break;
      default:
        additionalTime = 24 * 60 * 60;
    }
    
    const newFrom = oldestTimestampRef.current - additionalTime;
    await fetchChartData(newFrom, true);
    
    isLoadingMoreRef.current = false;
    setIsLoadingMore(false);
  };

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) {
      console.log('No chart container ref');
      return;
    }

    console.log('Initializing chart with dimensions:', {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight
    });

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0C0E12' },
        textColor: '#9B9B9B',
      },
      grid: {
        vertLines: { color: '#1A1D24' },
        horzLines: { color: '#1A1D24' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#2B2B43',
      },
      rightPriceScale: {
        borderColor: '#2B2B43',
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: '#758696',
          style: 3,
        },
        horzLine: {
          width: 1,
          color: '#758696',
          style: 3,
        },
      },
    });

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#00D09C',
      downColor: '#EB4D5C',
      borderUpColor: '#00D09C',
      borderDownColor: '#EB4D5C',
      wickUpColor: '#00D09C',
      wickDownColor: '#EB4D5C',
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Subscribe to visible time range changes
    chart.timeScale().subscribeVisibleLogicalRangeChange(() => {
      const logicalRange = chart.timeScale().getVisibleLogicalRange();
      if (logicalRange !== null) {
        // If user scrolled to the left edge (viewing oldest data), load more historical data
        if (logicalRange.from < 5) {
          loadMoreHistoricalData();
        }
      }
    });

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Fetch initial data
    fetchChartData();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Fetch data when symbol or interval changes
  useEffect(() => {
    if (chartRef.current && candlestickSeriesRef.current) {
      // Reset data cache when symbol or interval changes
      allDataRef.current = [];
      oldestTimestampRef.current = 0;
      fetchChartData();
    }
  }, [symbol, interval]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0C0E12] z-10">
          <div className="text-gray-400 text-sm">Loading chart data...</div>
        </div>
      )}
      {isLoadingMore && !isLoading && (
        <div className="absolute top-4 left-4 bg-[#1A1D24] text-gray-300 text-xs px-3 py-2 rounded-md shadow-lg z-10 flex items-center space-x-2">
          <div className="w-3 h-3 border-2 border-[#00D09C] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading historical data...</span>
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full min-h-[400px]" />
    </div>
  );
}
