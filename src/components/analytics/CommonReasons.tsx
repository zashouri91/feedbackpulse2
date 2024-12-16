import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { FeedbackStats } from '../../types/feedback';

interface CommonReasonsProps {
  reasons: FeedbackStats['commonReasons'];
}

export function CommonReasons({ reasons }: CommonReasonsProps) {
  const chartData = {
    labels: reasons.map(r => r.reason),
    datasets: [
      {
        data: reasons.map(r => r.count),
        backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-medium text-gray-900">Common Feedback Reasons</h3>
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
