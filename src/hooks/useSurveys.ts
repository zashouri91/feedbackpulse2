import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Survey } from '../types/survey';

export function useSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('*');

      if (error) throw error;
      setSurveys(data || []);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const addSurvey = async (surveyData: Partial<Survey>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('surveys')
        .insert([surveyData]);

      if (error) throw error;
      await fetchSurveys();
    } catch (error) {
      console.error('Error adding survey:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSurvey = async (id: string, surveyData: Partial<Survey>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('surveys')
        .update(surveyData)
        .eq('id', id);

      if (error) throw error;
      await fetchSurveys();
    } catch (error) {
      console.error('Error updating survey:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSurvey = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSurveys();
    } catch (error) {
      console.error('Error deleting survey:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSurveys = async (ids: string[]) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .in('id', ids);

      if (error) throw error;
      await fetchSurveys();
    } catch (error) {
      console.error('Error deleting surveys:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    surveys,
    isLoading,
    addSurvey,
    updateSurvey,
    deleteSurvey,
    deleteSurveys,
  };
}