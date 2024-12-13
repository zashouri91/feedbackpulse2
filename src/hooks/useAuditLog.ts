import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { AuditAction } from '../types/audit';

export function useAuditLog() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const logAction = async (
    action: AuditAction,
    metadata: Record<string, any> = {}
  ) => {
    if (!user?.id || !user?.organizationId) {
      console.warn('Cannot log action: user not fully initialized');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert([{
          action,
          user_id: user.id,
          organization_id: user.organizationId,
          metadata,
          ip_address: window.clientInformation?.userAgent || null,
          user_agent: navigator.userAgent || null
        }]);

      if (error) {
        console.error('Error inserting audit log:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error logging audit action:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logAction,
    isLoading
  };
}