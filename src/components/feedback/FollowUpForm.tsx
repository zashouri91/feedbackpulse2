import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import type { Question } from '../../types/survey';

const followUpSchema = z.object({
  rating: z.number().min(1).max(5),
  reason: z.string().min(1, 'Please select a reason'),
  comment: z.string().optional(),
  answers: z.record(z.string()).optional(),
  contact: z.boolean().optional(),
  email: z.string().email().optional()
});

type FollowUpData = z.infer<typeof followUpSchema>;

interface FollowUpFormProps {
  initialRating: number;
  questions: Question[];
  reasons: string[];
  onSubmit: (data: FollowUpData) => Promise<void>;
  isLoading?: boolean;
}

export function FollowUpForm({
  initialRating,
  questions,
  reasons,
  onSubmit,
  isLoading
}: FollowUpFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FollowUpData>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      rating: initialRating,
      contact: false
    }
  });

  const wantsContact = watch('contact');

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            key={question.id}
            label={question.text}
            multiline
            rows={3}
            {...register(`answers.${question.id}`)}
            error={errors.answers?.[question.id]?.message}
          />
        );

      case 'multipleChoice':
        return (
          <Select
            key={question.id}
            label={question.text}
            {...register(`answers.${question.id}`)}
            error={errors.answers?.[question.id]?.message}
          >
            <option value="">Select an option</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Select
        label="What was the main reason for your rating?"
        {...register('reason')}
        error={errors.reason?.message}
      >
        <option value="">Select a reason</option>
        {reasons.map((reason) => (
          <option key={reason} value={reason}>
            {reason}
          </option>
        ))}
      </Select>

      <Input
        label="Additional Comments"
        multiline
        rows={4}
        placeholder="Tell us more about your experience..."
        {...register('comment')}
        error={errors.comment?.message}
      />

      {questions.map(renderQuestion)}

      <div className="space-y-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('contact')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            I'd like to be contacted about my feedback
          </span>
        </label>

        {wantsContact && (
          <Input
            type="email"
            label="Email Address"
            {...register('email')}
            error={errors.email?.message}
          />
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
    </form>
  );
}