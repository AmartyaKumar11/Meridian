"use client";

import { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface NewsEvent {
  timestamp: string;
  title: string;
  sentiment_label: string;
  sentiment_score: number;
  impact_score: number;
  price_change_pct: number | null;
  url: string;
  domain: string;
}

interface NewsToastProps {
  events: NewsEvent[];
  position: { x: number; y: number };
  onClose: () => void;
}

export default function NewsToast({ events, position, onClose }: NewsToastProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  // Filter events based on active filter
  const filteredEvents = events.filter(event => {
    if (activeFilter === 'all') return true;
    return event.sentiment_label === activeFilter;
  });

  // Count events by sentiment
  const counts = {
    all: events.length,
    positive: events.filter(e => e.sentiment_label === 'positive').length,
    negative: events.filter(e => e.sentiment_label === 'negative').length,
    neutral: events.filter(e => e.sentiment_label === 'neutral').length,
  };

  // Get sentiment color
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500/10';
      case 'negative': return 'bg-red-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  return (
    <div
      className="fixed z-50 bg-white dark:bg-[#1A1D24] rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      style={{
        left: `${Math.min(position.x, window.innerWidth - 400)}px`,
        top: `${Math.min(position.y, window.innerHeight - 500)}px`,
        width: '380px',
        maxHeight: '480px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0C0E12]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
            News Events ({events.length})
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-2 bg-gray-50 dark:bg-[#0C0E12] border-b border-gray-200 dark:border-gray-700">
        {(['all', 'positive', 'negative', 'neutral'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-all ${
              activeFilter === filter
                ? 'bg-[#00B386] text-white shadow-sm'
                : 'bg-white dark:bg-[#1A1D24] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
            <span className="ml-1 text-[10px] opacity-75">({counts[filter]})</span>
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="overflow-y-auto" style={{ maxHeight: '360px' }}>
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            No {activeFilter !== 'all' ? activeFilter : ''} news events
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredEvents.map((event, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-50 dark:hover:bg-[#0C0E12] transition-colors"
              >
                {/* Timestamp */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {new Date(event.timestamp).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className={`text-[10px] font-medium ${getSentimentColor(event.sentiment_label)}`}>
                    {event.sentiment_label.toUpperCase()}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {event.title}
                </h4>

                {/* Metrics */}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`px-2 py-0.5 rounded text-[10px] font-medium ${getSentimentBg(event.sentiment_label)} ${getSentimentColor(event.sentiment_label)}`}>
                    Score: {(event.sentiment_score * 100).toFixed(0)}%
                  </div>
                  {event.impact_score > 0 && (
                    <div className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-500">
                      Impact: {event.impact_score.toFixed(2)}
                    </div>
                  )}
                  {event.price_change_pct !== null && event.price_change_pct !== 0 && (
                    <div className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      event.price_change_pct > 0 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {event.price_change_pct > 0 ? '+' : ''}{event.price_change_pct.toFixed(2)}%
                    </div>
                  )}
                </div>

                {/* Source and Link */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {event.domain}
                  </span>
                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-[#00B386] hover:text-[#009970] transition-colors"
                    >
                      Read
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
