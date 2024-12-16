import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const groupSchema = z.object({
  name: z
    .string()
    .min(2, 'Group name must be at least 2 characters')
    .max(50, 'Group name cannot exceed 50 characters')
    .regex(
      /^[a-zA-Z0-9\s-_]+$/,
      'Group name can only contain letters, numbers, spaces, hyphens, and underscores'
    ),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .nullable()
    .transform(val => (val === '' ? null : val)),
});

export type GroupFormData = z.infer<typeof groupSchema>;

interface GroupFormProps {
  defaultValues?: GroupFormData;
  onSubmit: (data: GroupFormData) => Promise<void>;
  isLoading?: boolean;
}

export function GroupForm({ defaultValues, onSubmit, isLoading }: GroupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          description: defaultValues.description,
        }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input label="Group Name" {...register('name')} error={errors.name?.message} />

      <Input label="Description" {...register('description')} error={errors.description?.message} />

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : defaultValues ? 'Save Changes' : 'Add Group'}
        </Button>
      </div>
    </form>
  );
}
