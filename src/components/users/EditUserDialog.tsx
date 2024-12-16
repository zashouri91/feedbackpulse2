import React from 'react';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { UserForm } from './UserForm';
import type { Profile } from '../../types/auth';

interface EditUserDialogProps {
  user: Profile;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Profile>) => Promise<void>;
  isLoading: boolean;
}

export function EditUserDialog({
  user,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: EditUserDialogProps) {
  return (
    <ConfirmDialog
      title="Edit User"
      isOpen={isOpen}
      onClose={onClose}
      showConfirm={false}
    >
      <UserForm
        defaultValues={user}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </ConfirmDialog>
  );
}
