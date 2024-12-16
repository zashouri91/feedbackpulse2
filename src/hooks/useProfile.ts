import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

export function useProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuthStore();
  const showToast = useUIStore(state => state.showToast);

  const updateProfile = async (data: any) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          title: data.title,
          settings: {
            ...user.settings,
            notificationPreferences: data.notificationPreferences,
          },
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser({
        ...user,
        name: data.fullName,
        email: data.email,
        settings: {
          ...user.settings,
          notificationPreferences: data.notificationPreferences,
        },
      });

      showToast('success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('error', 'Failed to update profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading,
  };
}
