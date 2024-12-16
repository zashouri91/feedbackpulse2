import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useAuditLog } from './useAuditLog';
import type { User } from '../types/auth';

export function useAuth() {
  const navigate = useNavigate();
  const { setUser, clearUser, setLoading, setError, initialize } = useAuthStore();
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
        domain: email?.split('@')[1]
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
        organization_id: org.id
      })
      .select()
      .single();

    if (profileError) {
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }

    return { profile, org };
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);

        // First try to get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          throw sessionError;
        }

        console.log('Initial session:', session?.user?.id);
        
        if (session?.user && mounted) {
          await handleUserSession(session.user);
        } else if (mounted) {
          clearUser();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          clearUser();
        }
      } finally {
        if (mounted) {
          initialize();
          setLoading(false);
        }
      }
    };

    // Initialize auth on mount
    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        switch (event) {
          case 'INITIAL_SESSION':
            if (session?.user && mounted) {
              await handleUserSession(session.user);
            }
            break;
          case 'SIGNED_IN':
            if (session?.user && mounted) {
              await handleUserSession(session.user);
            }
            break;
          case 'SIGNED_OUT':
            if (mounted) {
              clearUser();
            }
            break;
          case 'TOKEN_REFRESHED':
            if (session?.user && mounted) {
              await handleUserSession(session.user);
            }
            break;
          default:
            console.log('Unhandled auth event:', event);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleUserSession = async (sessionUser: any) => {
    try {
      setLoading(true);
      console.log('Handling user session for:', sessionUser.id);
      let profile;

      try {
        profile = await fetchUserProfile(sessionUser.id);
        console.log('Fetched user profile:', profile.id);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        // If no profile exists, create one
        if (error.code === 'PGRST116') {
          console.log('Creating new profile for user:', sessionUser.id);
          const { profile: newProfile } = await createUserProfile(
            sessionUser.id,
            sessionUser.email,
            sessionUser.user_metadata?.full_name
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
        organizationId: profile.organization_id
      };
      
      console.log('Setting user in store:', user.id);
      setUser(user);
    } catch (error) {
      console.error('Error handling user session:', error);
      setError(error instanceof Error ? error.message : 'Failed to handle user session');
      clearUser();
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
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
    signOut
  };
}