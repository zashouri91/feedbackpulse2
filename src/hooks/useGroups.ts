import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Group } from '../types/organization';
import { RealtimeChannel } from '@supabase/supabase-js';
import { generateId } from '../lib/utils';

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchGroups = useCallback(async () => {
    if (!user?.organizationId) return;

    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('organization_id', user.organizationId);

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.organizationId]);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      if (!user?.organizationId) return;

      // Initial fetch
      await fetchGroups();

      // Set up real-time subscription
      channel = supabase
        .channel('groups_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'groups',
            filter: `organization_id=eq.${user.organizationId}`,
          },
          payload => {
            console.log('Group inserted:', payload);
            setGroups(current => [...current, payload.new as Group]);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'groups',
            filter: `organization_id=eq.${user.organizationId}`,
          },
          payload => {
            console.log('Group updated:', payload);
            setGroups(current =>
              current.map(group => (group.id === payload.new.id ? (payload.new as Group) : group))
            );
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'groups',
            filter: `organization_id=eq.${user.organizationId}`,
          },
          payload => {
            console.log('Group deleted:', payload);
            setGroups(current => current.filter(group => group.id !== payload.old.id));
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.organizationId, fetchGroups]);

  const addGroup = async (groupData: Partial<Group>) => {
    if (!user?.organizationId) {
      throw new Error('No organization ID found');
    }

    setIsLoading(true);

    // Create a temporary ID for optimistic update
    const tempId = generateId();
    const tempGroup = {
      id: tempId,
      ...groupData,
      organization_id: user.organizationId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Group;

    // Optimistically add the group
    setGroups(current => [...current, tempGroup]);

    try {
      const { data, error } = await supabase
        .from('groups')
        .insert([
          {
            ...groupData,
            organization_id: user.organizationId,
          },
        ])
        .select()
        .single();

      if (error) {
        // Revert optimistic update on error
        setGroups(current => current.filter(group => group.id !== tempId));
        throw error;
      }

      // Replace temp group with real one
      setGroups(current => current.map(group => (group.id === tempId ? data : group)));

      return data;
    } catch (error) {
      console.error('Error adding group:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGroup = async (id: string, groupData: Partial<Group>) => {
    if (!user?.organizationId) {
      throw new Error('No organization ID found');
    }

    setIsLoading(true);

    // Store the original group for rollback
    const originalGroup = groups.find(group => group.id === id);

    // Optimistically update the group
    setGroups(current =>
      current.map(group => (group.id === id ? { ...group, ...groupData } : group))
    );

    try {
      const { data, error } = await supabase
        .from('groups')
        .update(groupData)
        .eq('id', id)
        .eq('organization_id', user.organizationId)
        .select()
        .single();

      if (error) {
        // Revert optimistic update on error
        if (originalGroup) {
          setGroups(current => current.map(group => (group.id === id ? originalGroup : group)));
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGroup = async (id: string) => {
    if (!user?.organizationId) {
      throw new Error('No organization ID found');
    }

    setIsLoading(true);

    // Store the group for rollback
    const deletedGroup = groups.find(group => group.id === id);

    // Optimistically remove the group
    setGroups(current => current.filter(group => group.id !== id));

    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id)
        .eq('organization_id', user.organizationId);

      if (error) {
        // Revert optimistic delete on error
        if (deletedGroup) {
          setGroups(current => [...current, deletedGroup]);
        }
        throw error;
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    isLoading,
    addGroup,
    updateGroup,
    deleteGroup,
    refetch: fetchGroups,
  };
}
