import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Location } from '../../types/organization';

const locationSchema = z.object({
  name: z.string().min(2, 'Location name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
});

export type LocationFormData = z.infer<typeof locationSchema>;

interface LocationFormProps {
  defaultValues?: Location;
  onSubmit: (data: LocationFormData) => Promise<void>;
  isLoading?: boolean;
}

export function LocationForm({ defaultValues, onSubmit, isLoading }: LocationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input label="Location Name" {...register('name')} error={errors.name?.message} />

      <Input label="Address" {...register('address')} error={errors.address?.message} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Input label="City" {...register('city')} error={errors.city?.message} />

        <Input label="State" {...register('state')} error={errors.state?.message} />

        <Input label="Country" {...register('country')} error={errors.country?.message} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : defaultValues ? 'Save Changes' : 'Add Location'}
        </Button>
      </div>
    </form>
  );
}
