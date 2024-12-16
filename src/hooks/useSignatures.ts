import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { generateTrackingCode } from '../utils/survey';
import type { Signature } from '../types/signature';

export function useSignatures() {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchSignatures = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.from('signatures').select('*').eq('user_id', user.id);

      if (error) throw error;
      setSignatures(data || []);
    } catch (error) {
      console.error('Error fetching signatures:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSignatures();
  }, [fetchSignatures]);

  const addSignature = async (data: Partial<Signature>) => {
    if (!user) return;

    try {
      const trackingCode = generateTrackingCode({
        userId: user.id,
        groupId: user.groupId,
        locationId: user.locationId,
      });

      const { error } = await supabase.from('signatures').insert([
        {
          ...data,
          user_id: user.id,
          tracking_code: trackingCode,
        },
      ]);

      if (error) throw error;
      await fetchSignatures();
    } catch (error) {
      console.error('Error adding signature:', error);
      throw error;
    }
  };

  return {
    signatures,
    isLoading,
    addSignature,
  };
}
