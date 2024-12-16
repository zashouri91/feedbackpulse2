import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { FeedbackStats } from '../../types/feedback';

interface DashboardStatsProps {
  stats: FeedbackStats;
  previousStats?: FeedbackStats;
}

export function DashboardStats({ stats, previousStats }: DashboardStatsProps) {
  const getPercentageChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const renderTrend = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    if (change < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const metrics = [
    {
      label: 'Total Responses',
      value: stats.totalResponses,
      change: previousStats
        ? getPercentageChange(stats.totalResponses, previousStats.totalResponses)
        : 0,
      format: (v: number) => v.toLocaleString(),
    },
    {
      label: 'Average Rating',
      value: stats.averageRating,
      change: previousStats
        ? getPercentageChange(stats.averageRating, previousStats.averageRating)
        : 0,
      format: (v: number) => v.toFixed(1),
    },
    {
      label: 'Response Rate',
      value: stats.responseRate,
      change: previousStats
        ? getPercentageChange(stats.responseRate, previousStats.responseRate)
        : 0,
      format: (v: number) => `${v.toFixed(1)}%`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map(metric => (
        <div key={metric.label} className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{metric.label}</h3>
            {renderTrend(metric.change)}
          </div>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{metric.format(metric.value)}</p>
            {metric.change !== 0 && (
              <p
                className={`ml-2 text-sm ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {metric.change > 0 ? '+' : ''}
                {metric.change.toFixed(1)}%
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
