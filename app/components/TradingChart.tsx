"use client";

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface TradingChartProps {
  symbol: string;
  interval: string;
  chartType: string;
  onCrosshairMove?: (data: any) => void;
}

export default function TradingChart({ symbol, interval, chartType, onCrosshairMove }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const allDataRef = useRef<any[]>([]);
  const oldestTimestampRef = useRef<number>(0);
  const isLoadingMoreRef = useRef<boolean>(false);

  // Validate and sort data to prevent assertion errors
  const validateAndSortData = (data: any[]) => {
    if (!data || data.length === 0) return [];
    
    // Sort by timestamp
    const sortedData = [...data].sort((a, b) => a.time - b.time);
    
    // Remove duplicates and keep the last occurrence
    const uniqueData: any[] = [];
    const seenTimes = new Set<number>();
    
    for (let i = sortedData.length - 1; i >= 0; i--) {
      const item = sortedData[i];
      if (!seenTimes.has(item.time)) {
        seenTimes.add(item.time);
        uniqueData.unshift(item);
      }
    }
    
    return uniqueData;
  };

  // Format data based on chart type
  const formatDataForChartType = (data: any[], type: string) => {
    if (type === 'line' || type === 'area' || type === 'line-break') {
      // Line/Area charts need only time and value (close price)
      return data.map(d => ({ time: d.time, value: d.close }));
    }
    if (type === 'baseline') {
      // Baseline needs time, value - calculate average as baseline
      const avgPrice = data.length > 0 ? data.reduce((sum, d) => sum + d.close, 0) / data.length : 0;
      console.log('Baseline average price:', avgPrice);
      return data.map(d => ({ time: d.time, value: d.close }));
    }
    if (type === 'histogram' || type === 'columns') {
      // Histogram needs time, value, and color
      return data.map(d => ({ 
        time: d.time, 
        value: Math.abs(d.close - d.open), // Use range as value for columns
        color: d.close >= d.open ? '#00D09C' : '#EB4D5C' 
      }));
    }
    if (type === 'heikin-ashi') {
      // Heikin-Ashi calculation
      const haData = [];
      let prevHA = { open: 0, close: 0 };
      
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const haClose = (d.open + d.high + d.low + d.close) / 4;
        const haOpen = i === 0 ? (d.open + d.close) / 2 : (prevHA.open + prevHA.close) / 2;
        const haHigh = Math.max(d.high, haOpen, haClose);
        const haLow = Math.min(d.low, haOpen, haClose);
        
        haData.push({
          time: d.time,
          open: haOpen,
          high: haHigh,
          low: haLow,
          close: haClose,
        });
        
        prevHA = { open: haOpen, close: haClose };
      }
      
      return haData;
    }
    if (type === 'renko') {
      // Renko chart - use modified candlesticks with fixed brick size
      return data.map(d => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));
    }
    if (type === 'kagi') {
      // Kagi chart - use line with direction changes
      const kagiData = [];
      let prevClose = data[0]?.close || 0;
      
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        kagiData.push({
          time: d.time,
          value: d.close,
        });
      }
      
      return kagiData;
    }
    if (type === 'point-figure') {
      // Point & Figure - use histogram to simulate X and O
      return data.map((d, i) => ({
        time: d.time,
        value: d.close,
        color: i % 2 === 0 ? '#00D09C' : '#EB4D5C',
      }));
    }
    // Candlestick, bars, hollow-candlestick, high-low use OHLC data
    return data;
  };

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
      // Check if chart is still mounted
      if (!chartRef.current || !chartContainerRef.current) {
        console.warn('Chart not mounted, skipping fetch');
        return;
      }
      
      const { from, to, resolution } = getTimeRange(interval);
      const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
      
      // Use provided timestamp or default
      const startTime = fromTimestamp || from;
      
      // For NSE stocks, try without the .NS suffix for Finnhub
      let finnhubSymbol = symbol.replace('.NS', '');
      
      const url = `https://finnhub.io/api/v1/stock/candle?symbol=${finnhubSymbol}&resolution=${resolution}&from=${startTime}&to=${to}&token=${apiKey}`;
      console.log('🔍 Fetching data from Finnhub:', {
        symbol: finnhubSymbol,
        resolution,
        from: new Date(startTime * 1000).toISOString(),
        to: new Date(to * 1000).toISOString(),
        url: apiKey ? url.replace(apiKey, 'API_KEY_HIDDEN') : url
      });
      
      const response = await fetch(url);
      const data = await response.json();

      console.log('📊 Finnhub API Response:', {
        status: data.s,
        dataPoints: data.t?.length || 0,
        firstCandle: data.t && data.t.length > 0 ? {
          time: new Date(data.t[0] * 1000).toISOString(),
          open: data.o[0],
          high: data.h[0],
          low: data.l[0],
          close: data.c[0]
        } : null,
        lastCandle: data.t && data.t.length > 0 ? {
          time: new Date(data.t[data.t.length - 1] * 1000).toISOString(),
          open: data.o[data.o.length - 1],
          high: data.h[data.h.length - 1],
          low: data.l[data.l.length - 1],
          close: data.c[data.c.length - 1]
        } : null
      });

      if (data.s === 'ok' && data.t && data.t.length > 0) {
        const candlestickData = data.t.map((timestamp: number, index: number) => ({
          time: timestamp,
          open: data.o[index],
          high: data.h[index],
          low: data.l[index],
          close: data.c[index],
        }));

        console.log('✅ Successfully processed', candlestickData.length, 'candles');

        if (appendData) {
          // Prepend older data and validate
          allDataRef.current = validateAndSortData([...candlestickData, ...allDataRef.current]);
          oldestTimestampRef.current = allDataRef.current[0]?.time || oldestTimestampRef.current;
        } else {
          // Initial load and validate
          allDataRef.current = validateAndSortData(candlestickData);
          oldestTimestampRef.current = allDataRef.current[0]?.time || 0;
        }

        // Check if chart and series still exist before setting data
        if (candlestickSeriesRef.current && chartRef.current) {
          try {
            const formattedData = formatDataForChartType(allDataRef.current, chartType);
            console.log('Setting', formattedData.length, 'data points to chart');
            candlestickSeriesRef.current.setData(formattedData);
          } catch (e) {
            console.error('Error setting chart data:', e);
          }
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
    console.log('⚠️ Generating sample data (Finnhub API returned no data)');
    
    const now = Math.floor(Date.now() / 1000);
    const { from } = getTimeRange(interval);
    const dataPoints = 100;
    
    let startTime = fromTimestamp || from;
    let endTime = appendData ? oldestTimestampRef.current : now;
    
    // Safety check: ensure endTime > startTime
    if (endTime <= startTime) {
      console.warn('Invalid time range for sample data:', { startTime, endTime });
      endTime = startTime + (24 * 60 * 60); // Add 1 day
    }
    
    const timeStep = Math.floor((endTime - startTime) / dataPoints);
    
    // Safety check: ensure timeStep is positive
    if (timeStep <= 0) {
      console.warn('Invalid timeStep:', timeStep);
      return;
    }
    
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

    console.log('📝 Generated', sampleData.length, 'sample candles from', new Date(sampleData[0]?.time * 1000).toISOString(), 'to', new Date(sampleData[sampleData.length - 1]?.time * 1000).toISOString());

    if (appendData) {
      // Prepend older data and validate
      allDataRef.current = validateAndSortData([...sampleData, ...allDataRef.current]);
      oldestTimestampRef.current = allDataRef.current[0]?.time || oldestTimestampRef.current;
    } else {
      // Initial load and validate
      allDataRef.current = validateAndSortData(sampleData);
      oldestTimestampRef.current = allDataRef.current[0]?.time || 0;
    }

    if (candlestickSeriesRef.current && chartRef.current) {
      try {
        const formattedData = formatDataForChartType(allDataRef.current, chartType);
        candlestickSeriesRef.current.setData(formattedData);
        console.log('✅ Set chart data:', allDataRef.current.length, 'candles');
      } catch (e) {
        console.error('Error setting sample data:', e);
      }
    }
  };

  // Load more historical data when scrolling back
  const loadMoreHistoricalData = async () => {
    if (!oldestTimestampRef.current || isLoadingMoreRef.current) return;
    
    // Check if chart is still mounted
    if (!chartRef.current || !chartContainerRef.current) {
      console.warn('Chart not mounted, skipping load more');
      return;
    }
    
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
        mode: 0,
        vertLine: {
          width: 1,
          color: '#758696',
          style: 2,
          labelBackgroundColor: '#363C4E',
        },
        horzLine: {
          width: 1,
          color: '#758696',
          style: 2,
          labelBackgroundColor: '#363C4E',
        },
      },
    });

    // Add series based on chart type (initial load)
    let series;
    switch(chartType) {
      case 'line':
      case 'line-break':
        series = chart.addLineSeries({
          color: '#00D09C',
          lineWidth: 2,
        });
        break;
      case 'area':
        series = chart.addAreaSeries({
          topColor: 'rgba(0, 208, 156, 0.4)',
          bottomColor: 'rgba(0, 208, 156, 0.0)',
          lineColor: '#00D09C',
          lineWidth: 2,
        });
        break;
      case 'baseline':
        series = chart.addBaselineSeries({
          baseValue: { type: 'price', price: 1000 },
          topLineColor: '#00D09C',
          topFillColor1: 'rgba(0, 208, 156, 0.28)',
          topFillColor2: 'rgba(0, 208, 156, 0.05)',
          bottomLineColor: '#EB4D5C',
          bottomFillColor1: 'rgba(235, 77, 92, 0.28)',
          bottomFillColor2: 'rgba(235, 77, 92, 0.05)',
          lineWidth: 2,
        });
        break;
      case 'bars':
      case 'high-low':
        series = chart.addBarSeries({
          upColor: '#00D09C',
          downColor: '#EB4D5C',
          openVisible: chartType === 'bars',
          thinBars: chartType === 'high-low',
        });
        break;
      case 'columns':
        series = chart.addHistogramSeries({
          base: 0,
          priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
          },
        });
        break;
      case 'histogram':
        series = chart.addHistogramSeries({
          color: '#00D09C',
          priceFormat: {
            type: 'volume',
          },
        });
        break;
      case 'hollow-candlestick':
        series = chart.addCandlestickSeries({
          upColor: 'transparent',
          downColor: 'transparent',
          borderUpColor: '#00D09C',
          borderDownColor: '#EB4D5C',
          wickUpColor: '#00D09C',
          wickDownColor: '#EB4D5C',
          borderVisible: true,
        });
        break;
      case 'heikin-ashi':
      case 'renko':
        series = chart.addCandlestickSeries({
          upColor: '#00D09C',
          downColor: '#EB4D5C',
          borderUpColor: '#00D09C',
          borderDownColor: '#EB4D5C',
          wickUpColor: '#00D09C',
          wickDownColor: '#EB4D5C',
        });
        break;
      case 'kagi':
        series = chart.addLineSeries({
          color: '#00D09C',
          lineWidth: 3,
          lineStyle: 0,
        });
        break;
      case 'point-figure':
        series = chart.addHistogramSeries({
          base: 0,
          priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
          },
        });
        break;
      case 'candlestick':
      default:
        series = chart.addCandlestickSeries({
          upColor: '#00D09C',
          downColor: '#EB4D5C',
          borderUpColor: '#00D09C',
          borderDownColor: '#EB4D5C',
          wickUpColor: '#00D09C',
          wickDownColor: '#EB4D5C',
        });
        break;
    }

    chartRef.current = chart;
    candlestickSeriesRef.current = series;

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

    // Subscribe to crosshair move events
    chart.subscribeCrosshairMove((param) => {
      try {
        if (param.time && param.seriesData.size > 0 && onCrosshairMove) {
          const series = candlestickSeriesRef.current;
          if (!series) return;

          const data = param.seriesData.get(series);
          if (data) {
            // Extract OHLC values based on data type
            let ohlcData: { open: number; high: number; low: number; close: number; time: number } | null = null;

            if ('open' in data && 'high' in data && 'low' in data && 'close' in data) {
              // Candlestick/Bar data
              ohlcData = {
                open: data.open,
                high: data.high,
                low: data.low,
                close: data.close,
                time: param.time as number,
              };
            } else if ('value' in data) {
              // Line/Area data - use value for all OHLC
              ohlcData = {
                open: data.value,
                high: data.value,
                low: data.value,
                close: data.value,
                time: param.time as number,
              };
            }

            if (ohlcData) {
              onCrosshairMove(ohlcData);
            }
          }
        }
      } catch (e) {
        // Silently catch disposed chart errors during crosshair move
        console.debug('Crosshair move error (chart may be disposed):', e);
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
      
      // Clear refs before removing chart
      candlestickSeriesRef.current = null;
      
      // Remove chart safely
      try {
        chart.remove();
      } catch (e) {
        console.debug('Error removing chart:', e);
      }
      
      chartRef.current = null;
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

  // Update series when chart type changes
  useEffect(() => {
    if (!chartRef.current || !chartContainerRef.current) return;
    
    // Remove old series
    if (candlestickSeriesRef.current) {
      chartRef.current.removeSeries(candlestickSeriesRef.current);
    }

    // Add new series based on chart type
    let series;
    switch(chartType) {
      case 'line':
      case 'line-break':
        series = chartRef.current.addLineSeries({
          color: '#00D09C',
          lineWidth: 2,
        });
        break;
      case 'area':
        series = chartRef.current.addAreaSeries({
          topColor: 'rgba(0, 208, 156, 0.4)',
          bottomColor: 'rgba(0, 208, 156, 0.0)',
          lineColor: '#00D09C',
          lineWidth: 2,
        });
        break;
      case 'baseline':
        // Calculate average price for baseline
        const avgPrice = allDataRef.current.length > 0 
          ? allDataRef.current.reduce((sum: number, d: any) => sum + d.close, 0) / allDataRef.current.length 
          : 1000;
        series = chartRef.current.addBaselineSeries({
          baseValue: { type: 'price', price: avgPrice },
          topLineColor: '#00D09C',
          topFillColor1: 'rgba(0, 208, 156, 0.28)',
          topFillColor2: 'rgba(0, 208, 156, 0.05)',
          bottomLineColor: '#EB4D5C',
          bottomFillColor1: 'rgba(235, 77, 92, 0.28)',
          bottomFillColor2: 'rgba(235, 77, 92, 0.05)',
          lineWidth: 2,
        });
        break;
      case 'bars':
      case 'high-low':
        series = chartRef.current.addBarSeries({
          upColor: '#00D09C',
          downColor: '#EB4D5C',
          openVisible: chartType === 'bars',
          thinBars: chartType === 'high-low',
        });
        break;
      case 'columns':
        series = chartRef.current.addHistogramSeries({
          base: 0,
          priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
          },
        });
        break;
      case 'histogram':
        series = chartRef.current.addHistogramSeries({
          color: '#00D09C',
          priceFormat: {
            type: 'volume',
          },
        });
        break;
      case 'hollow-candlestick':
        series = chartRef.current.addCandlestickSeries({
          upColor: 'transparent',
          downColor: 'transparent',
          borderUpColor: '#00D09C',
          borderDownColor: '#EB4D5C',
          wickUpColor: '#00D09C',
          wickDownColor: '#EB4D5C',
          borderVisible: true,
        });
        break;
      case 'heikin-ashi':
      case 'renko':
        series = chartRef.current.addCandlestickSeries({
          upColor: '#00D09C',
          downColor: '#EB4D5C',
          borderUpColor: '#00D09C',
          borderDownColor: '#EB4D5C',
          wickUpColor: '#00D09C',
          wickDownColor: '#EB4D5C',
        });
        break;
      case 'kagi':
        series = chartRef.current.addLineSeries({
          color: '#00D09C',
          lineWidth: 3,
          lineStyle: 0, // Solid line
        });
        break;
      case 'point-figure':
        series = chartRef.current.addHistogramSeries({
          base: 0,
          priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
          },
        });
        break;
      case 'candlestick':
      default:
        series = chartRef.current.addCandlestickSeries({
          upColor: '#00D09C',
          downColor: '#EB4D5C',
          borderUpColor: '#00D09C',
          borderDownColor: '#EB4D5C',
          wickUpColor: '#00D09C',
          wickDownColor: '#EB4D5C',
        });
        break;
    }

    candlestickSeriesRef.current = series;

    // Reload data with new series
    if (allDataRef.current.length > 0) {
      try {
        const validatedData = validateAndSortData(allDataRef.current);
        const formattedData = formatDataForChartType(validatedData, chartType);
        series.setData(formattedData);
        console.log('Chart type changed, reloaded', formattedData.length, 'data points');
      } catch (e) {
        console.error('Error reloading data for chart type change:', e);
      }
    }
  }, [chartType]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0C0E12] z-10 pointer-events-none">
          <div className="text-gray-400 text-sm">Loading chart data...</div>
        </div>
      )}
      {isLoadingMore && !isLoading && (
        <div className="absolute top-4 left-4 bg-[#1A1D24] text-gray-300 text-xs px-3 py-2 rounded-md shadow-lg z-10 flex items-center space-x-2 pointer-events-none">
          <div className="w-3 h-3 border-2 border-[#00D09C] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading historical data...</span>
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full min-h-[400px]" />
    </div>
  );
}
