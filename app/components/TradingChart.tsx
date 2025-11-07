"use client";

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { useTheme } from '../context/ThemeContext';
import IndicatorPane from './IndicatorPane';

interface TradingChartProps {
  symbol: string;
  interval: string;
  chartType: string;
  onCrosshairMove?: (data: any) => void;
  activeIndicators?: string[];
  onChartClick?: (timestamp: number) => void;
  onChartRightClick?: () => void;
  chartDateSelectionMode?: boolean;
  selectedStartDate?: number | null;
  selectedEndDate?: number | null;
  refreshTrigger?: number;
}

export default function TradingChart({ 
  symbol, 
  interval, 
  chartType, 
  onCrosshairMove, 
  activeIndicators = [],
  onChartClick,
  onChartRightClick,
  chartDateSelectionMode = false,
  selectedStartDate,
  selectedEndDate,
  refreshTrigger = 0
}: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const indicatorSeriesRef = useRef<Map<string, any>>(new Map());
  const indicatorChartsRef = useRef<Map<string, any>>(new Map()); // Separate charts for indicators
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [separatePaneIndicatorData, setSeparatePaneIndicatorData] = useState<Map<string, any[]>>(new Map());
  const allDataRef = useRef<any[]>([]);
  const oldestTimestampRef = useRef<number>(0);
  const isLoadingMoreRef = useRef<boolean>(false);
  const activeIndicatorsRef = useRef<string[]>(activeIndicators); // Store current active indicators
  const highlightOverlayRef = useRef<HTMLDivElement>(null);
  const [isDateSelectionActive, setIsDateSelectionActive] = useState(false);
  const { theme } = useTheme();

  // Update ref whenever activeIndicators prop changes
  useEffect(() => {
    activeIndicatorsRef.current = activeIndicators;
    console.log('🔄 Active indicators updated:', activeIndicators);
  }, [activeIndicators]);

  // Define which indicators need separate panes
  const separatePaneIndicators = [
    'rsi', 'macd', 'stochastic', 'cci', 'momentum', 'williams', 
    'roc', 'volume', 'obv', 'cmf', 'adl', 'atr'
  ];

  const overlayIndicators = [
    'ma-20', 'ma-50', 'ma-200', 'ema-20', 'ema-50', 'ema-200',
    'bollinger', 'sar', 'vwap', 'ichimoku', 'fibonacci', 'pivot'
  ];

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

  // Technical Indicator Calculations
  const calculateSMA = (data: any[], period: number) => {
    const result = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val.close, 0);
      result.push({ time: data[i].time, value: sum / period });
    }
    return result;
  };

  const calculateEMA = (data: any[], period: number) => {
    const result = [];
    const multiplier = 2 / (period + 1);
    let ema = data.slice(0, period).reduce((acc, val) => acc + val.close, 0) / period;
    
    result.push({ time: data[period - 1].time, value: ema });
    
    for (let i = period; i < data.length; i++) {
      ema = (data[i].close - ema) * multiplier + ema;
      result.push({ time: data[i].time, value: ema });
    }
    return result;
  };

  const calculateRSI = (data: any[], period: number = 14) => {
    const result = [];
    const gains = [];
    const losses = [];
    
    // Calculate price changes
    for (let i = 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    // Calculate RSI for each valid period
    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      // Use the correct data point (i+1 because gains/losses array is offset by 1)
      result.push({ time: data[i + 1].time, value: rsi });
    }
    return result;
  };

  const calculateBollingerBands = (data: any[], period: number = 20, stdDev: number = 2) => {
    const sma = calculateSMA(data, period);
    const upper = [];
    const lower = [];
    
    for (let i = 0; i < sma.length; i++) {
      const dataSlice = data.slice(i, i + period);
      const mean = sma[i].value;
      const variance = dataSlice.reduce((acc, val) => acc + Math.pow(val.close - mean, 2), 0) / period;
      const std = Math.sqrt(variance);
      
      upper.push({ time: sma[i].time, value: mean + (std * stdDev) });
      lower.push({ time: sma[i].time, value: mean - (std * stdDev) });
    }
    
    return { sma, upper, lower };
  };

  const calculateMACD = (data: any[]) => {
    const ema12 = calculateEMA(data, 12);
    const ema26 = calculateEMA(data, 26);
    const macdLine = [];
    
    const startIndex = ema26.length - ema12.length;
    for (let i = 0; i < ema26.length; i++) {
      macdLine.push({
        time: ema26[i].time,
        value: ema12[i + startIndex].value - ema26[i].value
      });
    }
    
    const signal = calculateEMA(macdLine.map(m => ({ close: m.value, time: m.time })), 9);
    const histogram = [];
    
    for (let i = 0; i < signal.length; i++) {
      const macdIndex = macdLine.findIndex(m => m.time === signal[i].time);
      if (macdIndex !== -1) {
        histogram.push({
          time: signal[i].time,
          value: macdLine[macdIndex].value - signal[i].value,
          color: macdLine[macdIndex].value >= signal[i].value ? '#00D09C' : '#EB4D5C'
        });
      }
    }
    
    return { macdLine, signal, histogram };
  };

  const calculateATR = (data: any[], period: number = 14) => {
    const result = [];
    const trueRanges = [];
    
    for (let i = 1; i < data.length; i++) {
      const high = data[i].high;
      const low = data[i].low;
      const prevClose = data[i - 1].close;
      const tr = Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
      );
      trueRanges.push(tr);
    }
    
    for (let i = period - 1; i < trueRanges.length; i++) {
      const atr = trueRanges.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      result.push({ time: data[i + 1].time, value: atr });
    }
    
    return result;
  };

  const calculateStochastic = (data: any[], period: number = 14) => {
    const result = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const highestHigh = Math.max(...slice.map(d => d.high));
      const lowestLow = Math.min(...slice.map(d => d.low));
      const current = data[i].close;
      
      const k = ((current - lowestLow) / (highestHigh - lowestLow)) * 100;
      result.push({ time: data[i].time, value: k });
    }
    
    return result;
  };

  const calculateVWAP = (data: any[]) => {
    const result = [];
    let cumulativeTPV = 0;
    let cumulativeVolume = 0;
    
    for (let i = 0; i < data.length; i++) {
      const typical = (data[i].high + data[i].low + data[i].close) / 3;
      const volume = data[i].volume || 1000000;
      cumulativeTPV += typical * volume;
      cumulativeVolume += volume;
      
      result.push({
        time: data[i].time,
        value: cumulativeTPV / cumulativeVolume
      });
    }
    
    return result;
  };

  const calculateParabolicSAR = (data: any[], acceleration: number = 0.02, maximum: number = 0.2) => {
    const result: any[] = [];
    if (data.length < 2) return result;

    let isUptrend = data[1].close > data[0].close;
    let sar = isUptrend ? data[0].low : data[0].high;
    let ep = isUptrend ? data[0].high : data[0].low;
    let af = acceleration;

    for (let i = 1; i < data.length; i++) {
      result.push({ time: data[i].time, value: sar });

      sar = sar + af * (ep - sar);

      if (isUptrend) {
        if (data[i].low < sar) {
          isUptrend = false;
          sar = ep;
          ep = data[i].low;
          af = acceleration;
        } else {
          if (data[i].high > ep) {
            ep = data[i].high;
            af = Math.min(af + acceleration, maximum);
          }
        }
      } else {
        if (data[i].high > sar) {
          isUptrend = true;
          sar = ep;
          ep = data[i].high;
          af = acceleration;
        } else {
          if (data[i].low < ep) {
            ep = data[i].low;
            af = Math.min(af + acceleration, maximum);
          }
        }
      }
    }

    return result;
  };

  const calculateCCI = (data: any[], period: number = 20) => {
    const result = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const typicalPrices = slice.map(d => (d.high + d.low + d.close) / 3);
      const sma = typicalPrices.reduce((a, b) => a + b, 0) / period;
      const meanDeviation = typicalPrices.reduce((sum, tp) => sum + Math.abs(tp - sma), 0) / period;
      const cci = (typicalPrices[typicalPrices.length - 1] - sma) / (0.015 * meanDeviation);
      
      result.push({ time: data[i].time, value: cci });
    }
    
    return result;
  };

  const calculateROC = (data: any[], period: number = 12) => {
    const result = [];
    
    for (let i = period; i < data.length; i++) {
      const roc = ((data[i].close - data[i - period].close) / data[i - period].close) * 100;
      result.push({ time: data[i].time, value: roc });
    }
    
    return result;
  };

  const calculateWilliamsR = (data: any[], period: number = 14) => {
    const result = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const highestHigh = Math.max(...slice.map(d => d.high));
      const lowestLow = Math.min(...slice.map(d => d.low));
      const williamsR = ((highestHigh - data[i].close) / (highestHigh - lowestLow)) * -100;
      
      result.push({ time: data[i].time, value: williamsR });
    }
    
    return result;
  };

  const calculateOBV = (data: any[]) => {
    const result = [];
    let obv = 0;
    
    for (let i = 1; i < data.length; i++) {
      const volume = data[i].volume || 1000000;
      if (data[i].close > data[i - 1].close) {
        obv += volume;
      } else if (data[i].close < data[i - 1].close) {
        obv -= volume;
      }
      result.push({ 
        time: data[i].time, 
        value: obv,
        color: obv >= 0 ? '#4CAF50' : '#F44336'
      });
    }
    
    return result;
  };

  const calculateVolume = (data: any[]) => {
    return data.map(d => ({
      time: d.time,
      value: d.volume || 1000000,
      color: d.close >= d.open ? '#00D09C' : '#EB4D5C'
    }));
  };

  const calculateIndicatorData = (data: any[], indicatorId: string) => {
    switch(indicatorId) {
      case 'ma-20': return calculateSMA(data, 20);
      case 'ma-50': return calculateSMA(data, 50);
      case 'ma-200': return calculateSMA(data, 200);
      case 'ema-20': return calculateEMA(data, 20);
      case 'ema-50': return calculateEMA(data, 50);
      case 'ema-200': return calculateEMA(data, 200);
      case 'rsi': return calculateRSI(data, 14);
      case 'atr': return calculateATR(data, 14);
      case 'stochastic': return calculateStochastic(data, 14);
      case 'vwap': return calculateVWAP(data);
      case 'sar': return calculateParabolicSAR(data);
      case 'cci': return calculateCCI(data, 20);
      case 'roc': return calculateROC(data, 12);
      case 'williams': return calculateWilliamsR(data, 14);
      case 'obv': return calculateOBV(data);
      case 'volume': return calculateVolume(data);
      default: return [];
    }
  };

  // Update all active indicators with new data
  const updateIndicators = () => {
    const currentActiveIndicators = activeIndicatorsRef.current;
    
    if (!chartRef.current || allDataRef.current.length === 0 || currentActiveIndicators.length === 0) {
      console.log('⚠️ Skipping indicator update:', {
        hasChart: !!chartRef.current,
        dataLength: allDataRef.current.length,
        activeIndicatorsCount: currentActiveIndicators.length,
        activeIndicators: currentActiveIndicators
      });
      return;
    }

    console.log('🔄 Updating', currentActiveIndicators.length, 'indicators with', allDataRef.current.length, 'data points...');

    currentActiveIndicators.forEach((indicatorId) => {
      try {
        const indicatorData = calculateIndicatorData(allDataRef.current, indicatorId);
        
        if (separatePaneIndicators.includes(indicatorId)) {
          // Update separate pane data
          setSeparatePaneIndicatorData(prev => {
            const newMap = new Map(prev);
            newMap.set(indicatorId, indicatorData);
            return newMap;
          });
          console.log(`✅ Updated separate pane indicator ${indicatorId} with ${indicatorData.length} points`);
        } else {
          // Update overlay series
          const series = indicatorSeriesRef.current.get(indicatorId);
          if (series && series !== 'separate-pane' && indicatorData.length > 0) {
            series.setData(indicatorData);
            console.log(`✅ Updated overlay indicator ${indicatorId} with ${indicatorData.length} points`);
          }
        }
      } catch (e) {
        console.error(`❌ Error updating indicator ${indicatorId}:`, e);
      }
    });
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
    // Use a consistent "now" timestamp to ensure same data on repeated fetches
    // For intraday intervals, align to current date's market hours
    const now = Math.floor(Date.now() / 1000);
    let from = now;
    let resolution = '1';

    switch(interval) {
      case '1d':
        // For 1 day view, show current trading day (last 24 hours)
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

  // Fetch data from Yahoo Finance (for NSE stocks that Finnhub doesn't support)
  const fetchYahooFinanceData = async (fromTimestamp: number, toTimestamp: number, appendData: boolean = false, isRefresh: boolean = false) => {
    try {
      const period1 = fromTimestamp;
      const period2 = toTimestamp;
      
      // Map interval to Yahoo Finance format
      let yahooInterval = '1d';
      switch(interval) {
        case '1d':
          yahooInterval = '5m'; // Use 5min candles for 1 day to get more consistent data
          break;
        case '5d':
          yahooInterval = '15m'; // Use 15min candles for 5 days
          break;
        case '1m':
          yahooInterval = '1h';
          break;
        case '3m':
        case '1y':
          yahooInterval = '1d';
          break;
        case '5y':
        case '10y':
          yahooInterval = '1wk';
          break;
        default:
          yahooInterval = '1d';
      }
      
      // Use our Next.js API route to proxy the request (avoids CORS)
      const url = `/api/yahoo-finance?symbol=${encodeURIComponent(symbol)}&period1=${period1}&period2=${period2}&interval=${yahooInterval}`;
      console.log('🔍 Fetching from Yahoo Finance via proxy:', {
        symbol: symbol,
        interval: yahooInterval,
        from: new Date(period1 * 1000).toLocaleString(),
        to: new Date(period2 * 1000).toLocaleString(),
        period1,
        period2,
        appendData,
        timeRange: `${((period2 - period1) / 3600).toFixed(1)} hours`
      });
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('📊 Yahoo Finance API Response:', {
        symbol: symbol,
        hasData: !!data?.chart?.result?.[0],
        error: data?.chart?.error || data?.error || null,
        resultLength: data?.chart?.result?.[0]?.timestamp?.length || 0,
        appendData,
        isRefresh
      });

      if (data?.chart?.result?.[0]?.timestamp) {
        const result = data.chart.result[0];
        const timestamps = result.timestamp;
        const quotes = result.indicators.quote[0];
        
        const candlestickData = timestamps.map((timestamp: number, index: number) => ({
          time: timestamp,
          open: quotes.open[index] || quotes.close[index],
          high: quotes.high[index] || quotes.close[index],
          low: quotes.low[index] || quotes.close[index],
          close: quotes.close[index],
        })).filter((candle: any) => 
          candle.open !== null && 
          candle.high !== null && 
          candle.low !== null && 
          candle.close !== null
        );

        console.log('✅ Successfully processed', candlestickData.length, 'candles from Yahoo Finance');

        if (appendData) {
          allDataRef.current = validateAndSortData([...candlestickData, ...allDataRef.current]);
          oldestTimestampRef.current = allDataRef.current[0]?.time || oldestTimestampRef.current;
        } else {
          allDataRef.current = validateAndSortData(candlestickData);
          oldestTimestampRef.current = allDataRef.current[0]?.time || 0;
        }

        if (candlestickSeriesRef.current && chartRef.current) {
          try {
            const formattedData = formatDataForChartType(allDataRef.current, chartType);
            console.log('📊 Setting', formattedData.length, 'data points to chart from Yahoo Finance');
            candlestickSeriesRef.current.setData(formattedData);
            updateIndicators();
          } catch (e) {
            console.error('Error setting Yahoo Finance chart data:', e);
          }
        }
      } else {
        // For refresh operations, just log info and keep existing data unchanged
        if (isRefresh) {
          console.log('ℹ️ Refresh: No new data from Yahoo Finance - keeping existing chart');
          return;
        }
        
        // For non-refresh failures, log as error
        console.error('❌ No valid data from Yahoo Finance for:', symbol, '- Response:', data);
        
        // For initial load, always generate sample data so user sees something
        // For append operations (loading more historical data), also generate sample data
        if (!appendData) {
          console.warn('⚠️ Falling back to sample data for initial load');
          generateSampleData(fromTimestamp, appendData);
        } else if (allDataRef.current.length === 0) {
          // If append but no existing data, generate sample data
          console.warn('⚠️ Falling back to sample data (no existing data)');
          generateSampleData(fromTimestamp, appendData);
        } else {
          // For load-more operations, generate sample historical data
          console.warn('⚠️ Generating sample historical data for append operation');
          generateSampleData(fromTimestamp, appendData);
        }
      }
    } catch (error) {
      // For refresh operations, just log info and keep existing data unchanged
      if (isRefresh) {
        console.log('ℹ️ Refresh: Failed to fetch from Yahoo Finance - keeping existing chart');
        return;
      }
      
      // For non-refresh failures, log as error
      console.error('❌ Error fetching Yahoo Finance data:', error);
      
      // Same logic as above
      if (!appendData) {
        console.warn('⚠️ Falling back to sample data for initial load');
        generateSampleData(fromTimestamp, appendData);
      } else if (allDataRef.current.length === 0) {
        console.warn('⚠️ Falling back to sample data (no existing data)');
        generateSampleData(fromTimestamp, appendData);
      } else {
        console.warn('⚠️ Generating sample historical data for append operation');
        generateSampleData(fromTimestamp, appendData);
      }
    } finally {
      if (!appendData) setIsLoading(false);
    }
  };

  // Fetch data from Yahoo Finance (for NSE stocks) or Finnhub
  const fetchChartData = async (fromTimestamp?: number, appendData: boolean = false) => {
    if (!appendData) setIsLoading(true);
    
    try {
      // Check if chart is still mounted
      if (!chartRef.current || !chartContainerRef.current) {
        console.warn('Chart not mounted, skipping fetch');
        return;
      }
      
      const { from, to, resolution } = getTimeRange(interval);
      
      // Use provided timestamp or default
      const startTime = fromTimestamp || from;
      
      // For NSE stocks, use Yahoo Finance API instead of Finnhub
      if (symbol.endsWith('.NS')) {
        console.log('🔍 Fetching NSE data from Yahoo Finance for:', symbol);
        await fetchYahooFinanceData(startTime, to, appendData);
        return;
      }
      
      // For other stocks, use Finnhub
      const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
      let finnhubSymbol = symbol;
      
      const url = `https://finnhub.io/api/v1/stock/candle?symbol=${finnhubSymbol}&resolution=${resolution}&from=${startTime}&to=${to}&token=${apiKey}`;
      console.log('🔍 Fetching data from Finnhub:', {
        originalSymbol: symbol,
        finnhubSymbol: finnhubSymbol,
        resolution,
        from: new Date(startTime * 1000).toISOString(),
        to: new Date(to * 1000).toISOString(),
        url: apiKey ? url.replace(apiKey, 'API_KEY_HIDDEN') : url
      });
      
      const response = await fetch(url);
      const data = await response.json();

      console.log('📊 Finnhub API Response:', {
        status: data.s,
        error: data.error || null,
        dataPoints: data.t?.length || 0,
        symbol: finnhubSymbol,
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
      
      // If Finnhub fails for NSE stocks, log more details
      if (data.s !== 'ok') {
        console.warn('❌ Finnhub API failed for', finnhubSymbol, '- Full response:', data);
      }

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
            console.log('📊 Setting', formattedData.length, 'data points to chart (appendData:', appendData, ')');
            candlestickSeriesRef.current.setData(formattedData);
            
            // Update indicators with new data
            console.log('🔄 Updating indicators after data load (total data points:', allDataRef.current.length, ')');
            updateIndicators();
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
        console.log('✅ Set chart data:', allDataRef.current.length, 'candles (sample data)');
        
        // Update indicators with new data
        console.log('🔄 Updating indicators after sample data load (total data points:', allDataRef.current.length, ')');
        updateIndicators();
      } catch (e) {
        console.error('Error setting sample data:', e);
      }
    }
  };

  // Load more historical data when scrolling back
  const loadMoreHistoricalData = async () => {
    if (!oldestTimestampRef.current || isLoadingMoreRef.current) {
      console.log('⏸️ Skipping load more:', {
        hasOldestTimestamp: !!oldestTimestampRef.current,
        isAlreadyLoading: isLoadingMoreRef.current
      });
      return;
    }
    
    // Check if chart is still mounted
    if (!chartRef.current || !chartContainerRef.current) {
      console.warn('Chart not mounted, skipping load more');
      return;
    }
    
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    
    console.log('📜 Loading more historical data from timestamp:', new Date(oldestTimestampRef.current * 1000).toISOString());
    
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
    console.log('📥 Fetching data from:', new Date(newFrom * 1000).toISOString(), 'to', new Date(oldestTimestampRef.current * 1000).toISOString());
    await fetchChartData(newFrom, true);
    
    isLoadingMoreRef.current = false;
    setIsLoadingMore(false);
    console.log('✅ Completed loading more historical data');
  };

  // Robust chart recreation: re-create chart instance on symbol/interval/chartType change
  useEffect(() => {
    if (!chartContainerRef.current) {
      console.log('No chart container ref');
      return;
    }

    // --- CLEANUP: Remove old chart instance and all refs/state ---
    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch (e) {
        console.debug('Error removing chart:', e);
      }
      chartRef.current = null;
    }
    candlestickSeriesRef.current = null;
    indicatorSeriesRef.current.clear();
    setSeparatePaneIndicatorData(new Map());
    allDataRef.current = [];
    oldestTimestampRef.current = 0;
    if (highlightOverlayRef.current) {
      highlightOverlayRef.current.style.display = 'none';
    }

    // --- CREATE NEW CHART INSTANCE ---
    console.log('Initializing chart with dimensions:', {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight
    });

    const isDark = theme === 'dark';
    const bgColor = isDark ? '#0C0E12' : '#FFFFFF';
    const textColor = isDark ? '#9B9B9B' : '#44475B';
    const gridColor = isDark ? '#1A1D24' : '#E8E8E8';
    const borderColor = isDark ? '#2B2B43' : '#D1D4DC';
    const crosshairColor = isDark ? '#758696' : '#9598A1';

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: bgColor },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: borderColor,
        rightOffset: 5,
        barSpacing: 6,
        fixLeftEdge: false,
        fixRightEdge: false,
      },
      rightPriceScale: {
        borderColor: borderColor,
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      localization: {
        timeFormatter: (timestamp: number) => {
          const date = new Date(timestamp * 1000);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          if (interval === '1d' || interval === '5d') {
            return `${day}/${month}/${year} ${hours}:${minutes}`;
          } else {
            return `${day}/${month}/${year}`;
          }
        },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          width: 1,
          color: crosshairColor,
          style: 2,
          labelBackgroundColor: isDark ? '#363C4E' : '#D1D4DC',
        },
        horzLine: {
          width: 1,
          color: crosshairColor,
          style: 2,
          labelBackgroundColor: isDark ? '#363C4E' : '#D1D4DC',
        },
      },
    });

    // Add series based on chart type (initial load)
    let series;
    switch(chartType) {
      case 'line':
      case 'line-break':
        series = chart.addLineSeries({ color: '#00D09C', lineWidth: 2 });
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
          priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
        });
        break;
      case 'histogram':
        series = chart.addHistogramSeries({
          color: '#00D09C',
          priceFormat: { type: 'volume' },
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
        series = chart.addLineSeries({ color: '#00D09C', lineWidth: 3, lineStyle: 0 });
        break;
      case 'point-figure':
        series = chart.addHistogramSeries({
          base: 0,
          priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
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
        if (logicalRange.from < 5) {
          console.log('👈 User scrolled to left edge (from:', logicalRange.from, ') - triggering data load...');
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
            let ohlcData = null;
            if ('open' in data && 'high' in data && 'low' in data && 'close' in data) {
              ohlcData = {
                open: data.open,
                high: data.high,
                low: data.low,
                close: data.close,
                time: param.time as number,
              };
            } else if ('value' in data) {
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
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (e) {
          console.debug('Error removing chart:', e);
        }
        chartRef.current = null;
      }
      candlestickSeriesRef.current = null;
      indicatorSeriesRef.current.clear();
      setSeparatePaneIndicatorData(new Map());
      allDataRef.current = [];
      oldestTimestampRef.current = 0;
      if (highlightOverlayRef.current) {
        highlightOverlayRef.current.style.display = 'none';
      }
    };
  }, [symbol, interval, chartType]);

  // Handle refresh trigger - fetch new data without resetting zoom/pan
  useEffect(() => {
    if (refreshTrigger > 0 && chartRef.current && candlestickSeriesRef.current && allDataRef.current.length > 0) {
      console.log('🔄 Refresh triggered, fetching latest data without resetting view...');
      
      // Save current visible range to restore it later
      const timeScale = chartRef.current.timeScale();
      const visibleLogicalRange = timeScale.getVisibleLogicalRange();
      
      // Fetch only the latest data point(s) - get data from the last known timestamp to now
      const lastTimestamp = allDataRef.current[allDataRef.current.length - 1]?.time || 0;
      
      // Fetch new data and append it
      fetchLatestData(lastTimestamp).then(() => {
        // Restore the visible range after data is updated
        if (visibleLogicalRange) {
          try {
            timeScale.setVisibleLogicalRange(visibleLogicalRange);
            console.log('✅ Restored visible range after refresh');
          } catch (e) {
            console.warn('Could not restore visible range:', e);
          }
        }
      });
    }
  }, [refreshTrigger]);

  // Separate effect for chart click handlers
  useEffect(() => {
    console.log('🎯 Setting up click handlers. Mode:', chartDateSelectionMode || isDateSelectionActive);
    
    if (!chartContainerRef.current || !chartRef.current) {
      console.log('❌ Container or chart not ready');
      return;
    }

    const container = chartContainerRef.current;
    const isActive = chartDateSelectionMode || isDateSelectionActive;
    
    const handleClick = (e: MouseEvent) => {
      console.log('🖱️ Click detected. Mode:', isActive, 'HasCallback:', !!onChartClick);
      
      if (isActive && onChartClick && chartRef.current) {
        const timeScale = chartRef.current.timeScale();
        const coordinate = e.offsetX;
        const timestamp = timeScale.coordinateToTime(coordinate);
        if (timestamp) {
          console.log('📅 Chart clicked, timestamp:', timestamp, new Date(timestamp * 1000));
          onChartClick(timestamp as number);
        } else {
          console.log('⚠️ Could not convert coordinate to timestamp');
        }
      }
    };

    const handleRightClick = (e: MouseEvent) => {
      if (isActive && onChartRightClick) {
        e.preventDefault();
        console.log('🔄 Right click - clearing selection');
        onChartRightClick();
      }
    };

    container.addEventListener('click', handleClick);
    container.addEventListener('contextmenu', handleRightClick);
    console.log('✅ Click handlers attached');

    return () => {
      container.removeEventListener('click', handleClick);
      container.removeEventListener('contextmenu', handleRightClick);
      console.log('🧹 Click handlers cleaned up');
    };
  }, [chartDateSelectionMode, isDateSelectionActive, onChartClick, onChartRightClick]);

  // Fetch only the latest data points (for live updates)
  const fetchLatestData = async (fromTimestamp: number) => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const { resolution } = getTimeRange(interval);
      
      // For NSE stocks, use Yahoo Finance
      if (symbol.endsWith('.NS')) {
        console.log('📡 Fetching latest NSE data from Yahoo Finance');
        try {
          await fetchYahooFinanceData(fromTimestamp, now, true, true); // appendData=true, isRefresh=true
        } catch (error) {
          // Silently handle refresh errors - existing chart stays unchanged
          console.log('ℹ️ Refresh skipped - keeping existing chart data');
        }
        return;
      }
      
      // For other stocks, use Finnhub
      const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
      let finnhubSymbol = symbol;
      
      const url = `https://finnhub.io/api/v1/stock/candle?symbol=${finnhubSymbol}&resolution=${resolution}&from=${fromTimestamp}&to=${now}&token=${apiKey}`;
      console.log('📡 Fetching latest data from:', new Date(fromTimestamp * 1000).toISOString(), 'to now');
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.s === 'ok' && data.t && data.t.length > 0) {
        const newCandles = data.t
          .map((timestamp: number, index: number) => ({
            time: timestamp,
            open: data.o[index],
            high: data.h[index],
            low: data.l[index],
            close: data.c[index],
          }))
          .filter((candle: any) => candle.time > fromTimestamp); // Only new data

        if (newCandles.length > 0) {
          console.log('✨ Appending', newCandles.length, 'new candles');
          
          // Append new data
          allDataRef.current = validateAndSortData([...allDataRef.current, ...newCandles]);
          
          // Update the chart with all data
          if (candlestickSeriesRef.current && chartRef.current) {
            const formattedData = formatDataForChartType(allDataRef.current, chartType);
            candlestickSeriesRef.current.setData(formattedData);
            
            // Update indicators
            updateIndicators();
          }
        } else {
          console.log('ℹ️ No new data available');
        }
      }
    } catch (error) {
      console.error('Error fetching latest data:', error);
    }
  };

  // Update chart colors when theme changes
  useEffect(() => {
    if (!chartRef.current) return;

    const isDark = theme === 'dark';
    const bgColor = isDark ? '#0C0E12' : '#FFFFFF';
    const textColor = isDark ? '#9B9B9B' : '#44475B';
    const gridColor = isDark ? '#1A1D24' : '#E8E8E8';
    const borderColor = isDark ? '#2B2B43' : '#D1D4DC';
    const crosshairColor = isDark ? '#758696' : '#9598A1';
    const labelBgColor = isDark ? '#363C4E' : '#D1D4DC';

    chartRef.current.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: bgColor },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      timeScale: {
        borderColor: borderColor,
      },
      rightPriceScale: {
        borderColor: borderColor,
      },
      crosshair: {
        vertLine: {
          color: crosshairColor,
          labelBackgroundColor: labelBgColor,
        },
        horzLine: {
          color: crosshairColor,
          labelBackgroundColor: labelBgColor,
        },
      },
    });
  }, [theme]);

  // Update the visual highlight overlay when dates change
  useEffect(() => {
    console.log('🎨 Overlay effect triggered:', {
      chartDateSelectionMode,
      selectedStartDate,
      selectedEndDate,
      hasChartRef: !!chartRef.current,
      hasOverlayRef: !!highlightOverlayRef.current
    });
    
    if (!chartRef.current || !highlightOverlayRef.current) return;
    
    const updateOverlayPosition = () => {
      if (!chartRef.current || !highlightOverlayRef.current) return;
      
      const overlay = highlightOverlayRef.current;
      
      // Show overlay whenever dates are selected, regardless of mode
      // This ensures the highlight persists even when portfolio tab is closed
      if (!selectedStartDate && !selectedEndDate) {
        overlay.style.display = 'none';
        console.log('🚫 Hiding overlay - no dates selected');
        return;
      }
      
      // Show overlay when we have at least one date
      if (selectedStartDate || selectedEndDate) {
        overlay.style.display = 'block';
        
        const timeScale = chartRef.current.timeScale();
        const chartContainer = chartContainerRef.current;
        if (!chartContainer) return;
        
        const containerRect = chartContainer.getBoundingClientRect();
        const chartWidth = containerRect.width;
        
        let startX = 0;
        let endX = chartWidth;
        
        try {
          if (selectedStartDate) {
            startX = timeScale.timeToCoordinate(selectedStartDate) || 0;
          }
          
          if (selectedEndDate) {
            endX = timeScale.timeToCoordinate(selectedEndDate) || chartWidth;
          } else if (selectedStartDate) {
            // If only start date is selected, extend to the right edge
            endX = chartWidth;
          }
          
          // Ensure proper order (start should be left of end)
          const left = Math.min(startX, endX);
          const right = Math.max(startX, endX);
          const width = right - left;
          
          // Position the overlay with gradient
          overlay.style.left = `${left}px`;
          overlay.style.width = `${width}px`;
          overlay.style.height = '100%';
          overlay.style.top = '0';
          overlay.style.background = 'linear-gradient(90deg, rgba(0, 208, 156, 0.05) 0%, rgba(0, 208, 156, 0.2) 50%, rgba(0, 208, 156, 0.05) 100%)';
          
          console.log('✅ Overlay positioned:', { left, width, startX, endX });
          
        } catch (e) {
          console.warn('Could not position highlight overlay:', e);
        }
      }
    };
    
    // Initial update
    updateOverlayPosition();
    
    // Subscribe to visible range changes to update overlay position on pan/zoom
    const chart = chartRef.current;
    if (chart) {
      const unsubscribe = chart.timeScale().subscribeVisibleLogicalRangeChange(() => {
        updateOverlayPosition();
      });
      
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [selectedStartDate, selectedEndDate]);

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

  // Update indicators when activeIndicators changes
  useEffect(() => {
    if (!chartRef.current || allDataRef.current.length === 0) {
      console.log('Indicators not rendered: chart or data not ready', {
        hasChart: !!chartRef.current,
        dataLength: allDataRef.current.length
      });
      return;
    }

    console.log('Updating indicators:', activeIndicators);

    const indicatorColors: { [key: string]: string } = {
      'ma-20': '#2196F3',
      'ma-50': '#FF9800',
      'ma-200': '#F44336',
      'ema-20': '#00BCD4',
      'ema-50': '#FFC107',
      'ema-200': '#E91E63',
      'rsi': '#9C27B0',
      'macd': '#3F51B5',
      'bollinger': '#607D8B',
      'volume': '#4CAF50',
      'atr': '#FF5722',
      'obv': '#8BC34A',
      'roc': '#CDDC39',
      'stochastic': '#FFEB3B',
      'cci': '#00E676',
      'momentum': '#76FF03',
      'williams': '#C6FF00',
      'cmf': '#AEEA00',
      'adl': '#64DD17',
      'fibonacci': '#FFD600',
      'sar': '#FFAB00',
      'vwap': '#FF6D00',
      'ichimoku': '#DD2C00',
      'pivot': '#D50000',
    };

    // Remove indicators that are no longer active
    indicatorSeriesRef.current.forEach((series, id) => {
      if (!activeIndicators.includes(id)) {
        try {
          if (separatePaneIndicators.includes(id)) {
            // Remove from separate pane data
            setSeparatePaneIndicatorData(prev => {
              const newMap = new Map(prev);
              newMap.delete(id);
              return newMap;
            });
          } else {
            // Remove series from main chart for overlay indicators
            chartRef.current.removeSeries(series);
          }
          indicatorSeriesRef.current.delete(id);
          console.log(`Removed indicator: ${id}`);
        } catch (e) {
          console.error('Error removing indicator series:', e);
        }
      }
    });

    // Add new indicators
    activeIndicators.forEach((indicatorId) => {
      if (!indicatorSeriesRef.current.has(indicatorId)) {
        try {
          console.log(`Calculating indicator: ${indicatorId}`);
          const indicatorData = calculateIndicatorData(allDataRef.current, indicatorId);
          console.log(`Indicator ${indicatorId} data points:`, indicatorData.length);
          
          if (indicatorData.length > 0) {
            // Check if this indicator needs a separate pane
            if (separatePaneIndicators.includes(indicatorId)) {
              // Store data for separate pane rendering
              setSeparatePaneIndicatorData(prev => {
                const newMap = new Map(prev);
                newMap.set(indicatorId, indicatorData);
                return newMap;
              });
              indicatorSeriesRef.current.set(indicatorId, 'separate-pane');
              console.log(`${indicatorId} added to separate pane`);
            } else {
              // Add as overlay on main chart
              const series = chartRef.current.addLineSeries({
                color: indicatorColors[indicatorId] || '#2196F3',
                lineWidth: 2,
                priceLineVisible: false,
                lastValueVisible: true,
              });
              
              series.setData(indicatorData);
              indicatorSeriesRef.current.set(indicatorId, series);
              console.log(`Added overlay indicator series: ${indicatorId}`);
            }
          } else {
            console.warn(`No data calculated for indicator: ${indicatorId}`);
          }
        } catch (e) {
          console.error(`Error adding indicator ${indicatorId}:`, e);
        }
      }
    });
  }, [activeIndicators]);

  // Helper function to get indicator name and color
  const getIndicatorInfo = (indicatorId: string) => {
    const indicatorColors: { [key: string]: string } = {
      'ma-20': '#2196F3',
      'ma-50': '#FF9800',
      'ma-200': '#F44336',
      'ema-20': '#00BCD4',
      'ema-50': '#FFC107',
      'ema-200': '#E91E63',
      'rsi': '#9C27B0',
      'macd': '#3F51B5',
      'bollinger': '#607D8B',
      'volume': '#4CAF50',
      'atr': '#FF5722',
      'obv': '#8BC34A',
      'roc': '#CDDC39',
      'stochastic': '#FFEB3B',
      'cci': '#00E676',
      'momentum': '#76FF03',
      'williams': '#C6FF00',
      'cmf': '#AEEA00',
      'adl': '#64DD17',
      'fibonacci': '#FFD600',
      'sar': '#FFAB00',
      'vwap': '#FF6D00',
      'ichimoku': '#DD2C00',
      'pivot': '#D50000',
    };

    const indicatorNames: { [key: string]: string } = {
      'rsi': 'RSI (14)',
      'macd': 'MACD',
      'stochastic': 'Stochastic',
      'cci': 'CCI',
      'momentum': 'Momentum',
      'williams': 'Williams %R',
      'roc': 'ROC',
      'volume': 'Volume',
      'obv': 'OBV',
      'cmf': 'CMF',
      'adl': 'ADL',
      'atr': 'ATR',
    };

    return {
      name: indicatorNames[indicatorId] || indicatorId.toUpperCase(),
      color: indicatorColors[indicatorId] || '#2196F3',
    };
  };

  // Calculate how to distribute space between main chart and indicator panes
  const separatePaneCount = Array.from(separatePaneIndicatorData.keys()).length;
  
  // Space distribution logic:
  // - No indicators: main chart takes 100%
  // - 1 indicator: 65% main, 35% indicator
  // - 2 indicators: 60% main, 20% each indicator
  // - 3+ indicators: 55% main, split remaining among indicators
  let mainChartPercent = 100;
  let indicatorPercent = 0;
  
  if (separatePaneCount === 1) {
    mainChartPercent = 65;
    indicatorPercent = 35;
  } else if (separatePaneCount === 2) {
    mainChartPercent = 60;
    indicatorPercent = 20;
  } else if (separatePaneCount >= 3) {
    mainChartPercent = 55;
    indicatorPercent = 45 / separatePaneCount;
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Main Chart */}
      <div className="relative" style={{ height: `${mainChartPercent}%` }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-[#0C0E12] z-10 pointer-events-none">
            <div className="text-gray-600 dark:text-gray-400 text-sm">Loading chart data...</div>
          </div>
        )}
        {isLoadingMore && !isLoading && (
          <div className="absolute top-4 left-4 bg-gray-100 dark:bg-[#1A1D24] text-gray-700 dark:text-gray-300 text-xs px-3 py-2 rounded-md shadow-lg z-10 flex items-center space-x-2 pointer-events-none">
            <div className="w-3 h-3 border-2 border-[#00D09C] border-t-transparent rounded-full animate-spin"></div>
            <span>Loading historical data...</span>
          </div>
        )}
        
        {/* Date Selection Toggle Button - Positioned beside OHLC bar */}
        <button
          onClick={() => {
            setIsDateSelectionActive(!isDateSelectionActive);
            if (isDateSelectionActive && onChartRightClick) {
              // Clear selection when toggling off
              onChartRightClick();
            }
          }}
          className={`absolute top-14 left-4 text-xs px-3 py-2 rounded-md shadow-lg z-20 transition-all duration-200 flex items-center space-x-2 ${
            isDateSelectionActive || chartDateSelectionMode
              ? 'bg-[#00D09C] text-white hover:bg-[#00B386]'
              : 'bg-gray-100 dark:bg-[#1A1D24] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#23272F]'
          }`}
          title={isDateSelectionActive ? "Click to disable date selection" : "Click to select date range from chart"}
        >
          <svg 
            className="w-3.5 h-3.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span className="font-medium">
            {isDateSelectionActive || chartDateSelectionMode ? 'Date Selection ON' : 'Select Period'}
          </span>
        </button>
        
        {/* Portfolio Date Selection Indicator */}
        {(chartDateSelectionMode || isDateSelectionActive) && (
          <div className="absolute top-4 right-4 bg-[#00D09C] text-white text-xs px-3 py-2 rounded-md shadow-lg z-10 pointer-events-none max-w-xs">
            <div className="font-semibold mb-1">Date Selection Active</div>
            {selectedStartDate && (
              <div className="text-[10px] opacity-90 leading-relaxed">
                <span className="font-medium">Start:</span>{' '}
                {new Date(selectedStartDate * 1000).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
            )}
            {selectedEndDate && (
              <div className="text-[10px] opacity-90 leading-relaxed">
                <span className="font-medium">End:</span>{' '}
                {new Date(selectedEndDate * 1000).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
            )}
            {selectedStartDate && !selectedEndDate && (
              <div className="text-[10px] mt-1 opacity-75 italic">
                Click again to set end date
              </div>
            )}
          </div>
        )}
        {/* Highlight overlay for selected date range */}
        <div 
          ref={highlightOverlayRef}
          className="absolute pointer-events-none z-[5]"
          style={{
            display: 'none',
            borderLeft: '2px solid rgba(0, 208, 156, 0.6)',
            borderRight: '2px solid rgba(0, 208, 156, 0.6)',
          }}
        />
        <div ref={chartContainerRef} className="w-full h-full cursor-crosshair" />
      </div>

      {/* Render separate indicator panes */}
      {Array.from(separatePaneIndicatorData.entries()).map(([indicatorId, data]) => {
        const indicatorInfo = getIndicatorInfo(indicatorId);
        return (
          <div key={indicatorId} style={{ height: `${indicatorPercent}%` }}>
            <IndicatorPane
              indicatorId={indicatorId}
              indicatorName={indicatorInfo.name}
              data={data}
              color={indicatorInfo.color}
              mainChart={chartRef.current}
            />
          </div>
        );
      })}
    </div>
  );
}
