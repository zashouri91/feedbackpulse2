import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useAuditLog } from './useAuditLog';
import type { User } from '../types/auth';

export function useAuth() {
  const navigate = useNavigate();
  const { setUser, clearUser, setLoading, setError } = useAuthStore();
  const { logAction } = useAuditLog();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session) {
          try {
            console.log('Fetching profile for user:', session.user.id);
            
            // First check if user has a profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id, email, full_name, role, group_id, location_id, organization_id')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              console.error('Error fetching profile:', profileError);
              
              // If no profile exists, create one with a new organization
              if (profileError.code === 'PGRST116') {
                console.log('No profile found, creating new profile with organization');
                
                // Create default organization
                const { data: org, error: orgError } = await supabase
                  .from('organizations')
                  .insert({
                    name: 'My Organization',
                    domain: session.user.email?.split('@')[1]
                  })
                  .select()
                  .single();

                if (orgError) {
                  throw new Error(`Failed to create organization: ${orgError.message}`);
                }

                // Create profile
                const { data: newProfile, error: newProfileError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email,
                    full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                    role: 'user',
                    organization_id: org.id
                  })
                  .select()
                  .single();

                if (newProfileError) {
                  throw new Error(`Failed to create profile: ${newProfileError.message}`);
                }

                const user: User = {
                  id: newProfile.id,
                  email: newProfile.email,
                  name: newProfile.full_name,
                  role: newProfile.role,
                  groupId: null,
                  locationId: null,
                  organizationId: org.id
                };
                
                setUser(user);
                await logAction('user.create');
                navigate('/dashboard');
                return;
              }
              
              setError(profileError.message);
              setLoading(false);
              return;
            }

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
              
              setUser(user);
              if (event === 'SIGNED_IN') {
                await logAction('user.login');
                navigate('/dashboard');
              }
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
            clearUser();
          }
        } else {
          console.log('No session, clearing user');
          if (event === 'SIGNED_OUT') {
            await logAction('user.logout');
            navigate('/login');
          }
          clearUser();
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, setUser, clearUser, setLoading, setError, logAction]);

  return {
    signIn: async (email: string, password: string) => {
      try {
        setLoading(true);
        console.log('Attempting sign in for:', email);
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) {
          console.error('Sign in error:', error);
          setError(error.message);
        }
        return { error };
      } catch (error) {
        console.error('Unexpected sign in error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
        return { error: error as any };
      } finally {
        setLoading(false);
      }
    },
    
    signUp: async (email: string, password: string, userData: Partial<User>) => {
      try {
        setLoading(true);
        console.log('Attempting sign up for:', email);
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: userData.name
            }
          }
        });

        if (signUpError || !data.user) {
          console.error('Sign up error:', signUpError);
          setError(signUpError?.message || 'Failed to sign up');
          return { error: signUpError };
        }

        // Profile will be created in the onAuthStateChange handler
        return { error: null };
      } catch (error) {
        console.error('Unexpected sign up error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
        return { error: error as any };
      } finally {
        setLoading(false);
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
        setLoading(true);
        await logAction('user.logout');
        await supabase.auth.signOut();
        navigate('/login');
      } catch (error) {
        console.error('Error signing out:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    }
  };
}