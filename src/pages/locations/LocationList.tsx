import React, { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { AddLocationDialog } from '../../components/locations/AddLocationDialog';
import { useLocations } from '../../hooks/useLocations';

export default function LocationList() {
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const { locations, isLoading } = useLocations();

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Locations</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your organization's locations and addresses.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button onClick={() => setIsAddLocationOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : locations.length === 0 ? (
          <div className="col-span-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No locations</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new location.</p>
              <div className="mt-6">
                <Button size="sm" onClick={() => setIsAddLocationOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </div>
          </div>
        ) : (
          locations.map((location) => (
            <div
              key={location.id}
              className="relative flex flex-col space-y-2 rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:border-gray-400"
            >
              <h3 className="text-lg font-medium text-gray-900">{location.name}</h3>
              <p className="text-sm text-gray-500">
                {location.address}, {location.city}
              </p>
              <p className="text-sm text-gray-500">
                {location.state}, {location.country}
              </p>
            </div>
          ))
        )}
      </div>

      <AddLocationDialog
        isOpen={isAddLocationOpen}
        onClose={() => setIsAddLocationOpen(false)}
      />
    </div>
  );
}