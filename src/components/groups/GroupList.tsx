import React, { useState } from 'react';
import { useGroups } from '../../hooks/useGroups';
import { Button } from '../ui/Button';
import { ItemMenu } from '../ui/ItemMenu';
import type { Group } from '../../types/organization';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const groupSchema = z.object({
  name: z.string().min(2, 'Group name is required'),
  description: z.string().optional(),
});

type GroupFormData = z.infer<typeof groupSchema>;

interface GroupFormProps {
  defaultValues?: Group;
  onSubmit: (data: GroupFormData) => Promise<void>;
  isLoading?: boolean;
}

function GroupForm({ defaultValues, onSubmit, isLoading }: GroupFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Group Name"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label="Description"
        {...register('description')}
        error={errors.description?.message}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : defaultValues ? 'Save Changes' : 'Add Group'}
        </Button>
      </div>
    </form>
  );
}

interface GroupDialogProps {
  group?: Group;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GroupFormData) => Promise<void>;
  isLoading?: boolean;
}

function GroupDialog({ group, isOpen, onClose, onSubmit, isLoading }: GroupDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{group ? 'Edit Group' : 'Add Group'}</DialogTitle>
        </DialogHeader>
        <GroupForm
          defaultValues={group}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}

export function GroupList() {
  const { groups, isLoading, addGroup, updateGroup, deleteGroup } = useGroups();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<Group | null>(null);

  const handleAdd = async (data: GroupFormData) => {
    try {
      await addGroup(data);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding group:', error);
    }
  };

  const handleEdit = async (data: GroupFormData) => {
    if (!editGroup) return;
    try {
      await updateGroup(editGroup.id, data);
      setEditGroup(null);
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  const handleDelete = async (group: Group) => {
    if (!confirm('Are you sure you want to delete this group?')) return;
    try {
      await deleteGroup(group.id);
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Groups</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add Group</Button>
      </div>

      <div className="divide-y divide-gray-200 rounded-md border">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div>
              <h3 className="font-medium">{group.name}</h3>
              {group.description && (
                <p className="text-sm text-gray-500">{group.description}</p>
              )}
            </div>
            <ItemMenu
              onEdit={() => setEditGroup(group)}
              onDelete={() => handleDelete(group)}
            />
          </div>
        ))}
        {groups.length === 0 && !isLoading && (
          <div className="p-4 text-center text-gray-500">
            No groups found. Add one to get started.
          </div>
        )}
      </div>

      <GroupDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        isLoading={isLoading}
      />

      {editGroup && (
        <GroupDialog
          group={editGroup}
          isOpen={true}
          onClose={() => setEditGroup(null)}
          onSubmit={handleEdit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
