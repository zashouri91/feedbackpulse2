import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { QuestionBuilder } from '../../components/surveys/QuestionBuilder';
import { BrandingSettings } from '../../components/surveys/BrandingSettings';
import { AssignmentSettings } from '../../components/surveys/AssignmentSettings';
import type { Survey, Question } from '../../types/survey';

const surveySchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  questions: z.array(z.object({
    id: z.string(),
    type: z.enum(['rating', 'text', 'multipleChoice']),
    text: z.string().min(1, 'Question text is required'),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
    conditionalLogic: z.object({
      dependsOn: z.string(),
      showIf: z.any()
    }).optional()
  })).min(1, 'At least one question is required'),
  branding: z.object({
    logo: z.string().optional(),
    primaryColor: z.string(),
    secondaryColor: z.string()
  }),
  assignedTo: z.object({
    groups: z.array(z.string()).optional(),
    locations: z.array(z.string()).optional(),
    users: z.array(z.string()).optional()
  })
});

type SurveyFormData = z.infer<typeof surveySchema>;

interface SurveyBuilderProps {
  initialData?: Survey;
  onSubmit: (data: SurveyFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function SurveyBuilder({ initialData, onSubmit, isLoading }: SurveyBuilderProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: initialData || {
      questions: [],
      branding: {
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af'
      },
      assignedTo: {}
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
        <div className="space-y-4">
          <Input
            label="Survey Title"
            {...register('title')}
            error={errors.title?.message}
          />
          
          <Input
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            multiline
            rows={3}
          />
        </div>
      </div>

      <QuestionBuilder control={control} />
      <BrandingSettings control={control} />
      <AssignmentSettings control={control} />

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Survey'}
        </Button>
      </div>
    </form>
  );
}