import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const groupSchema = z.object({
  name: z.string().min(2, 'Group name is required'),
  description: z.string().optional(),
});

export type GroupFormData = z.infer<typeof groupSchema>;

interface GroupFormProps {
  onSubmit: (data: GroupFormData) => Promise<void>;
  isLoading?: boolean;
}

export function GroupForm({ onSubmit, isLoading }: GroupFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Group Name"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Description (Optional)"
        {...register('description')}
        error={errors.description?.message}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding Group...' : 'Add Group'}
        </Button>
      </div>
    </form>
  );
}