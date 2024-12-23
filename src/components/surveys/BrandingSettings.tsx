import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from '../ui/Input';

interface BrandingSettingsProps {
  control: Control<any>;
}

export function BrandingSettings({ control }: BrandingSettingsProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-medium text-gray-900">Branding</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Logo URL"
          type="url"
          placeholder="https://example.com/logo.png"
          {...control.register('branding.logo')}
        />

        <Input label="Primary Color" type="color" {...control.register('branding.primaryColor')} />

        <Input
          label="Secondary Color"
          type="color"
          {...control.register('branding.secondaryColor')}
        />
      </div>
    </div>
  );
}
