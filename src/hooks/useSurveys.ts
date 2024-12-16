import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Survey } from '../types/survey';

export function useSurveys(id?: string) {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSurvey = async (surveyId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: apiError } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', surveyId)
        .single();

      if (apiError) throw new Error(apiError.message);
      setSurvey(data);
    } catch (err) {
      console.error('Error fetching survey:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch survey'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSurveys = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: apiError } = await supabase
        .from('surveys')
        .select('*');

      if (apiError) throw new Error(apiError.message);
      setSurveys(data || []);
    } catch (err) {
      console.error('Error fetching surveys:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch surveys'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSurvey(id);
    } else {
      fetchSurveys();
    }
  }, [id]);

  const addSurvey = async (surveyData: Partial<Survey>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: apiError } = await supabase
        .from('surveys')
        .insert([surveyData]);

      if (apiError) throw new Error(apiError.message);
      if (id) {
        await fetchSurvey(id);
      } else {
        await fetchSurveys();
      }
    } catch (err) {
      console.error('Error adding survey:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSurvey = async (surveyId: string, surveyData: Partial<Survey>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: apiError } = await supabase
        .from('surveys')
        .update(surveyData)
        .eq('id', surveyId);

      if (apiError) throw new Error(apiError.message);
      if (id) {
        await fetchSurvey(id);
      } else {
        await fetchSurveys();
      }
    } catch (err) {
      console.error('Error updating survey:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSurvey = async (surveyId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: apiError } = await supabase
        .from('surveys')
        .delete()
        .eq('id', surveyId);

      if (apiError) throw new Error(apiError.message);
      if (id) {
        setSurvey(null);
      } else {
        await fetchSurveys();
      }
    } catch (err) {
      console.error('Error deleting survey:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSurveys = async (ids: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: apiError } = await supabase
        .from('surveys')
        .delete()
        .in('id', ids);

      if (apiError) throw new Error(apiError.message);
      await fetchSurveys();
    } catch (err) {
      console.error('Error deleting surveys:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    survey: id ? survey : undefined,
    surveys: id ? [] : surveys,
    isLoading,
    error,
    addSurvey,
    updateSurvey,
    deleteSurvey,
    deleteSurveys,
    refresh: id ? () => fetchSurvey(id) : fetchSurveys
  };
}