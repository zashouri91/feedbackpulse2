import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { handleApiResponse } from '../utils/api';
import type { FeedbackStats, AnalyticsData, FilterOptions } from '../types/feedback';
import { useUIStore } from '../store/uiStore';

export function useAnalytics(filters?: FilterOptions) {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useUIStore(state => state.showToast);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        // Fetch feedback responses with filters
        const query = supabase
          .from('feedback_responses')
          .select('*')
          .order('created_at', { ascending: false });

        if (filters?.startDate) {
          query.gte('created_at', filters.startDate.toISOString());
        }
        if (filters?.endDate) {
          query.lte('created_at', filters.endDate.toISOString());
        }
        if (filters?.groupId) {
          query.eq('group_id', filters.groupId);
        }
        if (filters?.locationId) {
          query.eq('location_id', filters.locationId);
        }

        const responses = await handleApiResponse(query);

        // Calculate statistics
        const stats: FeedbackStats = {
          totalResponses: responses.length,
          averageRating: responses.reduce((acc, r) => acc + r.rating, 0) / responses.length,
          responseRate: calculateResponseRate(responses),
          ratingDistribution: calculateRatingDistribution(responses),
          commonReasons: calculateCommonReasons(responses),
          recentTrend: calculateRecentTrend(responses),
        };

        setStats(stats);
      } catch (error) {
        showToast('error', 'Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [filters, showToast]);

  return { stats, isLoading };
}

// Helper functions
function calculateResponseRate(responses: any[]): number {
  // Implementation depends on your business logic
  return (responses.length / 100) * 100; // Placeholder
}

function calculateRatingDistribution(responses: any[]): Record<number, number> {
  return responses.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  }, {});
}

function calculateCommonReasons(responses: any[]): Array<{ reason: string; count: number }> {
  const reasons = responses.reduce((acc, r) => {
    acc[r.reason] = (acc[r.reason] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(reasons)
    .map(([reason, count]) => ({ reason, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function calculateRecentTrend(
  responses: any[]
): Array<{ date: string; averageRating: number; responses: number }> {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyStats = responses.reduce((acc, r) => {
    const date = new Date(r.created_at).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { total: 0, sum: 0, count: 0 };
    }
    acc[date].total++;
    acc[date].sum += r.rating;
    acc[date].count++;
    return acc;
  }, {});

  return last30Days.map(date => ({
    date,
    averageRating: dailyStats[date]?.sum / dailyStats[date]?.count || 0,
    responses: dailyStats[date]?.total || 0,
  }));
}
