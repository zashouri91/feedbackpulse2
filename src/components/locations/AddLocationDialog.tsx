import React from 'react';
import { X } from 'lucide-react';
import { LocationForm, type LocationFormData } from './LocationForm';
import { useLocations } from '../../hooks/useLocations';

interface AddLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddLocationDialog({ isOpen, onClose }: AddLocationDialogProps) {
  const { addLocation, isLoading } = useLocations();

  const handleSubmit = async (data: LocationFormData) => {
    await addLocation(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Add New Location</h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <LocationForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}