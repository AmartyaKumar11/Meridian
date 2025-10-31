"use client";

import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { useTheme } from '../context/ThemeContext';

interface IndicatorPaneProps {
  indicatorId: string;
  indicatorName: string;
  data: any[];
  color: string;
  mainChart?: any;
}

export default function IndicatorPane({ indicatorId, indicatorName, data, color, mainChart }: IndicatorPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  useEffect(() => {
    if (!containerRef.current) return;

    const bgColor = isDark ? '#0C0E12' : '#FFFFFF';
    const textColor = isDark ? '#9B9B9B' : '#44475B';
    const gridColor = isDark ? '#1A1D24' : '#F0F0F0';

    // Calculate height from parent container (subtract header height)
    const headerHeight = 34; // Height of the indicator name header with borders
    const chartHeight = (containerRef.current.parentElement?.clientHeight || 150) - headerHeight;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: chartHeight,
      layout: {
        background: { type: ColorType.Solid, color: bgColor },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      timeScale: {
        borderColor: isDark ? '#2B2B43' : '#E0E0E0',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
        barSpacing: 6,
        fixLeftEdge: false,
        fixRightEdge: false,
      },
      rightPriceScale: {
        borderColor: isDark ? '#2B2B43' : '#E0E0E0',
        autoScale: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
    });

    chartRef.current = chart;

    // Determine series type based on indicator
    if (indicatorId === 'volume' || indicatorId === 'obv' || indicatorId === 'cmf' || indicatorId === 'adl') {
      // Use histogram for volume-based indicators
      seriesRef.current = chart.addHistogramSeries({
        color: color,
        priceLineVisible: false,
      });
    } else {
      // Use line series for oscillators
      seriesRef.current = chart.addLineSeries({
        color: color,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
      });
    }

    seriesRef.current.setData(data);
    
    console.log(`Indicator ${indicatorId} loaded with ${data.length} data points`);
    if (data.length > 0) {
      console.log(`First point:`, data[0]);
      console.log(`Last point:`, data[data.length - 1]);
    }

    // Add reference lines for certain indicators
    if (indicatorId === 'rsi') {
      // Add 30 and 70 reference lines for RSI
      const overbought = chart.addLineSeries({
        color: isDark ? '#FF5252' : '#F44336',
        lineWidth: 1,
        lineStyle: 2, // Dashed
        priceLineVisible: false,
        lastValueVisible: false,
      });
      const oversold = chart.addLineSeries({
        color: isDark ? '#4CAF50' : '#00D09C',
        lineWidth: 1,
        lineStyle: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      overbought.setData(data.map(d => ({ time: d.time, value: 70 })));
      oversold.setData(data.map(d => ({ time: d.time, value: 30 })));
    }

    if (indicatorId === 'stochastic') {
      // Add 80 and 20 reference lines for Stochastic
      const overbought = chart.addLineSeries({
        color: isDark ? '#FF5252' : '#F44336',
        lineWidth: 1,
        lineStyle: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      const oversold = chart.addLineSeries({
        color: isDark ? '#4CAF50' : '#00D09C',
        lineWidth: 1,
        lineStyle: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      overbought.setData(data.map(d => ({ time: d.time, value: 80 })));
      oversold.setData(data.map(d => ({ time: d.time, value: 20 })));
    }

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        const headerHeight = 34;
        const chartHeight = (containerRef.current.parentElement?.clientHeight || 150) - headerHeight;
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
          height: chartHeight,
        });
      }
    };

    // Synchronize with main chart if provided
    if (mainChart) {
      // Sync time scale with main chart
      const mainTimeScale = mainChart.timeScale();
      const indicatorTimeScale = chart.timeScale();
      
      // Flag to prevent infinite loop
      let isSyncing = false;

      // Subscribe to main chart's visible range changes (main -> indicator)
      const syncToIndicator = () => {
        if (isSyncing) return;
        isSyncing = true;
        try {
          const mainRange = mainTimeScale.getVisibleRange();
          if (mainRange) {
            indicatorTimeScale.setVisibleRange(mainRange);
            // Auto-fit the price scale to visible content
            if (seriesRef.current) {
              chart.timeScale().fitContent();
            }
          }
        } catch (e) {
          // Ignore errors during sync
        }
        setTimeout(() => { isSyncing = false; }, 0);
      };

      // Subscribe to indicator chart's visible range changes (indicator -> main)
      const syncToMain = () => {
        if (isSyncing) return;
        isSyncing = true;
        try {
          const indicatorRange = indicatorTimeScale.getVisibleRange();
          if (indicatorRange) {
            mainTimeScale.setVisibleRange(indicatorRange);
          }
        } catch (e) {
          // Ignore errors during sync
        }
        setTimeout(() => { isSyncing = false; }, 0);
      };

      // Subscribe to both directions
      mainTimeScale.subscribeVisibleLogicalRangeChange(syncToIndicator);
      indicatorTimeScale.subscribeVisibleLogicalRangeChange(syncToMain);

      // Initial sync
      syncToIndicator();

      // Cleanup subscription on unmount
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        try {
          mainTimeScale.unsubscribeVisibleLogicalRangeChange(syncToIndicator);
          indicatorTimeScale.unsubscribeVisibleLogicalRangeChange(syncToMain);
        } catch (e) {
          // Ignore cleanup errors
        }
        if (chartRef.current) {
          try {
            chartRef.current.remove();
          } catch (e) {
            console.error('Error removing indicator chart:', e);
          }
        }
      };
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (e) {
          console.error('Error removing indicator chart:', e);
        }
      };
    }
  }, [mainChart]);

  // Update theme
  useEffect(() => {
    if (!chartRef.current) return;

    const bgColor = isDark ? '#0C0E12' : '#FFFFFF';
    const textColor = isDark ? '#9B9B9B' : '#44475B';
    const gridColor = isDark ? '#1A1D24' : '#F0F0F0';

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
        borderColor: isDark ? '#2B2B43' : '#E0E0E0',
      },
      rightPriceScale: {
        borderColor: isDark ? '#2B2B43' : '#E0E0E0',
      },
    });
  }, [theme, isDark]);

  // Update data
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  return (
    <div className="w-full h-full flex flex-col border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-1.5 bg-white dark:bg-[#1A1D24] shrink-0 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs font-semibold text-gray-900 dark:text-white">{indicatorName}</span>
        </div>
        {data.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {data[data.length - 1].value.toFixed(2)}
            </span>
          </div>
        )}
      </div>
      <div ref={containerRef} className="w-full flex-1" />
    </div>
  );
}
