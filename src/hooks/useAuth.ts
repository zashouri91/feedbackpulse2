import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useAuditLog } from './useAuditLog';
import type { User, AuthUser, UserProfile } from '../types/auth';

export function useAuth() {
  const navigate = useNavigate();
  const { setUser, clearUser, setLoading, setError, setInitialized } =
    useAuthStore();
  const { logAction } = useAuditLog();

  const fetchUserProfile = async (userId: string) => {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, group_id, location_id, organization_id')
      .eq('id', userId)
      .single();

    if (profileError) {
      throw profileError;
    }

    return profile;
  };

  const createUserProfile = async (userId: string, email: string, fullName?: string) => {
    // Create default organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: 'My Organization',
        domain: email?.split('@')[1],
      })
      .select()
      .single();

    if (orgError) {
      throw new Error(`Failed to create organization: ${orgError.message}`);
    }

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        full_name: fullName || email?.split('@')[0],
        role: 'admin', // First user is admin
        organization_id: org.id,
      })
      .select()
      .single();

    if (profileError) {
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }

    return { profile, org };
  };

  const handleUserSession = useCallback(
    async (session: Session) => {
      try {
        setLoading(true);
        console.log('Handling user session for:', session.user.id);
        let profile;

        try {
          profile = await fetchUserProfile(session.user.id);
          console.log('Fetched user profile:', profile.id);
        } catch (error: any) {
          console.error('Error fetching profile:', error);
          // If no profile exists, create one
          if (error.code === 'PGRST116') {
            console.log('Creating new profile for user:', session.user.id);
            const { profile: newProfile } = await createUserProfile(
              session.user.id,
              session.user.email,
              session.user.user_metadata?.full_name
            );
            profile = newProfile;
            await logAction('user.create');
          } else {
            throw error;
          }
        }

        const user: User = {
          id: profile.id,
          email: profile.email,
          name: profile.full_name,
          role: profile.role,
          groupId: profile.group_id,
          locationId: profile.location_id,
          organizationId: profile.organization_id,
        };

        console.log('Setting user in store:', user.id);
        setUser(user);
        return user;
      } catch (error) {
        console.error('Error handling user session:', error);
        setError(error instanceof Error ? error.message : 'Failed to handle user session');
        clearUser();
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [clearUser, setError, logAction, setUser, setLoading]
  );

  useEffect(() => {
    const setupAuth = async () => {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setLoading(true);
        try {
          if (event === 'SIGNED_IN' && session) {
            await handleUserSession(session);
          } else if (event === 'SIGNED_OUT') {
            clearUser();
          }
        } catch (error) {
          console.error('Auth state change error:', error);
        } finally {
          setLoading(false);
        }
      });

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        await handleUserSession(session);
      } else {
        clearUser();
      }

      setInitialized(true);
    };

    setupAuth();

    return () => {
      supabase.auth.onAuthStateChange((_, __) => {});
    };
  }, [clearUser, handleUserSession, setInitialized, setLoading]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Wait for the user session to be handled and get the user
      const user = await handleUserSession(data.session);
      
      // Now that we have the user with organization_id, we can log the action
      await logAction('user.login');
      
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in');
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await logAction('user.logout');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      clearUser();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signOut,
    isLoading: useAuthStore(state => state.loading),
    isInitialized: useAuthStore(state => state.isInitialized),
    user: useAuthStore(state => state.user),
  };
}
