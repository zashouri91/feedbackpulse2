import React, { useState } from 'react';
import { ActionsDropdown } from '../ui/ActionsDropdown';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { AddGroupDialog } from './AddGroupDialog';
import type { Group } from '../../types/organization';

interface GroupCardProps {
  group: Group;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: Partial<Group>) => Promise<void>;
}

export function GroupCard({ group, onDelete, onUpdate }: GroupCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(group.id);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900">{group.name}</h3>
        {group.description && (
          <p className="text-sm text-gray-500">{group.description}</p>
        )}
      </div>
      
      <div className="flex-shrink-0">
        <ActionsDropdown
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />
      </div>

      <AddGroupDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        group={group}
        onSubmit={(data) => onUpdate(group.id, data)}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Group"
        message={`Are you sure you want to delete ${group.name}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}