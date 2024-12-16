import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { Button } from '../ui/Button';
import { ItemMenu } from '../ui/ItemMenu';
import type { Profile } from '../../types/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'manager', 'user'], {
    required_error: 'Role is required',
  }),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  defaultValues?: Profile;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading?: boolean;
}

function UserForm({ defaultValues, onSubmit, isLoading }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Name" {...register('name')} error={errors.name?.message} />
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      <Select label="Role" {...register('role')} error={errors.role?.message}>
        <option value="user">User</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </Select>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : defaultValues ? 'Save Changes' : 'Add User'}
        </Button>
      </div>
    </form>
  );
}

interface UserDialogProps {
  user?: Profile;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading?: boolean;
}

function UserDialog({ user, isOpen, onClose, onSubmit, isLoading }: UserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
        </DialogHeader>
        <UserForm defaultValues={user} onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}

export function UserList() {
  const { users, isLoading, addUser, updateUser, deleteUser } = useUsers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<Profile | null>(null);

  const handleAdd = async (data: UserFormData) => {
    try {
      await addUser(data);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEdit = async (data: UserFormData) => {
    if (!editUser) return;
    try {
      await updateUser(editUser.id, data);
      setEditUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (user: Profile) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(user.id);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Users</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add User</Button>
      </div>

      <div className="divide-y divide-gray-200 rounded-md border">
        {users?.map(user => (
          <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-gray-500">
                {user.email} • {user.role}
              </p>
            </div>
            <ItemMenu onEdit={() => setEditUser(user)} onDelete={() => handleDelete(user)} />
          </div>
        ))}
        {(!users || users.length === 0) && !isLoading && (
          <div className="p-4 text-center text-gray-500">
            No users found. Add one to get started.
          </div>
        )}
      </div>

      <UserDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        isLoading={isLoading}
      />

      {editUser && (
        <UserDialog
          user={editUser}
          isOpen={true}
          onClose={() => setEditUser(null)}
          onSubmit={handleEdit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
