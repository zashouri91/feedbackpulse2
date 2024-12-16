import React from 'react';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { GroupForm } from './GroupForm';
import type { Group } from '../../types/organization';

interface EditGroupDialogProps {
  group: Group;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Group>) => Promise<void>;
  isLoading: boolean;
}

export function EditGroupDialog({
  group,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: EditGroupDialogProps) {
  return (
    <ConfirmDialog title="Edit Group" isOpen={isOpen} onClose={onClose} showConfirm={false}>
      <GroupForm defaultValues={group} onSubmit={onSubmit} isLoading={isLoading} />
    </ConfirmDialog>
  );
}
