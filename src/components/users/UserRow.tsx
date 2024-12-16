import React, { useState } from 'react';
import { ActionsDropdown } from '../ui/ActionsDropdown';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { AddUserDialog } from './AddUserDialog';
import type { User } from '../../types/auth';

interface UserRowProps {
  user: User;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: Partial<User>) => Promise<void>;
}

export function UserRow({ user, onDelete, onUpdate }: UserRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(user.id);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
        {user.name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.role}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.groupId}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.locationId}</td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
        <ActionsDropdown
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />
      </td>

      <AddUserDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user}
        onSubmit={data => onUpdate(user.id, data)}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </tr>
  );
}
