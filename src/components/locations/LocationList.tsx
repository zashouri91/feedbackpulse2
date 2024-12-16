import React, { useState } from 'react';
import { useLocations } from '../../hooks/useLocations';
import { AddLocationDialog } from './AddLocationDialog';
import { EditLocationDialog } from './EditLocationDialog';
import { Button } from '../ui/Button';
import { ItemMenu } from '../ui/ItemMenu';
import type { Location } from '../../types/organization';

export function LocationList() {
  const { locations, isLoading, addLocation, updateLocation, deleteLocation } = useLocations();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editLocation, setEditLocation] = useState<Location | null>(null);

  const handleAdd = async (data: Partial<Location>) => {
    try {
      await addLocation(data);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const handleEdit = async (data: Partial<Location>) => {
    if (!editLocation) return;
    try {
      await updateLocation(editLocation.id, data);
      setEditLocation(null);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleDelete = async (location: Location) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      await deleteLocation(location.id);
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Locations</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add Location</Button>
      </div>

      <div className="divide-y divide-gray-200 rounded-md border">
        {locations.map((location) => (
          <div
            key={location.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div>
              <h3 className="font-medium">{location.name}</h3>
              <p className="text-sm text-gray-500">
                {location.address}, {location.city}, {location.state}, {location.country}
              </p>
            </div>
            <ItemMenu
              onEdit={() => setEditLocation(location)}
              onDelete={() => handleDelete(location)}
            />
          </div>
        ))}
        {locations.length === 0 && !isLoading && (
          <div className="p-4 text-center text-gray-500">
            No locations found. Add one to get started.
          </div>
        )}
      </div>

      <AddLocationDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        isLoading={isLoading}
      />

      {editLocation && (
        <EditLocationDialog
          location={editLocation}
          isOpen={true}
          onClose={() => setEditLocation(null)}
          onSubmit={handleEdit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
