import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { FeedbackResponse } from '../types/feedback';

export function useRealTimeAnalytics(surveyId?: string) {
  const [realTimeData, setRealTimeData] = useState<{
    recentResponses: FeedbackResponse[];
    activeUsers: number;
    responseRate: number;
  }>({
    recentResponses: [],
    activeUsers: 0,
    responseRate: 0,
  });

  useEffect(() => {
    // Subscribe to real-time feedback responses
    const subscription = supabase
      .channel('feedback_responses')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback_responses',
          filter: surveyId ? `survey_id=eq.${surveyId}` : undefined,
        },
        payload => {
          setRealTimeData(prev => ({
            ...prev,
            recentResponses: [payload.new as FeedbackResponse, ...prev.recentResponses].slice(
              0,
              10
            ),
            responseRate: calculateResponseRate(prev.recentResponses.length + 1),
          }));
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [surveyId]);

  return realTimeData;
}

function calculateResponseRate(responses: number): number {
  // Implement your response rate calculation logic
  return (responses / 100) * 100; // Placeholder
}
