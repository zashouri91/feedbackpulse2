import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import type { Organization } from '../types/organization';

export function useOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const showToast = useUIStore(state => state.showToast);

  const fetchOrganization = async () => {
    if (!user?.organizationId) return;

    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', user.organizationId)
        .single();

      if (error) throw error;
      setOrganization(data);
    } catch (error) {
      console.error('Error fetching organization:', error);
      showToast('error', 'Failed to load organization data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [user?.organizationId]);

  const updateOrganization = async (data: Partial<Organization>) => {
    if (!user?.organizationId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('organizations')
        .update(data)
        .eq('id', user.organizationId);

      if (error) throw error;
      await fetchOrganization();
      showToast('success', 'Organization settings updated successfully');
    } catch (error) {
      console.error('Error updating organization:', error);
      showToast('error', 'Failed to update organization settings');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    organization,
    isLoading,
    updateOrganization
  };
}