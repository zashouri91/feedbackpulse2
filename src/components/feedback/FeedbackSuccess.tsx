import React from 'react';
import { CheckCircle } from 'lucide-react';

interface FeedbackSuccessProps {
  message?: string;
}

export function FeedbackSuccess({ message }: FeedbackSuccessProps) {
  return (
    <div className="py-12 text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-gray-900">Thank you for your feedback!</h2>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
