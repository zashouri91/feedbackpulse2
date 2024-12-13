import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types/auth';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

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
  }, []);

  const addUser = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([userData]);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', id);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchUsers();
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
  };
}