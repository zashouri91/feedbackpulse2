import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUIStore } from '../store/uiStore';
import type { FeedbackResponse } from '../types/feedback';

export function useFeedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useUIStore(state => state.showToast);

  const submitFeedback = async (data: Partial<FeedbackResponse>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('feedback_responses')
        .insert([data]);

      if (error) throw error;
      showToast('success', 'Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showToast('error', 'Failed to submit feedback. Please try again.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitFeedback,
    isSubmitting
  };
}