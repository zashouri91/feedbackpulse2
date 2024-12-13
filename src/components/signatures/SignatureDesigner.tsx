import React, { useState } from 'react';
import { Palette, Image, Type, Layout } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { colorSchema, urlSchema } from '../../utils/validation';

interface SignatureDesignerProps {
  initialData?: {
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
    logo?: string;
    primaryColor?: string;
    layout?: 'vertical' | 'horizontal';
  };
  onChange: (data: any) => void;
}

export function SignatureDesigner({ initialData, onChange }: SignatureDesignerProps) {
  const [data, setData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    logo: '',
    primaryColor: '#2563eb',
    layout: 'vertical' as const,
    ...initialData
  });

  const handleChange = (field: string, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onChange(newData);
  };

  const validateField = (field: string, value: string) => {
    try {
      if (field === 'logo') {
        urlSchema.parse(value);
      } else if (field === 'primaryColor') {
        colorSchema.parse(value);
      }
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">
            <Type className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="style">
            <Palette className="h-4 w-4 mr-2" />
            Style
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Layout className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Input
            label="Full Name"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <Input
            label="Job Title"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <Input
            label="Phone Number"
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <Input
            label="Logo URL"
            type="url"
            value={data.logo}
            onChange={(e) => handleChange('logo', e.target.value)}
            error={!validateField('logo', data.logo) ? 'Invalid URL' : undefined}
          />
          <Input
            label="Primary Color"
            type="color"
            value={data.primaryColor}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
          />
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <Select
            label="Layout Style"
            value={data.layout}
            onChange={(e) => handleChange('layout', e.target.value)}
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </Select>
        </TabsContent>
      </Tabs>
    </div>
  );
}