import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useGroups } from '../../hooks/useGroups';
import { useLocations } from '../../hooks/useLocations';
import type { Role } from '../../types/auth';

const userSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'manager', 'user'] as const),
  groupId: z.string().optional(),
  locationId: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  defaultValues?: UserFormData;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading?: boolean;
}

const roles: { label: string; value: Role }[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'User', value: 'user' },
];

export function UserForm({ defaultValues, onSubmit, isLoading }: UserFormProps) {
  const { groups } = useGroups();
  const { locations } = useLocations();
  
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues ? {
      firstName: defaultValues.firstName,
      lastName: defaultValues.lastName,
      email: defaultValues.email,
      role: defaultValues.role,
      groupId: defaultValues.groupId,
      locationId: defaultValues.locationId,
    } : undefined
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="First Name"
          {...register('firstName')}
          error={errors.firstName?.message}
        />
        
        <Input
          label="Last Name"
          {...register('lastName')}
          error={errors.lastName?.message}
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Select
        label="Role"
        {...register('role')}
        error={errors.role?.message}
      >
        <option value="">Select a role</option>
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </Select>

      <Select
        label="Group"
        {...register('groupId')}
        error={errors.groupId?.message}
      >
        <option value="">Select a group</option>
        {groups?.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </Select>

      <Select
        label="Location"
        {...register('locationId')}
        error={errors.locationId?.message}
      >
        <option value="">Select a location</option>
        {locations?.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </Select>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : defaultValues ? 'Save Changes' : 'Add User'}
        </Button>
      </div>
    </form>
  );
}