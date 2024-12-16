import React from 'react';
import { useParams } from 'react-router-dom';
import { FeedbackForm } from '../../components/feedback/FeedbackForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useSurveys } from '../../hooks/useSurveys';
import { useFeedback } from '../../hooks/useFeedback';
import { parseTrackingCode } from '../../utils/survey';
import { useUIStore } from '../../store/uiStore';

export default function FeedbackPage() {
  const { trackingCode } = useParams<{ trackingCode: string }>();
  const showToast = useUIStore(state => state.showToast);
  const { submitFeedback } = useFeedback();
  const {
    survey,
    isLoading: isSurveyLoading,
    error: surveyError,
  } = useSurveys(trackingCode ? parseTrackingCode(trackingCode!).surveyId : '');

  // Parse tracking code first
  let tracking;
  try {
    tracking = parseTrackingCode(trackingCode!);
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="px-4 text-center">
          <div className="mb-4">
            <div className="mx-auto h-12 w-12 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Invalid Feedback Link</h1>
          <p className="mt-2 text-gray-600">
            The feedback link you're trying to access is invalid or has expired. Please check the
            URL and try again.
          </p>
        </div>
      </div>
    );
  }

  if (isSurveyLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (surveyError || !survey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="px-4 text-center">
          <div className="mb-4">
            <div className="mx-auto h-12 w-12 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Survey Not Found</h1>
          <p className="mt-2 text-gray-600">
            {surveyError?.message ||
              "The survey you're looking for doesn't exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await submitFeedback({
        ...data,
        surveyId: tracking.surveyId,
        userId: tracking.userId,
        groupId: tracking.groupId,
        locationId: tracking.locationId,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      showToast('error', 'Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg bg-white shadow-sm">
          <div
            className="border-b p-6"
            style={{
              backgroundColor: survey.branding?.primaryColor || '#3B82F6',
              color: '#ffffff',
            }}
          >
            {survey.branding?.logo && (
              <img src={survey.branding.logo} alt="Company Logo" className="mb-4 h-8" />
            )}
            <h1 className="text-2xl font-semibold">{survey.title}</h1>
            {survey.description && <p className="mt-2 text-white/80">{survey.description}</p>}
          </div>

          <div className="p-6">
            <FeedbackForm survey={survey} trackingCode={trackingCode!} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
