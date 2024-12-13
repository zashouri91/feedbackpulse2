import React from 'react';
import { useParams } from 'react-router-dom';
import { FeedbackForm } from '../../components/feedback/FeedbackForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useSurveys } from '../../hooks/useSurveys';
import { useFeedback } from '../../hooks/useFeedback';
import { parseTrackingCode } from '../../utils/survey';

export default function FeedbackPage() {
  const { trackingCode } = useParams<{ trackingCode: string }>();
  const tracking = parseTrackingCode(trackingCode!);
  const { survey, isLoading: isSurveyLoading } = useSurveys(tracking?.surveyId);
  const { submitFeedback } = useFeedback();

  if (!tracking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">Invalid Feedback Link</h1>
          <p className="mt-2 text-gray-600">
            The feedback link you're trying to access is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  if (isSurveyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">Survey Not Found</h1>
          <p className="mt-2 text-gray-600">
            The survey you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div 
            className="p-6 border-b"
            style={{ 
              backgroundColor: survey.branding.primaryColor,
              color: '#ffffff'
            }}
          >
            {survey.branding.logo && (
              <img
                src={survey.branding.logo}
                alt="Company Logo"
                className="h-8 mb-4"
              />
            )}
            <h1 className="text-2xl font-semibold">{survey.title}</h1>
            {survey.description && (
              <p className="mt-2 text-white/80">{survey.description}</p>
            )}
          </div>

          <div className="p-6">
            <FeedbackForm
              survey={survey}
              trackingCode={trackingCode!}
              onSubmit={submitFeedback}
            />
          </div>
        </div>
      </div>
    </div>
  );
}