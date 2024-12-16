import React from 'react';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { LocationForm } from './LocationForm';
import type { Location } from '../../types/organization';

interface EditLocationDialogProps {
  location: Location;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Location>) => Promise<void>;
  isLoading: boolean;
}

export function EditLocationDialog({
  location,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: EditLocationDialogProps) {
  return (
    <ConfirmDialog
      title="Edit Location"
      isOpen={isOpen}
      onClose={onClose}
      showConfirm={false}
    >
      <LocationForm
        defaultValues={location}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </ConfirmDialog>
  );
}
