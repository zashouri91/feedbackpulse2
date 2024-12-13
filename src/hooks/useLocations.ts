import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Location } from '../types/organization';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*');

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const addLocation = async (locationData: Partial<Location>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('locations')
        .insert([locationData]);

      if (error) throw error;
      await fetchLocations();
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocation = async (id: string, locationData: Partial<Location>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('locations')
        .update(locationData)
        .eq('id', id);

      if (error) throw error;
      await fetchLocations();
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLocation = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchLocations();
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
  };
}