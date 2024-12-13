import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useAuditLog } from './useAuditLog';
import type { User } from '../types/auth';

export function useAuth() {
  const navigate = useNavigate();
  const { setUser, clearUser, setLoading } = useAuthStore();
  const { logAction } = useAuditLog();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session) {
          try {
            console.log('Fetching profile for user:', session.user.id);
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id, email, full_name, role, group_id, location_id, organization_id')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              console.error('Error fetching profile:', profileError);
              console.error('Profile error details:', {
                message: profileError.message,
                details: profileError.details,
                hint: profileError.hint
              });
              setLoading(false);
              return;
            }

            console.log('Profile data:', profile);

            if (profile) {
              const user: User = {
                id: profile.id,
                email: profile.email,
                name: profile.full_name,
                role: profile.role,
                groupId: profile.group_id,
                locationId: profile.location_id,
                organizationId: profile.organization_id
              };
              console.log('Setting user:', user);
              setUser(user);
              
              if (event === 'SIGNED_IN') {
                try {
                  await logAction('user.login');
                } catch (error) {
                  console.error('Error logging login:', error);
                }
              }
            } else {
              console.error('No profile found for user:', session.user.id);
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
          }
        } else {
          console.log('No session, clearing user');
          if (event === 'SIGNED_OUT') {
            try {
              await logAction('user.logout');
            } catch (error) {
              console.error('Error logging logout:', error);
            }
          }
          clearUser();
          if (window.location.pathname !== '/login') {
            navigate('/login');
          }
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, setUser, clearUser, setLoading, logAction]);

  return {
    signIn: async (email: string, password: string) => {
      try {
        console.log('Attempting sign in for:', email);
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) {
          console.error('Sign in error:', error);
        }
        return { error };
      } catch (error) {
        console.error('Unexpected sign in error:', error);
        return { error: error as any };
      }
    },
    
    signUp: async (email: string, password: string, userData: Partial<User>) => {
      try {
        console.log('Attempting sign up for:', email);
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (signUpError || !data.user) {
          console.error('Sign up error:', signUpError);
          return { error: signUpError };
        }

        console.log('Creating profile for:', data.user.id);
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: userData.name,
            role: userData.role || 'user',
            organization_id: userData.organizationId
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        try {
          await logAction('user.create', { userId: data.user.id });
        } catch (error) {
          console.error('Error logging user creation:', error);
        }

        return { error: profileError };
      } catch (error) {
        console.error('Unexpected sign up error:', error);
        return { error: error as any };
      }
    },
    
    resetPassword: async (email: string) => {
      return supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
    },
    
    updatePassword: async (newPassword: string) => {
      return supabase.auth.updateUser({ password: newPassword });
    },
    
    signOut: async () => {
      try {
        await logAction('user.logout');
      } catch (error) {
        console.error('Error logging logout:', error);
      }
      return supabase.auth.signOut();
    }
  };
}