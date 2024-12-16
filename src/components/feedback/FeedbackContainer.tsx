import React, { useState } from 'react';
import { RatingStep } from './RatingStep';
import { FollowUpForm } from './FollowUpForm';
import { FeedbackSuccess } from './FeedbackSuccess';
import type { Survey } from '../../types/survey';
import { parseTrackingCode } from '../../utils/survey';

interface FeedbackContainerProps {
  trackingCode: string;
  survey: Survey;
  onSubmit: (data: any) => Promise<void>;
}

interface FeedbackData {
  rating: number;
  [key: string]: unknown;
}

export function FeedbackContainer({ trackingCode, survey, onSubmit }: FeedbackContainerProps) {
  const [step, setStep] = useState<'rating' | 'followUp' | 'success'>('rating');
  const [rating, setRating] = useState<number>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  let tracking;
  try {
    tracking = parseTrackingCode(trackingCode);
    if (
      !tracking ||
      !tracking.surveyId ||
      !tracking.userId ||
      !tracking.groupId ||
      !tracking.locationId
    ) {
      throw new Error('Invalid tracking code format');
    }
  } catch (err) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-2 font-medium text-red-600">Invalid feedback link</div>
        <div className="text-sm text-gray-600">
          Please check the URL and try again. If the problem persists, contact support.
        </div>
      </div>
    );
  }

  const handleRating = async (value: number) => {
    setRating(value);
    setStep('followUp');
  };

  const handleFollowUp = async (data: FeedbackData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        rating,
        trackingCode,
        surveyId: tracking.surveyId,
        userId: tracking.userId,
        groupId: tracking.groupId,
        locationId: tracking.locationId,
        timestamp: new Date().toISOString(),
      });
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {step === 'rating' && (
        <RatingStep style={survey.ratingStyle} value={rating} onChange={handleRating} />
      )}

      {step === 'followUp' && rating && (
        <FollowUpForm
          initialRating={rating}
          questions={survey.questions}
          reasons={[
            'Product Quality',
            'Customer Service',
            'Delivery Time',
            'Price',
            'User Experience',
            'Other',
          ]}
          onSubmit={handleFollowUp}
          isLoading={isSubmitting}
        />
      )}

      {step === 'success' && (
        <FeedbackSuccess
          message={
            survey.successMessage ||
            'We appreciate your feedback and will use it to improve our services.'
          }
        />
      )}
    </div>
  );
}
