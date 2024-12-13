import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useProfile } from '../../hooks/useProfile';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  title: z.string().optional(),
  notificationPreferences: z.object({
    email: z.boolean(),
    inApp: z.boolean()
  })
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function UserProfile() {
  const { user } = useAuthStore();
  const { updateProfile, isLoading } = useProfile();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      notificationPreferences: {
        email: true,
        inApp: true
      }
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Settings</h2>
          
          <div className="space-y-4">
            <Input
              label="Full Name"
              {...register('fullName')}
              error={errors.fullName?.message}
            />
            
            <Input
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            
            <Input
              label="Phone Number"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
            />
            
            <Input
              label="Job Title"
              {...register('title')}
              error={errors.title?.message}
            />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Notification Preferences</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('notificationPreferences.email')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Email notifications</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('notificationPreferences.inApp')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">In-app notifications</span>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}