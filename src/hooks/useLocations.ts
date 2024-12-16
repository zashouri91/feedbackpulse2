import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Location } from '../types/organization';
import { RealtimeChannel } from '@supabase/supabase-js';
import { generateId } from '../lib/utils';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchLocations = async () => {
    if (!user?.organizationId) return;
    
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('organization_id', user.organizationId);

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      if (!user?.organizationId) return;

      // Initial fetch
      await fetchLocations();

      // Set up real-time subscription
      channel = supabase
        .channel('locations_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'locations',
            filter: `organization_id=eq.${user.organizationId}`,
          },
          (payload) => {
            console.log('Location inserted:', payload);
            setLocations((current) => [...current, payload.new as Location]);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'locations',
            filter: `organization_id=eq.${user.organizationId}`,
          },
          (payload) => {
            console.log('Location updated:', payload);
            setLocations((current) =>
              current.map((loc) =>
                loc.id === payload.new.id ? (payload.new as Location) : loc
              )
            );
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'locations',
            filter: `organization_id=eq.${user.organizationId}`,
          },
          (payload) => {
            console.log('Location deleted:', payload);
            setLocations((current) =>
              current.filter((loc) => loc.id !== payload.old.id)
            );
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
  }, [user?.organizationId]);

  const addLocation = async (locationData: Partial<Location>) => {
    if (!user?.organizationId) {
      throw new Error('No organization ID found');
    }

    setIsLoading(true);
    
    // Create a temporary ID for optimistic update
    const tempId = generateId();
    const tempLocation = {
      id: tempId,
      ...locationData,
      organization_id: user.organizationId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Location;
    
    // Optimistically add the location
    setLocations(current => [...current, tempLocation]);

    try {
      const { data, error } = await supabase
        .from('locations')
        .insert([{
          ...locationData,
          organization_id: user.organizationId
        }])
        .select()
        .single();

      if (error) {
        // Revert optimistic update on error
        setLocations(current => current.filter(loc => loc.id !== tempId));
        throw error;
      }

      // Replace temp location with real one
      setLocations(current => 
        current.map(loc => loc.id === tempId ? data : loc)
      );
      
      return data;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocation = async (id: string, locationData: Partial<Location>) => {
    if (!user?.organizationId) {
      throw new Error('No organization ID found');
    }

    setIsLoading(true);
    
    // Store the original location for rollback
    const originalLocation = locations.find(loc => loc.id === id);
    
    // Optimistically update the location
    setLocations(current =>
      current.map(loc => loc.id === id ? { ...loc, ...locationData } : loc)
    );

    try {
      const { data, error } = await supabase
        .from('locations')
        .update(locationData)
        .eq('id', id)
        .eq('organization_id', user.organizationId)
        .select()
        .single();

      if (error) {
        // Revert optimistic update on error
        if (originalLocation) {
          setLocations(current =>
            current.map(loc => loc.id === id ? originalLocation : loc)
          );
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLocation = async (id: string) => {
    if (!user?.organizationId) {
      throw new Error('No organization ID found');
    }

    setIsLoading(true);
    
    // Store the location for rollback
    const deletedLocation = locations.find(loc => loc.id === id);
    
    // Optimistically remove the location
    setLocations(current => current.filter(loc => loc.id !== id));

    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id)
        .eq('organization_id', user.organizationId);

      if (error) {
        // Revert optimistic delete on error
        if (deletedLocation) {
          setLocations(current => [...current, deletedLocation]);
        }
        throw error;
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    locations,
    isLoading,
    addLocation,
    updateLocation,
    deleteLocation,
    refetch: fetchLocations,
  };
}