import React from 'react';
import { X } from 'lucide-react';
import { GroupForm, type GroupFormData } from './GroupForm';
import { useGroups } from '../../hooks/useGroups';

interface AddGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddGroupDialog({ isOpen, onClose }: AddGroupDialogProps) {
  const { addGroup, isLoading } = useGroups();

  const handleSubmit = async (data: GroupFormData) => {
    await addGroup(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Add New Group</h3>
            <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
              <X className="h-6 w-6" />
            </button>
          </div>

          <GroupForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
