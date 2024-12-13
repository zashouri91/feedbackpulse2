import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface RealTimeMetricsProps {
  surveyId?: string;
}

export function RealTimeMetrics({ surveyId }: RealTimeMetricsProps) {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    responsesLastHour: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealTimeMetrics = async () => {
      try {
        const now = new Date();
        const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        const query = supabase
          .from('feedback_responses')
          .select('rating, created_at')
          .gte('created_at', hourAgo.toISOString());

        if (surveyId) {
          query.eq('survey_id', surveyId);
        }

        const { data: responses } = await query;

        if (responses) {
          const totalRating = responses.reduce((sum, r) => sum + r.rating, 0);
          setMetrics({
            activeUsers: Math.floor(Math.random() * 50) + 10, // Placeholder
            responsesLastHour: responses.length,
            averageRating: responses.length ? totalRating / responses.length : 0
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealTimeMetrics();
    const interval = setInterval(fetchRealTimeMetrics, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [surveyId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Real-Time Activity</h3>
        <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Active Users</p>
          <p className="text-2xl font-semibold text-gray-900">
            {metrics.activeUsers}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Responses (1h)</p>
          <p className="text-2xl font-semibold text-gray-900">
            {metrics.responsesLastHour}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Avg Rating (1h)</p>
          <p className="text-2xl font-semibold text-gray-900">
            {metrics.averageRating.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}