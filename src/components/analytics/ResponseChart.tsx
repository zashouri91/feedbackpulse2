import React from 'react';
import { Line } from 'react-chartjs-2';
import '../../lib/chartjs';
import type { FeedbackStats } from '../../types/feedback';

interface ResponseChartProps {
  data: FeedbackStats['recentTrend'];
  type: 'rating' | 'responses';
}

export function ResponseChart({ data, type }: ResponseChartProps) {
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: type === 'rating' ? 'Average Rating' : 'Response Count',
        data: data.map(d => type === 'rating' ? d.averageRating : d.responses),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: type === 'rating' ? 1 : 0
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {type === 'rating' ? 'Rating Trend' : 'Response Trend'}
      </h3>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}