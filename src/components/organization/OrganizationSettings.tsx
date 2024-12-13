import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useOrganization } from '../../hooks/useOrganization';

const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name is required'),
  domain: z.string().optional(),
  settings: z.object({
    branding: z.object({
      primaryColor: z.string(),
      secondaryColor: z.string(),
      logo: z.string().optional()
    }),
    emailSettings: z.object({
      defaultSignatureTemplate: z.string(),
      allowCustomization: z.boolean()
    })
  })
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

export function OrganizationSettings() {
  const { organization, updateOrganization, isLoading } = useOrganization();
  const { register, handleSubmit, formState: { errors } } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: organization
  });

  const onSubmit = async (data: OrganizationFormData) => {
    await updateOrganization(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Organization Settings</h2>
        
        <div className="space-y-4">
          <Input
            label="Organization Name"
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="Domain"
            {...register('domain')}
            error={errors.domain?.message}
            placeholder="example.com"
          />

          <Input
            label="Logo URL"
            {...register('settings.branding.logo')}
            error={errors.settings?.branding?.logo?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Primary Color"
              type="color"
              {...register('settings.branding.primaryColor')}
              error={errors.settings?.branding?.primaryColor?.message}
            />

            <Input
              label="Secondary Color"
              type="color"
              {...register('settings.branding.secondaryColor')}
              error={errors.settings?.branding?.secondaryColor?.message}
            />
          </div>

          <Input
            label="Default Signature Template"
            multiline
            rows={4}
            {...register('settings.emailSettings.defaultSignatureTemplate')}
            error={errors.settings?.emailSettings?.defaultSignatureTemplate?.message}
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('settings.emailSettings.allowCustomization')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Allow users to customize their signatures
            </span>
          </label>
        </div>

        <div className="mt-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}