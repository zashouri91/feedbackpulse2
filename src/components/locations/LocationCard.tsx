import React, { useState } from 'react';
import { ActionsDropdown } from '../ui/ActionsDropdown';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { AddLocationDialog } from './AddLocationDialog';
import type { Location } from '../../types/organization';

interface LocationCardProps {
  location: Location;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: Partial<Location>) => Promise<void>;
}

export function LocationCard({ location, onDelete, onUpdate }: LocationCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(location.id);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="relative flex flex-col space-y-2 rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:border-gray-400">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{location.name}</h3>
          <p className="text-sm text-gray-500">
            {location.address}, {location.city}
          </p>
          <p className="text-sm text-gray-500">
            {location.state}, {location.country}
          </p>
        </div>
        
        <ActionsDropdown
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />
      </div>

      <AddLocationDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        location={location}
        onSubmit={(data) => onUpdate(location.id, data)}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Location"
        message={`Are you sure you want to delete ${location.name}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}