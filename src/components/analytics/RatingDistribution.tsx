import React from 'react';
import { Bar } from 'react-chartjs-2';
import '../../lib/chartjs';
import type { FeedbackStats } from '../../types/feedback';

interface RatingDistributionProps {
  distribution: FeedbackStats['ratingDistribution'];
}

export function RatingDistribution({ distribution }: RatingDistributionProps) {
  const chartData = {
    labels: Object.keys(distribution),
    datasets: [
      {
        data: Object.values(distribution),
        backgroundColor: [
          '#ef4444', // 1 star
          '#f97316', // 2 stars
          '#eab308', // 3 stars
          '#84cc16', // 4 stars
          '#22c55e', // 5 stars
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Rating Distribution
      </h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}