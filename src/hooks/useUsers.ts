import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Profile } from '../types/auth';
import { generateId } from '../lib/utils';

export function useUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchUsers = async () => {
    if (!user?.organizationId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('organization_id', user.organizationId);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user?.organizationId]);

  const addUser = async (userData: Partial<Profile>) => {
    if (!user?.organizationId) {
      throw new Error('No organization ID found');
    }

    setIsLoading(true);
    
    // Create a temporary ID for optimistic update
    const tempId = generateId();
    const tempUser = {
      id: tempId,
      ...userData,
      organization_id: user.organizationId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Profile;
    
    // Optimistically add the user
    setUsers(current => [...current, tempUser]);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          ...userData,
          organization_id: user.organizationId
        }])
        .select()
        .single();

      if (error) {
        // Revert optimistic update on error
        setUsers(current => current.filter(u => u.id !== tempId));
        throw error;
      }

      // Replace temp user with real one
      setUsers(current => 
        current.map(u => u.id === tempId ? data : u)
      );
      
      return data;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Partial<Profile>) => {
    if (!user?.organizationId) {
      throw new Error('No organization ID found');
    }

    setIsLoading(true);
    
    // Store the original user for rollback
    const originalUser = users.find(u => u.id === id);
    
    // Optimistically update the user
    setUsers(current =>
      current.map(u => u.id === id ? { ...u, ...userData } : u)
    );

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', id)
        .eq('organization_id', user.organizationId)
        .select()
        .single();

      if (error) {
        // Revert optimistic update on error
        if (originalUser) {
          setUsers(current =>
            current.map(u => u.id === id ? originalUser : u)
          );
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!user?.organizationId) {
      throw new Error('No organization ID found');
    }

    setIsLoading(true);
    
    // Store the user for rollback
    const deletedUser = users.find(u => u.id === id);
    
    // Optimistically remove the user
    setUsers(current => current.filter(u => u.id !== id));

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)
        .eq('organization_id', user.organizationId);

      if (error) {
        // Revert optimistic delete on error
        if (deletedUser) {
          setUsers(current => [...current, deletedUser]);
        }
        throw error;
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    addUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers,
  };
}