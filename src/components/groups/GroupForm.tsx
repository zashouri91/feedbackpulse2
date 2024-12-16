import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useUIStore } from '../../store/uiStore';

const groupSchema = z.object({
  name: z
    .string()
    .min(2, 'Group name must be at least 2 characters')
    .max(50, 'Group name cannot exceed 50 characters')
    .regex(
      /^[a-zA-Z0-9\s-_]+$/,
      'Group name can only contain letters, numbers, spaces, hyphens, and underscores'
    )
    .trim(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .trim()
    .transform(val => (val === '' ? null : val))
    .nullable(),
});

export type GroupFormData = z.infer<typeof groupSchema>;

interface GroupFormProps {
  defaultValues?: GroupFormData;
  onSubmit: (data: GroupFormData) => Promise<void>;
  isLoading?: boolean;
}

export function GroupForm({ defaultValues, onSubmit, isLoading }: GroupFormProps) {
  const showToast = useUIStore(state => state.showToast);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          description: defaultValues.description,
        }
      : undefined,
  });

  const handleFormSubmit = async (data: GroupFormData) => {
    try {
      await onSubmit(data);
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error('Error submitting group form:', error);
      showToast(
        'error',
        error instanceof Error ? error.message : 'Failed to save group. Please try again.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Group Name"
        {...register('name')}
        error={errors.name?.message}
        required
        placeholder="Enter group name"
      />

      <Input
        label="Description (Optional)"
        {...register('description')}
        error={errors.description?.message}
        multiline
        rows={3}
        placeholder="Enter group description"
        helperText="Add a description to help others understand the purpose of this group"
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || isSubmitting}>
          {isLoading || isSubmitting ? 'Saving...' : defaultValues ? 'Save Changes' : 'Add Group'}
        </Button>
      </div>
    </form>
  );
}
