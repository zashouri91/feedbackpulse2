import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Group } from '../types/organization';

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*');

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const addGroup = async (groupData: Partial<Group>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('groups')
        .insert([groupData]);

      if (error) throw error;
      await fetchGroups();
    } catch (error) {
      console.error('Error adding group:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGroup = async (id: string, groupData: Partial<Group>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('groups')
        .update(groupData)
        .eq('id', id);

      if (error) throw error;
      await fetchGroups();
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGroup = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    groups,
    isLoading,
    addGroup,
    updateGroup,
    deleteGroup,
  };
}