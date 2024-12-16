import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { RatingStep } from './RatingStep';
import { FeedbackSuccess } from './FeedbackSuccess';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { Survey } from '../../types/survey';

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  reason: z.string().min(1, 'Please select a reason'),
  comment: z.string().optional(),
  answers: z.record(z.string()).optional(),
  contact: z.boolean().optional(),
  email: z.string().email().optional(),
});

type FeedbackData = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  survey: Survey;
  trackingCode: string;
  onSubmit: (data: FeedbackData) => Promise<void>;
}

export function FeedbackForm({ survey, trackingCode, onSubmit }: FeedbackFormProps) {
  const [step, setStep] = useState<'rating' | 'details' | 'success'>('rating');
  const [rating, setRating] = useState<number>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FeedbackData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      contact: false,
    },
  });

  const wantsContact = watch('contact');

  const handleRating = (value: number) => {
    setRating(value);
    setStep('details');
  };

  const handleSubmitForm = async (data: FeedbackData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        rating: rating!,
        trackingCode,
      });
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'success') {
    return <FeedbackSuccess message={survey.successMessage || 'Thank you for your feedback!'} />;
  }

  if (step === 'rating') {
    return (
      <div className="mx-auto max-w-xl py-12">
        <RatingStep style={survey.ratingStyle} value={rating} onChange={handleRating} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="mx-auto max-w-xl space-y-6 py-12">
      <Select
        label="What was the main reason for your rating?"
        {...register('reason')}
        error={errors.reason?.message}
      >
        <option value="">Select a reason</option>
        {survey.reasons.map(reason => (
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

      {survey.questions.map(question => (
        <div key={question.id}>
          {question.type === 'text' ? (
            <Input
              label={question.text}
              multiline
              rows={3}
              {...register(`answers.${question.id}`)}
              error={errors.answers?.[question.id]?.message}
            />
          ) : question.type === 'multipleChoice' ? (
            <Select
              label={question.text}
              {...register(`answers.${question.id}`)}
              error={errors.answers?.[question.id]?.message}
            >
              <option value="">Select an option</option>
              {question.options?.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          ) : null}
        </div>
      ))}

      <div className="space-y-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('contact')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">I'd like to be contacted about my feedback</span>
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

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => setStep('rating')}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Submitting...</span>
            </>
          ) : (
            'Submit Feedback'
          )}
        </Button>
      </div>
    </form>
  );
}
